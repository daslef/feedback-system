import { Client } from "minio";
import { photosPolicy } from "./policy";
import type { Env } from "./types";

interface ClientProps {
  env: Env;
}

export default async function createMinioClient({ env }: ClientProps) {
  const minioClient = new Client({
    endPoint: env.MINIO_ENDPOINT,
    port: 9000,
    useSSL: false, // ?
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY,
  });

  try {
    await minioClient.setBucketPolicy("photos", photosPolicy);
  } catch (error) {
    console.error(error);
  }

  return minioClient;
}
