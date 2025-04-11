import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';
import { Config } from './types.js';
import dotenv from 'dotenv';
dotenv.config();

export class UnsplashApi {
  private unsplashApi;

  constructor(config: Config) {
    this.unsplashApi = createApi({
      accessKey: config.unsplashAccessKey || "",
      fetch: nodeFetch as unknown as typeof fetch,
    });
  }

  async searchPhotosByQuery(searchTerm: string, numberOfPhotos: number = 3): Promise<string[]> {
    var apiResponse = await this.unsplashApi.search.getPhotos({
      query: searchTerm,
      perPage: numberOfPhotos,
    });

    if (apiResponse.type !== 'success') {
      return [];
    }

    const photoUrls = apiResponse.response.results.map((photo: UnsplashPhoto) => photo.urls.small);

    return photoUrls;
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