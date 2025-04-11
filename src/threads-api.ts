import axios from 'axios';
import { Config } from './types.js';
import { UnsplashApi } from './stock-photos.js';

export class ThreadsApi {
    private host: string;
    private appId: string;
    private appSecret: string;
    private initialUserId: string;
    private redirectUri: string;
    private longToken: string;
    private unsplashClient;

    constructor(config: Config) {
        this.host = config.host || '';
        this.appId = config.appId || '';
        this.appSecret = config.appSecret || '';
        this.initialUserId = config.initialUserId || '';
        this.redirectUri = config.redirectUri;
        this.longToken = config.longToken;
        this.unsplashClient = new UnsplashApi(config);
    }

    async createTextContainer(inputText: string): Promise<string[] | undefined> {
        try {
            const publishUrl = `${this.host}/v1.0/${this.initialUserId}/threads`;

            const publishRes = await axios.post<{ id: string }>(
                publishUrl,
                {
                    media_type: 'TEXT',
                    text: inputText,
                    accessToken: this.longToken
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.longToken}`
                    }
                }
            );

            return [publishRes.data.id];
        } catch (error) {
            console.error('Error getContainer:', error);
            return undefined;
        }
    }

    async publishContainer(mediaId: string): Promise<string | undefined> {
        try {
            const publishUrl = `${this.host}/v1.0/${this.initialUserId}/threads_publish`;
            const publishRes = await axios.post<{ id: string }>(
                publishUrl,
                {
                    creation_id: mediaId
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.longToken}`
                    }
                }
            );
            return publishRes.data.id;
        } catch (error) {
            console.error('Error publishContainer:', error);
            return undefined;
        }
    }

    async createImageContainer(topic: string, isCarousel: boolean, inputText: string = ""): Promise<string[] | undefined> {
        const imageUrls = await this.unsplashClient.searchPhotosByQuery(topic, 2);
        try {
            let mediaIds: string[] = []
            for (const imageUrl of imageUrls) {
                const id = await this.createSingleImage(imageUrl, isCarousel ? "" : inputText);
                mediaIds.push(id)
            }

            console.error(`mediaIds are ${mediaIds.join(",")}`)
            return mediaIds;
        } catch (error) {
            console.error(`Error in creating image container , imageurls are ${imageUrls.join(",")}`);
            return undefined;
        }

    }

    private async createSingleImage(imageUrl: string, inputText: string = ""): Promise<string> {
        try {
            let publishUrl = `${this.host}/v1.0/${this.initialUserId}/threads?media_type=IMAGE&image_url=${encodeURIComponent(imageUrl)}&access_token=${this.longToken}`;

            if (inputText.trim() === "") {
                publishUrl = `${publishUrl}&is_carousel_item=${true.toString()}`
            } 
            else{
                publishUrl = `${publishUrl}&text=${encodeURIComponent(inputText)}`
            }
            console.error(`inputText is ${inputText}, publishUrl is ${publishUrl}`)
            const publishRes = await axios.post<{ id: string }>(publishUrl,
                {
                    headers: {
                        Authorization: `Bearer ${this.longToken}`
                    }
                }
            );
            return publishRes.data.id;

        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    async createCarouselContainer(mediaIds: string[], inputText: string): Promise<string | undefined> {
        try {

            const url = `${this.host}/v1.0/${this.initialUserId}/threads`;
            const publishRes = await axios.post<{ id: string }>(
                url,
                {
                    media_type: 'CAROUSEL',
                    children: mediaIds,
                    text: inputText
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.longToken}`
                    }
                }
            );

            return publishRes.data.id;
        } catch (error) {
            console.error('Error createCarouselContainer:', error);
            return undefined;
        }
    }

    async exchangeForShortToken(authCode: string): Promise<string> {
        try {
            const url = `${this.host}/oauth/access_token`;
            const response = await axios.post<{ access_token: string }>(url, null, {
                params: {
                    client_id: this.appId,
                    client_secret: this.appSecret,
                    redirect_uri: this.redirectUri,
                    code: authCode,
                    grant_type: 'authorization_code'
                }
            });
            return response.data.access_token;
        } catch (error) {
            throw error;
        }
    }

    async exchangeForLongToken(shortToken: string): Promise<string> {
        try {
            const url = `${this.host}/access_token?grant_type=th_exchange_token&client_secret=${this.appSecret}&access_token=${shortToken}`;
            const response = await axios.get<{ access_token: string }>(url);
            return response.data.access_token;
        } catch (error) {
            throw error;
        }
    }
}