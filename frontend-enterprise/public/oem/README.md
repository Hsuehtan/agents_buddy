# OEM brand assets

Place customer-approved assets in this directory and reference them from
`src/config/oem-brand.ts` or the supported `VITE_OEM_*` environment variables.

Recommended filenames:

- `logo.svg` — horizontal logo lockup with a transparent background
- `logo-mark.svg` — compact mark for the collapsed sidebar
- `favicon.svg` — browser favicon
- `login-artwork.webp` — login-page product artwork
- `social-preview.png` — 1200 × 630 social preview image

Do not commit customer assets until their redistribution terms permit inclusion
in the open-source OEM build.

## Configuration

- Set brand text, links and default asset URLs in `src/config/oem-brand.ts`.
- Use the documented `VITE_OEM_*` variables in `.env.example` for supported build-time overrides.
- Set the sidebar and fixed shell palette in `OEM_SHELL_THEME`; these colors never change the workspace theme.
- Keep customer assets under `/oem/` so a rebrand does not require changing component imports.

## Customer material checklist

- Chinese and English product/company names, short product name and one-line descriptor
- Copyright text, support URL, documentation URL and release URL
- Horizontal logo (SVG), compact logo mark (SVG), favicon SVG and 512 × 512 app icon
- Login artwork (recommended 1600 × 1200 WebP/PNG)
- Onboarding gallery/profile images at the current card aspect ratios
- Default employee and role avatars (recommended 512 × 512)
- Social preview image (1200 × 630 PNG)
- Export filename prefix
- Shell/background, outline, sidebar foreground/muted/hover/active/border/focus colors
- Redistribution authorization for every customer-supplied image and font

Until those materials are supplied, the current checked-in assets remain as safe
fallbacks. Do not replace source assets with guessed or unlicensed artwork.
