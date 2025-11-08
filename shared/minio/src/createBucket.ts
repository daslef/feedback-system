import type { MinioClient } from "./types";

export default async function createBucket(
  minioClient: MinioClient,
  bucketName: string,
) {
  const bucketExists = await minioClient.bucketExists(bucketName);

  if (!bucketExists) {
    await minioClient.makeBucket("photos");
  }
}
