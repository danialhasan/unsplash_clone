/**
 * This is the route file that deals with image and post processing. 
 * It uses the Amazon Rekognition API on the US-east-2 server. 
 */

// aws setup
const {
  CreateBucketCommand,
  DeleteBucketCommand,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3")
const {
  s3Client
} = require("../modules/s3Client.js")

// date-fns setup
const formatIso = require("date-fns")

// express setup
const express = require('express');
const router = express.Router();

// CORS setup
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://unsplash-clone-dh.netlify.app');
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
  next()
})

// mongodb setup
const mongoose = require('mongoose')
const mongodbPassword = process.env.MONGODB_PASSWORD
const userSchema = require('../schema/userSchema.js')
const User = mongoose.model("user", userSchema, "Users")


// routes
router.get('/', (req, res) => {
  res.send("This is the server API root handler!")
  console.log(req)
});

async function findUser(email) {
  /**
   * findOne resolves to the document (if it exists), or null (if the document does not exist)
   */
  try {
    return await User.findOne({
      email
    })
  } catch {
    console.log("findUser function failed in api.js on server")
  }
}

async function createBucket(bucketName) {
  let newBucketParams = {
    Bucket: bucketName
  }
  return new Promise(async (resolve, reject) => {
    try {
      const newBucket = await s3Client.send(new CreateBucketCommand(newBucketParams))
      console.log("✅ New Bucket Created:", newBucket)
      resolve(newBucket)
    } catch (error) {
      console.log("❌ New Bucket Creation Failed:", error)
      reject(error)
    }
  })
}
async function deleteBucket() {}

async function interactWithS3(bucketParams) {
  const objectsInBucket = await s3Client.send(new ListObjectsCommand(bucketParams));
  console.log('objectsInBucket:')
  console.log(objectsInBucket.Contents)
  if (objectsInBucket.Contents.length > 0 || objectsInBucket.Contents === undefined) {
    console.log(`Bucket ${bucketParams.Bucket} is not empty`)
    emptyBucket(bucketParams).then(() => {
      console.log('Bucket emptied!')
    }).catch((error) => {
      console.log(error);
      return error
    })
  }
  return new Promise(async (resolve, reject) => {
    try {
      const data = await s3Client.send(new PutObjectCommand(bucketParams));
      resolve(data)
    } catch (err) {
      console.log('❌ interactWithS3()Promise Failed:', err)
      reject(err)
    }
  })
}

async function interactWithRekognition(S3Object) {
  const {
    DetectLabelsCommand,
    RekognitionClient,
  } = require('@aws-sdk/client-rekognition');
  var client = new RekognitionClient();
  const params = {
    "Image": {
      // "S3Object": { // this code has been replaced by the S3Object parameter.
      //   "Bucket": "danialhasanbucket",
      //   "Name": "newBuffer.jpg"
      // }
      "S3Object": S3Object
    },
    "MaxLabels": 3,
    "MinConfidence": 75
  };
  return new Promise(async (resolve, reject) => {
    try {
      const data = await client.send(new DetectLabelsCommand(params))
      console.log('✅ interactWithRekognition() Promise Succeeded');
      resolve(data)
    } catch (error) {
      console.log('❌ interactWithRekognition() Promise Failed with Error:', error)
      reject(error);
    }
  })
}
router.route('/image')
  .post(async (req, res) => {
    const imageBase64Encoded = req.body.imageParams.image
    const imageUUID = req.body.imageParams.uuid //used to identify the image.
    const email = req.body.email
    const buffer = new Buffer.from(imageBase64Encoded, 'base64') // converting base64 base64ImageString string to buffer
    // interactWithRekognition()
    const bucketParams = {
      Bucket: "unsplashclone-rekognition-bucket",
      // Specify the name of the new object. For example, 'index.html'.
      // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
      Key: `${imageUUID}.jpg`,
      // // Content of the new object.
      Body: buffer,
      ContentEncoding: 'base64'
    };
    try {
      // add image to bucket
      let s3Results = await interactWithS3(bucketParams)
      if (s3Results === null) {
        console.log('❌ interactWithS3 returned null:', s3Results);
        return;
      }
      console.log('✅ interactWithS3 Results:', s3Results)
      console.log('⌛️ Interacting with Rekognition...');
      // image was added to bucket. Point rekognition to it and get labels
      let rekognitionResults = await interactWithRekognition({
        "Bucket": bucketParams.Bucket,
        "Name": bucketParams.Key
      })
      let imageLabels = rekognitionResults.Labels
      console.log('✅ Rekognition Results:', rekognitionResults);
      // Labels were received. Find user in database and save image object to their
      // posts array, each post being an object with the image base64 encoded, an array of tags, and the date posted.
      const post = {
        image: imageBase64Encoded,
        imageUUID,
        tags: imageLabels,
        date: formatIso(new Date)
      }

      console.log('⌛️ Saving post to MongoDB...')
      const user = await findUser(email)

      user.posts.push(post);
      // console.log('User.posts before save:', user.posts);

      user.save().then(() => {
        // I'm sending imageLabels instead of the callback argument (savedUser)
        // because theres no point in sending the entire user database profile
        // when all I need is a saved user confirmation and the image labels. 
        res.status(200).send(imageLabels);
        console.log('✅ Post saved successfully!')

      }).catch((err) => {
        console.log('❌ Post could not be saved to MongoDB.')
        console.log(err);
        res.status(404).send('Post could not be saved to MongoDB.');
        throw err
      })
      // console.log('User.posts after save:', user.posts);
      // console.log("post:", post)
      // res.send(imageLabels)
    } catch (error) {
      console.log("❌ There was an error in POST route /api/image.")
      res.status(500).send()
      throw error
    }
    // console.log(response)
    // res.send("Request received!")

  })
/**
 * This deletes one object in the specified bucket. 
 */
async function deleteObjectInBucket(bucketParams) {

}
/**
 * This deletes all objects in the specified bucket, emptying it. 
 */
async function emptyBucket(bucketParams) {
  return new Promise(async (resolve, reject) => {
    /**
     * AWS doesn 't have a * operator for selecting all objects in a bucket.
     * Instead, we get all the objects in the bucket and loop through it, 
     * deleting the selected object by accessing the key and deleting it that way.
     */
    // 
    console.log(bucketParams)
    let deletedObjects = []
    try {
      const objects = await s3Client.send(new ListObjectsCommand(bucketParams));
      console.log("Objects:")
      console.log(objects.Contents)
      let deletedObjectsArray = []
      for (let i = 0; i < objects.Contents.length; i++) {
        let Key = objects.Contents[i].Key;
        let Bucket = bucketParams.Bucket;
        // DeleteObjectCommand parameter, and most other command params, must be an OBJECT that includes their specific keys 
        s3Client.send(new DeleteObjectCommand({
            Bucket,
            Key
          }))
          .then((deletedObject) => {
            deletedObjectsArray.push(deletedObject)
          }).catch((error) => {
            console.log(error);
            return
          })
      }
      console.log('deletedObjectsArray:')
      console.log(deletedObjectsArray)
      resolve(deletedObjects)
    } catch (err) {
      console.log(`❌ Bucket ${bucketParams.Bucket} could not be emptied:`, err)
      reject(err)
    }
  })
}

module.exports = router;