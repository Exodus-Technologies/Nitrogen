'use strict';

import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  defaultCacheTtl: +process.env.DEFAULT_CACHE_TTL,
  sources: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      s3ThumbnailBucketName: process.env.S3_THUMBNAIL_BUCKET_NAME,
      s3VideoBucketName: process.env.S3_VIDEO_BUCKET_NAME,
      videoDistributionURI: process.env.AWS_CLOUDFRONT_VIDEOS_DISTRIBUTION_URI,
      thumbnailDistributionURI:
        process.env.AWS_CLOUDFRONT_THUMBNAILS_DISTRIBUTION_URI
    },
    mongodb: {
      clusterDomain: process.env.CLUSTER_DOMAIN,
      dbName: process.env.DB_NAME,
      dbUser: process.env.DB_USER,
      dbPass: process.env.DB_PASS,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    bambuser: {
      apiKey: process.env.BAMBUSER_API_KEY,
      daId: process.env.BAMBUSER_DAID,
      daSecret: process.env.BAMBUSER_DASECRET,
      broadcastURL: process.env.BAMBUSER_BROADCAST_URL,
      platforms: {
        ios: process.env.BAMBUSER_APP_KEY_IOS,
        android: process.env.BAMBUSER_APP_KEY_ANDROID,
        web: process.env.BAMBUSER_APP_KEY_WEB
      }
    }
  }
};

export default config;
