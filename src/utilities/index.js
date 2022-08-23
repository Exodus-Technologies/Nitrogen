'use strict';

import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import { getVideoDurationInSeconds } from 'get-video-duration';
const { http, https } = require('follow-redirects');

export const fancyTimeFormat = duration => {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret;
};

export const getFileContentFromPath = (path, isVideo = true) => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(path, async (err, buffer) => {
        const content = { file: buffer };
        if (err) {
          reject(err);
        }
        if (isVideo) {
          const duration = await getVideoDurationInSeconds(path);
          content['duration'] = duration;
        }
        resolve(content);
      });
    } catch (err) {
      console.log(`Error getting file: ${path} `, err);
      reject(err);
    }
  });
};

export const getContentFromURL = url => {
  return new Promise((resolve, reject) => {
    let client = http;

    if (url.toString().indexOf('https') === 0) {
      client = https;
    }

    const request = client.get(url, response => {
      if (response.statusCode === 200) {
        const chunks = [];
        response.on('data', chunk => {
          chunks.push(chunk);
        });
        response.on('end', async () => {
          const content = { file: Buffer.concat(chunks) };
          resolve(content);
        });
      } else {
        reject(
          `Server responded with ${response.statusCode}: ${response.statusMessage}`
        );
      }
    });

    request.on('error', err => {
      reject(err.message);
    });
  });
};

export const getVideoContentFromURL = url => {
  return new Promise((resolve, reject) => {
    let client = http;

    if (url.toString().indexOf('https') === 0) {
      client = https;
    }

    client
      .get(url, resp => {
        const chunks = [];

        resp.on('data', chunk => {
          chunks.push(chunk);
        });

        resp.on('end', async () => {
          const content = { file: Buffer.concat(chunks) };
          const duration = await getVideoDurationInSeconds(url);
          content['duration'] = duration;
          resolve(content);
        });
      })
      .on('error', err => {
        console.log(`Error getting video data from url: ${url} `, err);
        reject(err);
      });
  });
};
