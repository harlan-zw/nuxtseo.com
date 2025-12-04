Search is changing. Outside of search engines, people now get answers directly from [ChatGPT](https://chatgpt.com/), [Claude](https://claude.ai/), and other AI assistants. When these LLMs answer questions about topics related to your site, you want your content to be the source they cite
to drive traffic and engagement back to you.

For that to happen, AI systems need to understand your content. New standards are being shaped like [llms.txt](https://llmstxt.org/) for discoverability and [MCP](https://modelcontextprotocol.io/) for letting agents query your site directly. But these standards are still evolving, and implementing them correctly
can be complex and time-consuming.

- 📄 **llms.txt Generation**: Auto-generates `llms.txt` and `llms-full.txt` at build time
- 🚀 **On-Demand Markdown**: Any route available as `.md` (e.g., `/about` → `/about.md`)
- 🤖 **Smart Bot Detection**: Serves markdown to AI crawlers automatically

Nuxt AI Ready converts your indexable pages into clean markdown that AI systems can consume, generates the right artifacts at build time, and serves AI-friendly formats to bots automatically.
