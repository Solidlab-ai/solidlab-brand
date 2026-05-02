// /api/me — returnerer info om innlogget bruker (eller 401)
// Henter friske access/isAdmin fra Supabase i stedet for JWT-claims,
// slik at endringer i tilgang trer i kraft umiddelbart uten ny innlogging.
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "solidlab-fallback-secret-change-in-prod"
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const token = req.cookies.get("solidlab_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    
    // JWT brukes kun til å bekrefte hvem brukeren ER.
    // Tilgang og admin-status hentes friske fra Supabase.
    const userId = payload.userId as string | undefined;
    const email = payload.email as string | undefined;
    
    if (!userId && !email) {
      return NextResponse.json({ error: "invalid session" }, { status: 401 });
    }

    // Slå opp brukeren — først via userId (mest pålitelig), så via email
    let user: any = null;
    if (userId) {
      const { data } = await supabase
        .from("solidlab_team")
        .select("id, name, email, access, is_admin, active")
        .eq("id", userId)
        .eq("active", true)
        .maybeSingle();
      user = data;
    }
    if (!user && email) {
      const { data } = await supabase
        .from("solidlab_team")
        .select("id, name, email, access, is_admin, active")
        .eq("email", email)
        .eq("active", true)
        .maybeSingle();
      user = data;
    }

    if (!user) {
      // Brukeren finnes i JWT, men ikke i database — kan være deaktivert
      return NextResponse.json({ error: "user not found or inactive" }, { status: 401 });
    }

    return NextResponse.json({
      userId: user.id,
      name: user.name,
      email: user.email,
      access: user.access || [],
      isAdmin: !!user.is_admin,
    });
  } catch {
    return NextResponse.json({ error: "invalid session" }, { status: 401 });
  }
}
