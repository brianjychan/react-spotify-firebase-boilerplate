interface ImageArray {
    height: number;
    url: string;
    width: number;
}

interface SpotifyUrls {
    spotify: string
}

export interface ApiProfile {
    id: string,
    uid: string,
    images: Array<ImageArray>,
    urls: SpotifyUrls,
    name: string,
    accessToken: string,
    tokenExpiryMs: number,
    refreshToken: string,
}