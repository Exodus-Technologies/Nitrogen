'use strict';

require('dotenv').config();

const config = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  sources: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      s3BucketName: process.env.S3_BUCKET_NAME
    },
    database: {
      clusterName: process.env.CLUSTER_NAME,
      dbName: process.env.DB_NAME,
      dbUser: process.env.DB_USER,
      dbPass: process.env.DB_PASS,
      broadcastCollectionName: process.env.BROADCAST_COLLECTION_NAME,
      sessionCollectionName: process.env.SESSION_COLLECTION_NAME,
      videoCollectionName: process.env.VIDEO_COLLECTION_NAME
    },
    vonage: {
      apiKey: process.env.API_KEY,
      apiSecret: process.env.API_SECRET
    }
  }
};

export default config;
