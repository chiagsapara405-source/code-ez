## CodeBuddy — Web MVP

A web version of your spec (Lovable doesn't support React Native/Expo). Same 2 screens, same dark card UI, same AI output structure, OpenAI `gpt-4o-mini` via your own key.

### Screens

**1. Input screen (`/`)**
- Title "CodeBuddy", subtitle "Explain code. Crack exams."
- Large multiline code textarea (monospace)
- Language dropdown: C, C++, JavaScript
- "Explain Code" button — disabled when empty
- On submit → navigate to Result, passing code + language

**2. Result screen (`/result`)**
- Loading state (spinner) while AI responds
- "Exam Mode" toggle in header — when ON, shows only Summary + Questions
- Five cards, each with title, content, and Copy button:
  1. 🧠 Explanation (line-by-line)
  2. 📌 Summary
  3. ⚠️ Mistakes
  4. ❓ Exam Questions (list)
  5. 🧪 Practice Tasks (list)
- Back button to return to input
- Scrollable, mobile-first layout

### Design

- Dark theme: background `#0D0D0D`, cards slightly lighter, subtle border
- Rounded corners 12–16px, generous spacing
- Clean sans-serif typography, monospace for code
- Section emoji icons, no animations
- All colors via design tokens in `index.css` + `tailwind.config.ts`

### AI Integration

- OpenAI `gpt-4o-mini` via `https://api.openai.com/v1/chat/completions`
- Your API key stored as a **backend secret** (`OPENAI_API_KEY`) — never shipped to the browser
- A Lovable Cloud edge function (`explain-code`) receives `{ code, language }`, calls OpenAI with your strict JSON prompt, parses the response safely, and returns the structured object
- Frontend calls the edge function via the Supabase client
- Errors (network, bad key, malformed JSON, missing fields) are caught and surfaced as a toast + fallback UI; missing fields render as "—" so the app never crashes

### Folder structure

```text
src/
  pages/
    Index.tsx         # Input screen
    Result.tsx        # Result screen
    NotFound.tsx
  components/
    ResultCard.tsx    # Title + content + Copy button
    LanguageSelect.tsx
    ExamModeToggle.tsx
  services/
    explainCode.ts    # calls the edge function
  App.tsx             # routes: /, /result
supabase/
  functions/
    explain-code/
      index.ts        # OpenAI call + JSON parsing
  config.toml
```

### Setup steps

1. Enable Lovable Cloud (needed to host the edge function + store the secret).
2. Prompt you for `OPENAI_API_KEY` and store it securely.
3. Create the `explain-code` edge function with the exact prompt from your spec.
4. Build the two screens, components, service, and design tokens.
5. Wire navigation and Exam Mode toggle.

### Out of scope (per your spec)

No auth, no database, no notifications, no animations, no extra themes.

### Note on portability

If you later want this as a real Expo app, the prompt, JSON shape, and component logic here translate cleanly — only the UI primitives (`View`/`Text` vs `div`) and navigation would need swapping.