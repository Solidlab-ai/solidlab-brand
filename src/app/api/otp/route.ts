import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SignJWT } from "jose";

export const runtime = "nodejs";

// ============================================================
// SITE_ID — endres per site. Bestemmer hvilken access-tag som
// kreves for å logge inn her.
// ============================================================
const SITE_ID = "brand"; // "domains" | "brand" | "readme"
const SITE_NAME = "Solidlab Brand"; // f.eks. "Solidlab Domains"
const SITE_URL = "brand.solidlab.ai"; // f.eks. "domains.solidlab.ai"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "solidlab-fallback-secret-change-in-prod"
);

// Slå opp bruker basert på epost (matcher email eller email_aliases) + sjekk access
async function lookupUser(email: string) {
  const cleanEmail = email?.toLowerCase()?.trim();
  if (!cleanEmail) return null;

  // First try direct email match
  const { data: byEmail } = await supabase
    .from("solidlab_team")
    .select("id, name, email, email_aliases, phone, access, is_admin, active")
    .eq("email", cleanEmail)
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  if (byEmail) return byEmail;

  // Then try alias match (using contains operator)
  const { data: byAlias } = await supabase
    .from("solidlab_team")
    .select("id, name, email, email_aliases, phone, access, is_admin, active")
    .contains("email_aliases", [cleanEmail])
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  return byAlias || null;
}

export async function POST(req: NextRequest) {
  try {
    const action = req.nextUrl.searchParams.get("action");
    const body = await req.json();
    const { email, code } = body;

    const user = await lookupUser(email);
    if (!user) {
      return NextResponse.json({ error: "Ukjent epost" }, { status: 400 });
    }

    // Sjekk at brukeren har tilgang til DENNE siden
    const access: string[] = user.access || [];
    if (!access.includes(SITE_ID)) {
      return NextResponse.json(
        { error: `Du har ikke tilgang til ${SITE_NAME}. Kontakt en admin.` },
        { status: 403 }
      );
    }

    if (!user.phone) {
      return NextResponse.json(
        { error: "Ingen telefonnummer registrert. Kontakt en admin." },
        { status: 400 }
      );
    }

    const userKey = user.id; // bruk team-medlemmets UUID som userKey

    if (action === "send") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { error: dbError } = await supabase.from("solidlab_otp").insert({
        user_key: userKey,
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
        `Din kode til ${SITE_NAME}: ${otp}\nGyldig 10 min.\n\n@${SITE_URL} #${otp}`
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
        .eq("user_key", userKey)
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

      // JWT inneholder bruker-info + access-array + is_admin
      // Slik at klient/middleware kan vise/skjule UI basert på rettigheter
      const token = await new SignJWT({
        userId: user.id,
        name: user.name,
        email: user.email,
        access: user.access || [],
        isAdmin: !!user.is_admin,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(SESSION_SECRET);

      const response = NextResponse.json({
        ok: true,
        name: user.name,
        access: user.access,
        isAdmin: !!user.is_admin,
      });

      response.cookies.set("solidlab_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
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
