import { Client } from "minio";
import type { Env } from "./env";

interface ClientProps {
  env: Env;
}

export default function createMinioClient({ env }: ClientProps) {
  const minioClient = new Client({
    endPoint: env.MINIO_ENDPOINT,
    port: env.MINIO_PORT,
    useSSL: false,
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY,
  });

  return minioClient;
}
