#!/usr/bin/env node
import dotenv from 'dotenv';
import { ThreadsServer } from './threads-server.js'

// Start the server
dotenv.config();

const config = {
  host: process.env.HOST!,
  appId: process.env.APP_ID!,
  appSecret: process.env.APP_SECRET!,
  redirectUri: process.env.REDIRECT_URI!,
  initialUserId: process.env.INITIAL_USER_ID!,
  longToken: process.env.LONG_TOKEN!,
  unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY!
};

const server = new ThreadsServer(config);
server.start().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});