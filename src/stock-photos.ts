import { createApi } from 'unsplash-js';
import nodeFetch, { RequestInit } from 'node-fetch';
import { Config } from './types.js';
import dotenv from 'dotenv';
dotenv.config();

export class UnsplashApi {
  private unsplashApi;

  constructor(config: Config) {
    const fetchWithTimeout = (url: string, options: RequestInit = {}) => {
      // Set timeout to 30 seconds (30000ms) or any duration you prefer
      const timeoutDuration = 30000;
      
      const controller = new AbortController();
      const { signal } = controller;
      
      const timeout = setTimeout(() => {
        controller.abort();
      }, timeoutDuration);
      
      const fetchOptions: RequestInit = {
        ...options,
        signal
      };
      
      return nodeFetch(url, fetchOptions)
        .finally(() => clearTimeout(timeout));
    };

    this.unsplashApi = createApi({
      accessKey: config.unsplashAccessKey || "",
      fetch: nodeFetch as unknown as typeof fetch,
      // fetch: fetchWithTimeout as unknown as typeof fetch,
    });
  }

  async searchPhotosByQuery(searchTerm: string, numberOfPhotos: number = 3): Promise<string[]> {
    try {
      var apiResponse = await this.unsplashApi.search.getPhotos({
        query: searchTerm,
        perPage: numberOfPhotos,
      });

      if (apiResponse.type !== 'success') {
        return [];
      }

      const photoUrls = apiResponse.response.results.map((photo: UnsplashPhoto) => photo.urls.small);
      return photoUrls;
    } catch (error) {
      console.error('Error fetching photos:', error);
      return [];
    }
  }
}

interface UnsplashPhoto {
  id: string;
  urls: {
    small: string;
    [key: string]: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
}