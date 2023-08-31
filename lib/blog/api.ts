import AWS from "aws-sdk";
import matter from "gray-matter"; // assuming you are using gray-matter for front-matter
import { awsBucket, awsBucketRegion } from "../constants";
import { keyId, secretKey } from "../awskey";

type Items = {
  [key: string]: any;
};

const s3 = new AWS.S3({
  region: awsBucketRegion,
  accessKeyId: keyId,
  secretAccessKey: secretKey,
});

const postsDirectory = "blog/text";

export async function getPostSlugs() {
  const params = {
    Bucket: awsBucket,
    Prefix: postsDirectory,
  };

  const response = await s3.listObjectsV2(params).promise();
  const slugs = response.Contents?.map(({ Key }) => Key)
    .filter((key): key is string => !!key && key.endsWith(".md"))
    .map((key) => key.split("/").pop());

  return slugs || [];
}

export async function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const params = {
    Bucket: "zimo-web-bucket",
    Key: `${postsDirectory}/${realSlug}.md`,
  };

  const s3Object = await s3.getObject(params).promise();
  const fileContents = s3Object.Body?.toString("utf-8");

  if (!fileContents) {
    throw new Error("Failed to fetch post content from S3");
  }

  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string;
  };

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
  
  // If you are sure slugs will never contain undefined or null, you can use the non-null assertion
  // const postsPromiseArray = slugs.map((slug) => getPostBySlug(slug!, fields));
  
  // Alternatively, filter out any undefined or null slugs before mapping
  const postsPromiseArray = slugs
    .filter((slug): slug is string => slug !== undefined)
    .map((slug) => getPostBySlug(slug, fields));
  
  // Fetch all posts in parallel
  const posts = await Promise.all(postsPromiseArray);
  
  // sort posts by date in descending order
  return posts.sort((post1, post2) => (new Date(post1.date) > new Date(post2.date) ? -1 : 1));
}
