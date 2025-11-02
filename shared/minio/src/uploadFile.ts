import { createLogger } from "@shared/logger";
import createBucket from "./createBucket";
import createMinioClient from "./createClient";
import type { Env } from "./types";

const logger = createLogger({ env: "production" });

export default async function upload(file: File, bucketName: string, env: Env) {
  try {
    const minioClient = await createMinioClient({ env });
    const fileBuffer = await file.arrayBuffer();
    const fileName = `${new Date().toJSON()}_${file.name}`;

    await createBucket(minioClient, bucketName ?? "photos");

    await minioClient.putObject(
      bucketName ?? "photos",
      fileName,
      Buffer.from(fileBuffer),
      file.size,
      {
        
      }
    );

    logger.info("[*] SUCCESS: File uploaded successfully!");

    const imageUrl = `${env.MINIO_PUBLIC_URL ?? `${env.MINIO_ENDPOINT}:9000`}/${bucketName}/${fileName}`;

    if (imageUrl === null) {
      throw new Error();
    }

    return imageUrl;
  } catch (error: any) {
    logger.error(`[!] ERROR: Uploading object ${error.message}`);
    throw error;
  }
}
