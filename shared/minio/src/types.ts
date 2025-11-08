import createMinioClient from "./createClient";

export type Env = {
  MINIO_ENDPOINT: string;
  MINIO_ACCESS_KEY: string;
  MINIO_SECRET_KEY: string;
  MINIO_PUBLIC_URL?: string | undefined;
};

export type MinioClient = Awaited<ReturnType<typeof createMinioClient>>;
