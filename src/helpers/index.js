/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */

const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const fs = require('fs');
const jimp = require('jimp');


export const successResponse = (req, res, data, code = 200) =>
  res.json({
    code,
    data,
    success: true,
  });

export const errorResponse = (
  req,
  res,
  errorMessage = 'Something went wrong',
  code = 500,
  error = {},
) =>
  res.status(500).json({
    code,
    errorMessage,
    error,
    data: null,
    success: false,
  });

export const validateEmail = (email) => {
  // eslint-disable-next-line no-useless-escape
  const re =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateFields = (object, fields) => {
  const errors = [];
  fields.forEach((f) => {
    if (!(object && object[f])) {
      errors.push(f);
    }
  });
  return errors.length ? `${errors.join(', ')} are required fields.` : '';
};

export const uniqueId = (length = 13) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// eslint-disable-next-line no-shadow
export const deleteFile = async (path) => {
  try {
    await fs.promises.unlink(path);
    return 'file not deleted';
  } catch (error) {
    return 'file deleted successfully';
  }
};

// Save image on local storage
const destination = path.join(__dirname, '..', '..', 'public', 'storage');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const id = uuidv4();
    cb(null, `${id}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ storage });

// Multer for updating user profile
const storageUpdate = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${req.params.userId}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
export const uploadUpdateAvatar = multer({ storage: storageUpdate });

// compress file with Jimp and upload to s3
const compress = async (filePath) => {
  try {
    // console.log(filePath);
    const image = await jimp.read(filePath);
    image.resize(1000, jimp.AUTO);
    image.quality(100);
    await image.writeAsync(`${filePath}.jpg`);
    return image;
  } catch (error) {
    return error;
  }
};

export const cloudUpload = async (file) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  const { filename, path: filePath } = file;

  try {
    await compress(filePath);
  } catch (error) {
    // console.log(error);
    throw new Error('File compression Error! \n', error);
  }
  // read compressed file from storage.
  let image;
  try {
    image = await fs.promises.readFile(`${filePath}`);
  } catch (error) {
    // console.log(error);
    throw new Error('File read Error! \n', error);
  }
  s3.upload(
    {
      Bucket: process.env.AWS_BUCKET_NAME,
      ACL: 'public-read',
      Key: filename,
      Body: image,
    },
    (err, data) => {
      if (err) {
        // console.log(err);
        deleteFile(`${filePath}.jpg`);
        return err;
      }
      // console.log(data);
      deleteFile(file.path);
      deleteFile(`${filePath}.jpg`);
      return data;
    },
  );
};

export const deleteImagesS3 = async (images) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  const imageObject = images.map((image) => {
    const res = { Key: image.split('amazonaws.com/')[1] };
    return res;
  });
  const options = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Delete: {
      Objects: imageObject,
    },
  };

  s3.deleteObjects(options, (err, data) => {
    if (err) {
      // console.log(err);
      return err;
    }
    // console.log(data);
    return data;
  });
};
