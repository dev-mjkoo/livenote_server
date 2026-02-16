# LiveNote Letter Localization Policy

Developer letters must always be published in all 6 locales together.

## Locales and routes
- Korean: `/letter/kr/`
- English: `/letter/us/`
- Japanese: `/letter/jp/`
- Chinese (Simplified): `/letter/zh-hans/`
- Chinese (Traditional): `/letter/zh-hant/`
- German: `/letter/de/`

## Files to update for every new letter
- `/docs/letter/kr/letters.json`
- `/docs/letter/us/letters.json`
- `/docs/letter/jp/letters.json`
- `/docs/letter/zh-hans/letters.json`
- `/docs/letter/zh-hant/letters.json`
- `/docs/letter/de/letters.json`

And mirror the same files under `/public/letter/...`.

## Ordering rule
- Insert new letter object at the top of each `letters.json` array.
- The first item is treated as the latest letter and opens by default.

## JSON shape
```json
{
  "date": "YYYY-MM-DD",
  "title": "string",
  "body": ["paragraph 1", "paragraph 2", "paragraph 3"]
}
```

## QA checklist
- Route check: `/letter/kr /letter/us /letter/jp /letter/zh-hans /letter/zh-hant /letter/de`
- Latest letter shown first in all locales
- No missing translation in any locale
