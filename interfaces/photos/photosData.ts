interface PhotosData {
    title: string;
    date: string;
    author: string;
    authorProfile: string;
    slug: string;
    location?: LocationData;
    images: ImagesData;
}

interface LocationData {
    latitude: number;
    longitude: number;
    name?: string;
}
