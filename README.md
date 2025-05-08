# threads-mcp

This project is a TypeScript-based Node MCP (Model Context Protocol) Server that would create post to Threads (a social media platform by Meta). 

The goal of this project is to have the LLM generate a complete social media post—something ready to publish on Threads alongside the images. So the MCP server handled both retrieving relevant visual content and orchestrating the model’s output into something directly usable. It turned a simple query like ‘cats’ into a polished post with supporting visuals, all through a coordinated flow.


![Diagram](https://github.com/tttn13/threads-mcp/blob/main/assets/MCP-chart.png)

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
### Prerequisites 
- Obtain the API Key from Unsplash
- Create an app on Meta Developer platform https://developers.facebook.com/apps 
- Choose ___Access The Threads API___ as use case 
- On main dashboard, click ___Access The Threads API___ > ___Settings___ > Enter ___Redirect Callback URLS___ 
- Obtain these keys : **Threads App ID** , **Threads App secret** , **Redirect Callback URL** and save them in the env section of **threads-dev** in the config file :

```
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
```

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

5. Create a Meta Developer account and get your keys 

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
        "HOST": "https://graph.threads.net",
        "APP_ID": "threads_app_id",
        "APP_SECRET": "threads_app_secret",
        "REDIRECT_URI": "public_url",
        "INITIAL_USER_ID": "threads_user_id",
        "UNSPLASH_ACCESS_KEY":"access_key",
        "PORT": "3000",
      }
    },
}
```

3. Restart Claude Desktop

That's it, the tool is officially connected to Claude Desktop! You still need to go through an authorization process to obtain the long lived token but dw, Claude will walk you through it. 

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