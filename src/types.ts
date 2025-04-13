import { z } from 'zod';

// Configuration schema with validation
export const ConfigSchema = z.object({
    host: z.string().min(1, 'Host is required'),
    redirectUri: z.string().min(1, 'Redirect Uri is required'),
    appId: z.string().min(1, 'App Id is required'),
    appSecret: z.string().min(1, 'APP Secret is required'),
    initialUserId: z.string().min(1, 'User id is required'),
    longToken: z.string().min(1, 'Long TOken is required').optional(),
    unsplashAccessKey: z.string().min(1, 'Unsplash Key is required'),
});

export type Config = z.infer<typeof ConfigSchema>;

export const PostThreadschema = z.object({
    topic: z.string().min(1, 'Threads cannot be empty').max(50, 'Topic cannot exceed 50 characters'),
    text: z.string().min(1, 'Threads cannot be empty').max(500, 'Threads cannot exceed 500 characters'),
    carousel: z.boolean().optional(),
    photosIncluded: z.boolean(),
});

export const AuthCodeSchema = z.object({
    url: z.string()
})

export type AuthCodeArgs = z.infer<typeof AuthCodeSchema>;

export type PostThreadsArgs = z.infer<typeof PostThreadschema>;

export class ThreadsError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly status?: number
    ) {
        super(message);
        this.name = 'ThreadsError';
    }

    static isRateLimit(error: unknown): error is ThreadsError {
        return error instanceof ThreadsError && error.code === 'rate_limit_exceeded';
    }
}
