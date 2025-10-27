import { createLogger } from "@shared/logger";
import { env } from "./env";
import createMinioClient from "./client";

const logger = createLogger({ env: "production" });

async function createBucket(
  minioClient: Awaited<ReturnType<typeof createMinioClient>>,
  bucketName: string,
) {
  const bucketExists = await minioClient.bucketExists(bucketName);

  if (!bucketExists) {
    await minioClient.makeBucket("photos");
  }
}

export default async function upload(file: File, bucketName: string) {
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
    );

    logger.info("[*] SUCCESS: File uploaded successfully!");

    const imageUrl = `${env.MINIO_PUBLIC_URL ?? `${env.MINIO_ENDPOINT}:${env.MINIO_PORT_API}`}/${bucketName}/${fileName}`;

    if (imageUrl === null) {
      throw new Error();
    }

    return imageUrl;
  } catch (error: any) {
    logger.error(`[!] ERROR: Uploading object ${error.message}`);
    throw error;
  }
}
