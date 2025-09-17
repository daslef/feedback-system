import { env } from "./env";
import logger from "./logger";
import createMinioClient from "./client";

const minioClient = createMinioClient({ env });

async function createBucket(
  minioClient: ReturnType<typeof createMinioClient>,
  bucketName: string,
) {
  const bucketExists = await minioClient.bucketExists(bucketName);

  if (!bucketExists) {
    await minioClient.makeBucket("photos");
  }
}

export default async function upload(file: File, bucketName: string) {
  try {
    const metaData = {
      "Content-Type": "image",
    };

    await createBucket(minioClient, bucketName ?? "upload");
    await minioClient.fPutObject(
      bucketName ?? "upload",
      file.name,
      file.name,
      metaData,
    );

    logger.info("[*] SUCCESS: File uploaded successfully!");

    const imageUrl = `http://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}/${bucketName}/${file.name}`;

    if (imageUrl === null) {
      throw new Error();
    }

    return imageUrl;
  } catch (error: any) {
    logger.error(`[!] ERROR: Uploading object ${error.message}`);
    throw error;
  }
}
