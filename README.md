# threads-mcp

This project is a TypeScript-based Node MCP (Model Context Protocol) Server that would create post to Threads (a social media platform by Meta). You can also nclude stock photos from Unsplash in your post.  

## Project Structure

```
threads-mcp
├── src
│   ├── index.ts                # Entry point 
│   ├── stock-photos.ts         # Unsplash http client
│   ├── threads-api.ts           # Threads Api HTTP Client
│   ├── threads-server.ts        # Threads MCP Server
│   └── types.ts                # Type definitions
├── package.json              # NPM package configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Quick Start
1. Clone the repository:
```bash
git clone https://github.com/tttn13/threads-mcp
cd threads-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build:
```bash
npm run build
```

4. Run:
```bash
npm start
```

5. Create a Threads Developer account and get your API keys 


6. Add this configuration to your Claude Desktop config file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "threads-dev": {
      "command": "node",
      "args": [
        "/Users/path/to/project/build/index.js"
      ],
      "env": {
        "ACCESS_TOKEN": "access_token",
        "HOST": "https://graph.threads.net",
        "APP_ID": "threads_app_id",
        "APP_SECRET": "threads_app_secret",
        "REDIRECT_URI": "public_url",
        "PORT": "3000",
        "INITIAL_USER_ID": "user_id",
        "UNSPLASH_ACCESS_KEY":"access_key",
        "LONG_TOKEN": "long_live_token"
      }
    },
}
```

3. Restart Claude Desktop

That's it! Claude can now interact with Threads through 1 tool:

- `post_thread`: Post a new thread and fetch stock photos from Unsplash

## Example Usage

Try asking Claude:
- "Can you post a thread about cats with photos"

## Development

If you want to contribute or run from source:

1. Clone the repository:
```bash
git clone https://github.com/tttn13/threads-mcp
cd threads-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build:
```bash
npm run build
```

4. Run:
```bash
npm start
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.