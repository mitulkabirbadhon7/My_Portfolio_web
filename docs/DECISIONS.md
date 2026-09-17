# Architectural & Security Decisions

## ADR-001: Error Handling & Stack Trace Sanitization
- **Context:** Default error responses in development attached stack traces to all thrown errors, including 4xx validation and not-found routes.
- **Decision:** Restricted stack traces strictly to 500 server crashes in development (`NODE_ENV === 'development' && statusCode >= 500`). All 4xx operational errors omit stack traces regardless of environment. Non-operational 500 messages are masked in production.
- **Consequence:** Eliminates directory mapping and library version enumeration vectors for unauthenticated requests.

## ADR-002: AI Provider Migration to Google Gemini
- **Context:** Initial architecture specified OpenAI SDK with `gpt-4o-mini`.
- **Decision:** Migrated to Google Gemini SDK (`@google/genai`) using `gemini-2.5-flash`.
- **Consequence:** Eliminates paid account dependency during development via Gemini's generous free tier. Internal service maps public `assistant` roles to Gemini's native `model` role structure.