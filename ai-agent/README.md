# LittleWins AI Agent

This folder contains the agent layer. The application keeps persistent user data on-device in IndexedDB (Dexie). There is no server database.

## RAG design

`rag.ts` performs local retrieval over important memories such as failure reasons, constraints, preferences, successful strategies and detected patterns. It uses a lightweight cosine similarity over local term vectors so no embedding service is required. Only the most relevant memories are included in an LLM request.

This gives the app a RAG flow:

1. Store an important failure/reason or pattern locally.
2. Retrieve the most relevant memories for the current conversation/objective.
3. Augment the model prompt with those memories plus recent progress.
4. Generate a personalized reply, quote, or proposed goal adjustment.
5. Save only durable new coaching memories locally.

## LLM

The server route defaults to `gemini-2.5-flash`. Add this to `.env.local`:

```bash
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

The API key is kept server-side. Never place it in `NEXT_PUBLIC_*`.

## Important files

- `prompts.ts` - system behavior and JSON response contract.
- `rag.ts` - local retrieval.
- `client.ts` - builds app context and sends it to the stateless API route.
- `types.ts` - agent response/action types.
- `app/api/ai/chat/route.ts` - secure LLM proxy.
