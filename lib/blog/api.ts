import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import matter from "gray-matter"; // assuming you are using gray-matter for front-matter
import { awsBucket, awsBucketRegion } from "../constants";
import { keyId, secretKey } from "../awskey";
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

type Items = {
  [key: string]: any;
};

const s3 = new S3Client({
  region: awsBucketRegion,
  credentials: {
    accessKeyId: keyId,
    secretAccessKey: secretKey,
  },
});

const postsDirectory = "blog/text";

export async function getPostSlugs() {
  const command = new ListObjectsV2Command({
    Bucket: awsBucket,
    Prefix: postsDirectory,
  });
  
  const response = await s3.send(command);
  
  const slugs = response.Contents?.map(({ Key }) => Key)
    .filter((key): key is string => !!key && key.endsWith(".md"))
    .map((key) => key.split("/").pop());

  return slugs || [];
}

export async function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const command = new GetObjectCommand({
    Bucket: awsBucket,
    Key: `${postsDirectory}/${realSlug}.md`,
  });
  
  const s3Object = await s3.send(command);

  if (!s3Object.Body) {
    throw new Error("Failed to fetch post content from S3");
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

  const { data, content } = matter(fileContents);

  const items: Items = {};

  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }
    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export async function getAllPosts(fields: string[] = []): Promise<Items[]> {
  const slugs = await getPostSlugs();
  
  const postsPromiseArray = slugs
    .filter((slug): slug is string => slug !== undefined)
    .map((slug) => getPostBySlug(slug, fields));
  
  const posts = await Promise.all(postsPromiseArray);
  
  return posts.sort((post1, post2) => (new Date(post1.date) > new Date(post2.date) ? -1 : 1));
}
