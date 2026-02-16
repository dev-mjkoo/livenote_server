# LiveNote Letter Localization Policy

Developer letters must always be published in all 6 locales together.

## Locales and routes
- Korean: `/kr/`
- English: `/us/`
- Japanese: `/jp/`
- Chinese (Simplified): `/cn/`
- Chinese (Traditional): `/tw/`
- German: `/de/`

## Files to update for every new letter
- `/docs/kr/letters.json`
- `/docs/us/letters.json`
- `/docs/jp/letters.json`
- `/docs/cn/letters.json`
- `/docs/tw/letters.json`
- `/docs/de/letters.json`

And mirror the same files under `/public/...`.

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
- Route check: `/kr /us /jp /cn /tw /de`
- Latest letter shown first in all locales
- No missing translation in any locale
