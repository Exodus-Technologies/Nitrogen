'use strict';

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getVideoDurationInSeconds } from 'get-video-duration';
import hbjs from 'handbrake-js';
import { http, https } from 'follow-redirects';

const uploadDir = path.resolve(process.cwd() + '/src/uploads');

export const fancyTimeFormat = duration => {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;

  // Output will look like "1:01" or "4:03:59" or "123:03:59"
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

    const request = client.get(url, resp => {
      if (resp.statusCode === 200) {
        const chunks = [];
        resp.on('data', chunk => {
          chunks.push(chunk);
        });
        resp.on('end', async () => {
          const content = { file: Buffer.concat(chunks) };
          resolve(content);
        });
      } else {
        reject(
          `Server responded with ${resp.statusCode}: ${resp.statusMessage}`
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
          const file = Buffer.concat(chunks);
          await writeLocalFile(file);
          const mp4File = await convertFLVtoMp4();
          const content = { file: mp4File };
          const duration = await getVideoDurationInSeconds(url);
          content['duration'] = duration;
          console.log('Finished processing file from url: ', url, content);
          // resolve(content);
        });
      })
      .on('error', err => {
        console.log(`Error getting video data from url: ${url} `, err);
        reject(err);
      });
  });
};

export const writeLocalFile = content => {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFile(`${uploadDir}/upload.flv`, content, err => {
        if (!err) {
          console.log('File has been created succesfully');
          resolve();
        }
      });
    } catch (err) {
      console.error(err);
      reject();
    }
  });
};

export const convertFLVtoMp4 = () => {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        input: `${uploadDir}/upload.flv`,
        output: `${uploadDir}/upload.mp4`,
        preset: 'Normal',
        rotate: 1
      };
      hbjs
        .spawn(options)
        .on('error', console.error)
        .on('progress', ({ percentComplete, eta }) => {
          console.log('Percent complete: %s, ETA: %s', percentComplete, eta);
        })
        .on('output', output => {
          console.log(output);
        });
    } catch (err) {
      console.error(err);
      reject();
    }
  });
};

export const createSubId = () => {
  return `video-${uuidv4()}`;
};
