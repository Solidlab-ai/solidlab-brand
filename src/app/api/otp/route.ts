import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SignJWT } from "jose";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Tillatte brukere - bare disse kan logge inn på admin-portalen
const USERS: Record<string, { userKey: string; name: string; phone: string }> = {
  "ulrik@solidlab.no":         { userKey: "ulrik", name: "Ulrik", phone: "+4740093494" },
  "hello@ulrik.biz":           { userKey: "ulrik", name: "Ulrik", phone: "+4740093494" },
  "espen@solidlab.no":         { userKey: "espen", name: "Espen", phone: "+4746758731" },
  "espen.haugland2@gmail.com": { userKey: "espen", name: "Espen", phone: "+4746758731" },
};

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "solidlab-fallback-secret-change-in-prod"
);

export async function POST(req: NextRequest) {
  try {
    const action = req.nextUrl.searchParams.get("action");
    const body = await req.json();
    const { email, code } = body;

    const user = USERS[email?.toLowerCase()?.trim()];
    if (!user) {
      return NextResponse.json({ error: "Ukjent epost" }, { status: 400 });
    }

    if (action === "send") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { error: dbError } = await supabase.from("solidlab_otp").insert({
        user_key: user.userKey,
        phone: user.phone,
        code: otp,
        expires_at: expiresAt,
      });

      if (dbError) {
        console.error("[OTP] DB feil:", dbError);
        return NextResponse.json({ error: "DB feil: " + dbError.message }, { status: 500 });
      }

      const elksUser = process.env.ELKS_API_USER;
      const elksSecret = process.env.ELKS_API_SECRET;
      if (!elksUser || !elksSecret) {
        console.error("[OTP] Mangler ELKS env-vars:", { hasUser: !!elksUser, hasSecret: !!elksSecret });
        return NextResponse.json({ error: "SMS ikke konfigurert (mangler env-vars)" }, { status: 500 });
      }
      const auth = Buffer.from(`${elksUser}:${elksSecret}`).toString("base64");

      const params = new URLSearchParams();
      params.append("from", "Solidlab");
      params.append("to", user.phone);
      params.append(
        "message",
        `Din kode til Solidlab brand: ${otp}\nGyldig 10 min.\n\n@brand.solidlab.ai #${otp}`
      );

      const smsRes = await fetch("https://api.46elks.com/a1/sms", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      const smsText = await smsRes.text();
      if (!smsRes.ok) {
        console.error("[OTP] SMS feilet:", smsText);
        return NextResponse.json({ error: "SMS feilet: " + smsText }, { status: 500 });
      }

      return NextResponse.json({
        ok: true,
        hint: `Kode sendt til ${user.phone.slice(0, 7)}***`,
      });
    }

    if (action === "verify") {
      const { data, error } = await supabase
        .from("solidlab_otp")
        .select("*")
        .eq("user_key", user.userKey)
        .eq("code", code)
        .eq("used", false)
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Feil eller utløpt kode" }, { status: 401 });
      }

      await supabase.from("solidlab_otp").update({ used: true }).eq("id", data.id);

      // Opprett JWT-sesjon (gyldig 30 dager)
      const token = await new SignJWT({ userKey: user.userKey, name: user.name })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(SESSION_SECRET);

      const response = NextResponse.json({
        ok: true,
        userKey: user.userKey,
        name: user.name,
      });

      // Sett HTTPOnly cookie
      response.cookies.set("solidlab_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 dager
        path: "/",
      });

      return response;
    }

    if (action === "logout") {
      const response = NextResponse.json({ ok: true });
      response.cookies.delete("solidlab_session");
      return response;
    }

    return NextResponse.json({ error: "Ugyldig action" }, { status: 400 });
  } catch (err: any) {
    console.error("[OTP] Uventet feil:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
