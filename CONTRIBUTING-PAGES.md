# Adding or editing a page

One page = one file `src/content/pages/<id>.ts`, exported with `definePage` (types in `src/lib/guide-types.ts`). The file name is the id. The page is built at `/en/<slug>/` and listed in the menu, the footer, the sitemap and `llms.txt` automatically.

## Page types

- **Hub page** (groups `rates`, `waits`, `booking`, `costs`): a `mini:<spec>` tool from `src/lib/mini-specs.ts` or the `finder`, a citable block and 480 words or more of text (tables are not counted).
- **Region page** (group `regions`): `tool: { kind: 'finder', props: { region: '<DVSA region>', sort: 'rate' } }`. Figures and the three shared tables come from `src/lib/region.ts` (`regionFacts`, `regionTables`); the prose is written for that region only.
- **Centre page** (group `centres`, id `centre-<centre id>`): the finder or a mini tool set on the centre, the helpers `h.C(id)`, `h.yearTable`, `h.waitTable`, `h.ageTable`, `h.nearTable`.

## Rules checked by `npx vitest run tests/pages.test.ts`

- `title` 50 to 60 characters, key term first, never starting with UK, Britain, DVSA, How, Which…; `description` 150 to 160 characters.
- `resume`: one paragraph of 120 words or more that answers the page's question with figures.
- `faqs`: 3 to 8 questions, answers of 40 to 90 words, each question used once on the whole site.
- No em dash. British English. No personal advice, no lead, no link to a cancellation app, a driving school, an insurer or a consultant.
- Internal links only through `h.a('<page id>', text)` or `h.cl('<centre id>')`; unknown ids fail the build.
- Every figure comes from the data (`h.E`, `h.F`, `h.C(id)`, `h.P`): never type a rate, a wait, a fee or a date. Every comparison word (above, below, rose, highest…) is computed in code, so it stays true after the monthly update.
- Cite sources with `h.src(key, text)`; the keys are in `src/data/params-2026.json`.
- An estimate says so, with its method (see `/en/method/`).

## Data

`python3 scripts/update-data.py` downloads the DVSA tables (gov.uk content API), the list of nearest centres and rebuilds `src/data/centres.json`, `centres-lite.json`, `theory.json`, `national.json` and `meta.json` (`--offline` reuses `data/raw/dvsa/`). The workflow `.github/workflows/update-data.yml` runs it on the 16th of every month, then the tests and the build. Fees, booking rules and the instructor survey are in `src/data/params-2026.json`, each with its GOV.UK source.
