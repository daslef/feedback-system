import { Client } from "minio";
import type { Env } from "./env";

interface ClientProps {
  env: Env;
}

const policy = `
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetBucketLocation",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "*"
        ]
      },
      "Resource": [
        "arn:aws:s3:::photos"
      ],
      "Sid": ""
    },
    {
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "*"
        ]
      },
      "Resource": [
        "arn:aws:s3:::photos/*"
      ],
      "Sid": ""
    }
  ]
}
`;

export default async function createMinioClient({ env }: ClientProps) {
  const minioClient = new Client({
    endPoint: env.MINIO_ENDPOINT,
    port: +env.MINIO_PORT_API,
    useSSL: false, // ?
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY,
  });

  try {
    await minioClient.setBucketPolicy("photos", policy);
  } catch (error) {
    console.error(error);
  }

  return minioClient;
}
