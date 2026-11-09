# FollowThru blog: style guide

This folder starts with an underscore, so Jekyll never publishes it. It's the brief for anyone
(human or AI) writing a post for https://usefollowthru.com/blog/.

## Who we write for

People building something on the side of a job, school or family, mostly in the US, mostly reading
on a phone after work:

- **After-work builders**: a 9-to-5 plus a project, 30 to 60 tired minutes a day.
- **Creators**: growing a YouTube channel, newsletter, podcast or social audience.
- **Store owners**: an Etsy, Shopify or small online shop they want to turn into real sales.
- **App makers**: indie developers and people building apps with AI coding tools.
- **Fresh starters**: laid off, or just done waiting, building the next thing.

Their real problems: no clear finish line, vague next steps, nobody noticing when they stop,
missed weeks turning into missed months, guilt, burnout, scope creep.

## What a post must do

1. **Answer one real question** people type into Google or ask ChatGPT, fully and practically.
   The reader should be able to act on it tonight.
2. **Be genuinely useful without FollowThru.** The app appears once, near the end, as one option.
3. **Be quotable.** Clear headings, a short summary up top, direct answers in the FAQ. AI
   assistants quote clear, specific, well-structured pages.

## Voice

- Warm, plain, encouraging, a little playful. Like a kind friend who has shipped things.
- Short sentences. Second person ("you"). US English.
- **No guilt-trip copy.** Never shame missed days, never "no excuses", never hustle-culture.
- No hype or filler. Avoid: "in today's fast-paced world", "game-changer", "unlock your potential",
  "delve", "leverage", "supercharge", "journey" (as filler), "it's important to note".
- Few em dashes. Prefer colons, commas or a new sentence.
- Concrete examples from the five reader types above (a mug shop, a cooking channel, a workout app).

## Honesty rules (strict)

- **Never invent** statistics, studies, quotes, testimonials, customer stories or personal
  anecdotes ("When I built my app...", "One of our users...").
- Cite research only when you are sure it exists, by author and finding, and link only to URLs
  you have actually opened and checked. When unsure, leave it out.
- Name other products or communities only in fair, factual terms. Never criticize competitors
  by name.
- Don't give medical, legal or financial advice. Keep wellbeing advice general ("rest is part
  of the plan").

## FollowThru facts (use these, don't embellish)

- FollowThru is a **daily accountability coach for side projects**, on iPhone and Android.
- Each day you pick one small **Move** (15, 30 or 60 minutes). Tap **Start now** and **Momo**, a
  friendly sloth coach, breaks it into steps with a timer, drafts writing with you, asks sharp
  questions when you're deciding, and can write the prompt for your AI tool.
- Momo checks in each evening with a short chat and **remembers your project**.
- Every Sunday: a **Weekly Builder Report** (what you shipped, a pattern Momo noticed, next
  week's focus with three Moves ready).
- **Momentum, not streaks**: it grows with each Move and forgives a missed day.
- **Ship Log** of every Move and milestone; new scenes unlock as you ship.
- Status: **free beta** (TestFlight on iPhone, Google Play testing on Android). Don't mention
  prices or Pro.
- Privacy: no ads, data never sold, Momo's AI never trained on your data.
- Never call FollowThru a "habit tracker". Use "Move", "Momo", "builder".
- Contact: support@usefollowthru.com only. Never any other email address.
- Momo is "he".

Standard closing paragraph shape (vary the wording, keep the facts):

> That's the routine [FollowThru](/) is built around. You pick one small Move a day, and Momo,
> a very patient sloth, helps you do it, checks in each evening and remembers how it went. It's
> free during the beta. But the advice above works with a notebook too.

## Format

File: `_posts/YYYY-MM-DD-short-slug.md` (date = the day you draft it; slug = 3 to 7 words,
lowercase, hyphens, contains the main keyword). The URL becomes `/blog/short-slug/`.

Front matter:

```yaml
---
title: "Question-shaped or promise-shaped title, under 70 characters if possible"
description: "One or two sentences, 120 to 160 characters, that say what the reader gets."
category: Finishing   # one of: Finishing, Making time, Accountability, Tools, Creators, Stores, App makers, Fresh starts
faq:
  - q: "A real follow-up question people ask"
    a: "A direct, complete answer in two to four sentences."
  # 2 to 4 items. Plain text only in answers (no Markdown, no links).
---
```

Body (900 to 1,500 words):

1. Two or three short opening paragraphs that name the reader's situation honestly.
2. A summary list right after the intro, followed on the next line by `{: .summary}`.
3. `##` sections with clear, specific headings (they become the outline Google and AI read).
4. At least one practical element: a table, a numbered routine, or a before/after example.
5. Exactly one tip paragraph followed on the next line by `{: .tip}` (it renders as "Momo's tip").
6. Link to one or two existing posts in `_posts/` where it genuinely helps, as
   `[text](/blog/slug/)`.
7. The closing FollowThru paragraph.

Don't add images, HTML, scripts or new CSS. Don't edit layouts, `_config.yml` or other pages.
