# Portfolio v2

A rebuild of the portfolio in the visual language of
[tanishparsana.com](https://tanishparsana.com)
([source](https://github.com/tparsana/tparsana-portfolio)) — the animated WebGL
gradient, the floating glass nav island, adaptive text tone, the hover-to-expand
timeline and the card grid — with this site's own content and palette.

No build step, no dependencies, no Node. Open `index.html` and it runs.

## What came from where

The reference site is Vite + React + TypeScript + Tailwind + shadcn/ui, and uses
`ogl` for WebGL. This is a static port:

| Reference | Here |
| --- | --- |
| `Grainient.tsx` + `ogl` | `js/grainient.js` — identical GLSL, raw WebGL2 |
| `lib/adaptive-text.ts` | `js/adaptive-tone.js` — identical sampling logic |
| Tailwind HSL tokens | `css/tokens.css` |
| `Navigation.tsx`, `TimelineItem.tsx`, `ProjectCard.tsx` … | `css/style.css` + `js/main.js` |
| React state / data files | `js/data.js` |

The palette is the one deliberate divergence. The reference runs a sage-teal
(`#98B5AF` / `#1c373e` / `#425d64`); this uses the same pale / deep / mid
relationship rotated to the cyan-navy the v1 site already used
(`#9ebed8` / `#16293f` / `#3d5c7a`). Set them in `css/tokens.css` and
`js/main.js` (`initBackground`).

## Editing

Almost everything lives in `js/data.js` — hero lines, about copy, experience,
education, publications, projects, tech stack, contact details. The rest of the
JS just renders it.

## Before this goes live

Three things are deliberately left blank rather than guessed at:

1. **About photo** — `about.images` is an empty array, so the About section
   shows a dashed "add a photo" placeholder. `assets/img/profile-img.jpg` is the
   stock photo that shipped with the v1 Bootstrap template, not you, so it is
   not wired up. Add real photos; list two or more and they cross-fade.
2. **Contact form** — `web3FormsKey` is empty, so the form falls back to opening
   the visitor's mail client. Get a free key at <https://web3forms.com> and drop
   it in to receive submissions directly.
3. **GitHub** — `contact.github` is empty and the icon/link is hidden. Fill it in
   and it appears in both the contact list and the footer.

## Notes

- Project cards link to the existing v1 case-study pages (`../AITutor.html`
  etc.), which still carry the old styling. Manufacturing Process Monitoring has
  no case-study page in v1, so that card has no button.
- The resume modal reads `../Swapnil_Gautam.pdf`. Add more entries to `resumes`
  in `data.js` if you want role-specific versions.
- If WebGL2 is unavailable the background falls back to a static CSS gradient
  and adaptive tone stays on its light default.
- The custom cursor is skipped on touch devices and when the visitor has
  `prefers-reduced-motion` set.

## Deploying

It is plain static files in a subdirectory, so it deploys exactly like v1 —
the live URL is just `/v2/`. To promote it to the root later, move the contents
of `v2/` up one level and fix the `../` asset paths in `js/data.js` and
`README`-referenced links.
