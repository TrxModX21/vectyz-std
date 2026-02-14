import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../utils/app.config";

const s3Client = new S3Client({
  region: "auto",
  endpoint: config.R2_ENDPOINT as string,
  credentials: {
    accessKeyId: config.R2_ACCESS_KEY_ID as string,
    secretAccessKey: config.R2_SECRET_ACCESS_KEY as string,
  },
});

export const generateR2PresignedUrl = async (
  folder: string,
  fileName: string,
  fileType: string,
) => {
  const key = `${folder}/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: config.R2_BUCKET_NAME as string,
    Key: key,
    ContentType: fileType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = `${config.R2_PUBLIC_URL}/${key}`;

  return { uploadUrl: url, publicUrl, key };
};

// export const generateR2ReadUrl = async (key: string) => {
//   const command = new GetObjectCommand({
//     Bucket: config.R2_BUCKET_NAME as string,
//     Key: key,
//   });

//   const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
//   return url;
// };

export const deleteFromR2 = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: config.R2_BUCKET_NAME as string,
    Key: key,
  });

  return await s3Client.send(command);
};

export const getFileStream = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: config.R2_BUCKET_NAME as string,
    Key: key,
  });

  const response = await s3Client.send(command);
  return response.Body as NodeJS.ReadableStream;
};
