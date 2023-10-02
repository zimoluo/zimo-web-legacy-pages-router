import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { awsBucket, awsBucketRegion } from "./constants";
import { keyId, secretKey } from "./awskey";
import { Readable } from "stream";
import { pipeline } from 'stream/promises';

type Items = {
  [key: string]: any;
};

if (!keyId) {
  throw new Error("AWS_KEY_ID is undefined!");
}

if (!secretKey) {
  throw new Error("AWS_SECRET_KEY_ZIMO_WEB is undefined!");
}

const s3 = new S3Client({
  region: awsBucketRegion,
  credentials: {
    accessKeyId: keyId,
    secretAccessKey: secretKey,
  },
});

export async function getEntrySlugs(directory: string) {
  const params = {
    Bucket: awsBucket,
    Prefix: directory,
  };

  const command = new ListObjectsV2Command(params);
  const response = await s3.send(command);
  const slugs = response.Contents?.map(({ Key }) => Key)
    .filter((key): key is string => !!key && key.endsWith(".json"))
    .map((key) => key.split("/").pop()?.replace(".json", ""));

  return slugs || [];
}

export async function getEntryBySlug(slug: string, directory: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.json$/, "");
  const params = {
    Bucket: awsBucket,
    Key: `${directory}/${realSlug}.json`,
  };

  const command = new GetObjectCommand(params);
  const s3Object = await s3.send(command);

  if (!s3Object.Body) {
    throw new Error("Failed to fetch entry content from S3");
  }

  let fileContents = '';
  await pipeline(
    s3Object.Body as Readable,
    async function* (source) {
      for await (const chunk of source) {
        fileContents += chunk.toString('utf-8');
      }
    }
  );

  const data = JSON.parse(fileContents);

  const items: Items = {};

  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export async function getAllEntries(directory: string, fields: string[] = []): Promise<Items[]> {
  const slugs = await getEntrySlugs(directory);

  const entriesPromiseArray = slugs
    .filter((slug): slug is string => slug !== undefined)
    .map((slug) => getEntryBySlug(slug, directory, fields));

  // Fetch all entries in parallel
  const entries = await Promise.all(entriesPromiseArray);

  // Sort entries by date in descending order, assuming each entry has a 'date' field.
  return entries.sort((entry1, entry2) => (new Date(entry1.date) > new Date(entry2.date) ? -1 : 1));
}
