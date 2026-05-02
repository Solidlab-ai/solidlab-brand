# solidlab-brand

Brand system documentation at https://brand.solidlab.ai

Behind SMS-OTP login. Same allowlist as domains.solidlab.ai and readme.solidlab.ai.

## Stack
- Next.js wrapper around static HTML
- All design content lives in src/public/
- src/middleware.ts protects everything except /login and /api/otp
- src/app/api/otp + /login built using same pattern as domains-solidlab
