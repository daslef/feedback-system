import { env } from "./env";
import logger from "./logger";
import createMinioClient from "./client";

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
    const metaData = {
      "Content-Type": "image/*",
    };

    const minioClient = await createMinioClient({ env });
    const fileBuffer = await file.arrayBuffer();
    const fileName = `${new Date().toJSON()}_${file.name}`;

    await createBucket(minioClient, bucketName ?? "photos");

    await minioClient.putObject(
      bucketName ?? "photos",
      fileName,
      Buffer.from(fileBuffer),
      file.size,
      // metaData,
    );

    logger.info("[*] SUCCESS: File uploaded successfully!");

    const imageUrl = `https://minio.xn--47-dlckcacbiv4afwllqms4x.xn--p1ai/${bucketName}/${fileName}`;

    if (imageUrl === null) {
      throw new Error();
    }

    return imageUrl;
  } catch (error: any) {
    logger.error(`[!] ERROR: Uploading object ${error.message}`);
    throw error;
  }
}
