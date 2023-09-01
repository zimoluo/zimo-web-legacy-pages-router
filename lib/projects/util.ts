import { awsBucketAddress } from "../constants";

export const getProjectFavicon = (slug: string, faviconFormat: string) => {
    return `${awsBucketAddress}/projects/favicon/${slug}.${faviconFormat}`;
};

