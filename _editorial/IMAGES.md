# Blog header images

One header image per post, made with the Higgsfield connector. Jay approved this style on
2026-11-12. It uses his credits: make **one** image per post and never retry more than once.

## Pick one of two kinds

**A. Momo scene.** Use it when the post is about the builder's feelings or routine: starting
again, finishing, motivation, time after work, check-ins. Momo does the thing the post is about.

**B. Topic illustration (no Momo).** Use it when a picture of the subject itself says more:
an online store, a YouTube setup, a phone with an app, a calendar, a weekly plan, a comparison
of tools. Use the same flat style and colours so the blog still looks like one family.

Aim for roughly half and half across the blog. Don't use Momo twice in a row if a topic
illustration would fit better.

## Hard rules for both kinds

- Same style: flat vector editorial illustration, clean dark-brown outlines, soft shadows,
  warm cream background with banana-yellow and green accents.
- **No text, letters or numbers** in the picture (they come out garbled).
- **No real people, no photos, no real brand logos or app screenshots** (no Etsy, YouTube,
  Shopify, Apple or competitor logos). Use generic shapes: "a shop window", "a video play
  button", "a phone with a simple checklist screen".
- Never show another company's mascot or product.
- Nothing sad, stressful or guilt-heavy. Calm, hopeful, a little playful.
- 16:9, one clear subject, uncluttered, with the main subject a little off-centre.

## Generation settings

- Model `gpt_image_2_6`, `aspect_ratio: "16:9"`, `quality: "medium"`, `resolution: "1k"`,
  `output_format: "webp"`.
- Kind A only: attach the Momo reference image as `image_references` (upload `momo-ref.png`
  from `_editorial/` with the media upload tools first). Kind B: no reference image.

## Prompt templates

Fill in the `<scene>` with one concrete, visual moment from the post.

**Kind A (Momo):**

> Flat vector editorial illustration for a blog header, 16:9. The character is exactly the sloth
> from the reference image: friendly brown sloth with spiky brown hair, green headband, dark
> jacket with green stripes, same face and proportions, same clean flat cartoon style. Scene:
> `<scene>`. Palette: warm cream background (#FBF6EE) with banana yellow (#F2B33D) accents and
> green (#1C7F48) details, soft shadows. Simple, uncluttered composition. No text, no letters,
> no logos, no watermark.

**Kind B (topic, no Momo):**

> Flat vector editorial illustration for a blog header, 16:9, clean dark-brown outlines and soft
> shadows, cosy and hopeful mood. Scene: `<scene>`. No people, no characters, no text, no
> letters, no numbers, no logos, no watermark. Palette: warm cream background (#FBF6EE) with
> banana yellow (#F2B33D) accents and green (#1C7F48) details. Simple, uncluttered composition.

Example scenes:

- A: "the sloth gently blows dust off a laptop on a cosy wooden desk, a half-finished project
  sketch beside it, warm morning light" (restarting after a break).
- A: "the sloth happily plants a small green finish-line flag at the end of a short path of
  stepping stones, a checklist board with ticks beside him" (defining done).
- B: "a small handmade-mug shop table at a cosy market stall, a laptop open beside it showing
  a simple shop page made of shapes" (store owners).
- B: "a desk at night with a ring light, a small camera on a tripod and a sticky note wall
  arranged as a simple weekly plan" (posting consistently).

## Saving

- Save to `assets/blog/<slug>.webp`. Keep it under 300 KB: if it's bigger, re-save it at
  1200 px wide, WebP quality 80 (for example with Python Pillow).
- Front matter: `image: /assets/blog/<slug>.webp` and `image_alt:` with a plain one-sentence
  description of the picture.
- If generation fails or the connector isn't available, skip the image and say so in the PR.
