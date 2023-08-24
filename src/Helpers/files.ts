// Digital Ocean Space Lib
import { Logger } from '@nestjs/common';
import * as aws from 'aws-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  bucketName: process.env.AWS_BUCKET_NAME || '',
  region: process.env.AWS_REGION || 'us-east-1',
  endPoint: process.env.AWS_ENDPOINT || 'sgp1.digitaloceanspaces.com',
};

const s3 = new aws.S3({
  endpoint: config.endPoint,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region,
});

export default class SpaceFile {
  private readonly logger = new Logger(SpaceFile.name);
  uploadObject = async (
    fileObject,
    fileName,
    foldername = '',
    contentType = '',
  ) => {
    let prefix = 'ys/';

    if (foldername !== '') {
      prefix += foldername + '/';
    }

    fileName = prefix + fileName;
    const params = {
      Bucket: config.bucketName,
      Key: fileName,
      Body: fileObject,
      ACL: 'public-read',
    };
    if (contentType !== '') {
      params['ContentType'] = contentType;
    }
    const data = s3.upload(params).promise();

    return data
      .then((result) => {
        return result;
      })
      .catch((err) => {
        this.logger.error('Error upload object ' + err.message);
        return false;
      });
  };

  deleteObject = async (keyPath) => {
    const basePath =
      'https://' + config.bucketName + '.' + config.endPoint + '/';
    const key = keyPath.replace(basePath, ' ').trim();
    return s3.deleteObject(
      {
        Bucket: config.bucketName,
        Key: key,
      },
      (err, data) => {
        this.logger.error('Error delete object ' + err.message);
        this.logger.error('Error delete object data ' + JSON.stringify(data));
        return false;
      },
    );
  };
}
