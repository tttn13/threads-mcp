import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    ListToolsRequestSchema,
    CallToolRequestSchema,
    Tool,
    ErrorCode,
    McpError,
    TextContent
} from '@modelcontextprotocol/sdk/types.js';
import { ThreadsApi } from './threads-api.js'
import {
    Config, ConfigSchema, ThreadsError, PostThreadschema
} from './types.js';

export class ThreadsServer {
    private server: Server;
    private client: ThreadsApi;

    constructor(config: Config) {
        const result = ConfigSchema.safeParse(config);
        if (!result.success) {
            throw new Error(`Invalid configuration: ${result.error.message}`);
        }

        this.client = new ThreadsApi(config);
        this.server = new Server({
            name: 'threads-mcp',
            version: '1.0.0'
        }, {
            capabilities: {
                tools: {}
            }
        });

        this.setupHandlers();
    }

    private setupHandlers(): void {
        // Error handler
        this.server.onerror = (error) => {
            console.error('[MCP Error]:', error);
        };

        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.error('Shutting down server...');
            await this.server.close();
            process.exit(0);
        });

        // Register tool handlers
        this.setupToolHandlers();
    }

    private setupToolHandlers(): void {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'post_thread',
                    description: 'Post a new thread to Threads',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            topic: {
                                type: 'string',
                                description: 'The topic of the content of your post',
                                maxLength: 50
                            },
                            text: {
                                type: 'string',
                                description: 'The content of your post',
                                maxLength: 500
                            },
                            carousel: {
                                type: 'boolean',
                                description: 'the type of post to create, carousel or single post',
                            },
                            photosIncluded: {
                                type: 'boolean',
                                description: 'are photos included in the post or only just text',
                            }
                        },
                        required: ['topic', 'text', 'photosIncluded']
                    }
                } as Tool,
            ]
        }));

        // Handle tool execution
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            console.error(`Tool called: ${name}`, args);

            try {
                switch (name) {
                    case 'post_thread':
                        return await this.handlePostThread(args);
                    default:
                        throw new McpError(
                            ErrorCode.MethodNotFound,
                            `Unknown tool: ${name}`
                        );
                }
            } catch (error) {
                return this.handleError(error);
            }
        });
    }

    private async handlePostThread(args: unknown) {
        const result = PostThreadschema.safeParse(args);
        if (!result.success) {
            throw new McpError(
                ErrorCode.InvalidParams,
                `Invalid parameters: ${result.error.message}`
            );
        }

        const { topic, text, carousel, photosIncluded } = result.data;
        let containerId: string[] | undefined
        let mediaId: string | undefined

        if (carousel) {
            containerId = await this.client.createImageContainer(topic, carousel)
        } else {
            if (!photosIncluded) {
                containerId = await this.client.createTextContainer(text)
            } else {
                containerId = await this.client.createImageContainer(topic, false, text)
            }
        }
       
        if (!containerId || containerId.length === 0) {
            return this.handleError(new ThreadsError(`Failed to create container, containerId is ${containerId?.join(',')}`, 'CONTAINER_CREATION_FAILED'));
        }

        await new Promise(resolve => setTimeout(resolve, 15000));

        if (containerId.length == 1) {
            mediaId = await this.client.publishContainer(containerId[0])
        } else {
            const carouselId = await this.client.createCarouselContainer(containerId, text)
            if (carouselId) {
                mediaId = await this.client.publishContainer(carouselId)
            }
        }

        const successMessage = `Threads posted successfully !\nURL: https://threads.com/status/${mediaId}`

        return {
            content: [{
                type: 'text',
                text: successMessage
            }] as TextContent[]
        };
    }

    private handleError(error: unknown) {
        if (error instanceof McpError) {
            throw error;
        }

        if (error instanceof ThreadsError) {
            if (ThreadsError.isRateLimit(error)) {
                return {
                    content: [{
                        type: 'text',
                        text: 'Rate limit exceeded. Please wait a moment before trying again.',
                        isError: true
                    }] as TextContent[]
                };
            }

            return {
                content: [{
                    type: 'text',
                    text: `Threads API error: ${(error as ThreadsError).message}`,
                    isError: true
                }] as TextContent[]
            };
        }

        console.error('Unexpected error:', error);
        throw new McpError(
            ErrorCode.InternalError,
            'An unexpected error occurred'
        );
    }

    async start(): Promise<void> {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Threads MCP server running on stdio');
    }
}