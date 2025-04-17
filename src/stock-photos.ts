import { createApi } from 'unsplash-js';
import nodeFetch, { RequestInit } from 'node-fetch';
import { Config } from './types.js';
import dotenv from 'dotenv';
dotenv.config();

export class UnsplashApi {
  private unsplashApi;

  constructor(config: Config) {

    this.unsplashApi = createApi({
      accessKey: config.unsplashAccessKey || "",
      fetch: nodeFetch as unknown as typeof fetch,
      // fetch: fetchWithTimeout as unknown as typeof fetch,
    });
  }

  async searchPhotosByQuery(searchTerm: string, numberOfPhotos: number = 3): Promise<string[]> {
    try {
    
      const apiResponse = await this.unsplashApi.photos.getRandom({query : searchTerm, count: numberOfPhotos})

      if (apiResponse.type !== 'success') {
        return [];
      }

      const photoUrls = (apiResponse.response as UnsplashPhoto[]).map((photo: UnsplashPhoto) => photo.urls.small);

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