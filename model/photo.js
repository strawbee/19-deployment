'use strict';

const fs = require('fs');
const del = require('del');
const path = require('path');
const mongoose = require('mongoose');
const awsS3 = require('../lib/aws-s3');
const tempDir = `${__dirname}/../temp`;

const Photo = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'auth', 
        required: true,
    },
    noteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'note',
        required: true,
    },
    objectKey: {
        type: String,
        required: true,
        unique: true,
    },
    imageURI: {
        type: String,
        required: true,
        unique: true,
    },
});

Photo.statics.upload = function(req) {
    return new Promise((resolve, reject) => {
        // console.log(req.file.path);
        // if (!req.file || !req.file.path) return reject(new Error('Multi-part form data error. File and file path required.'));
        let params = {
            ACL: 'public-read',
            Bucket: process.env.AWS_BUCKET,
            Key: `${req.file.filename}${path.extname(req.file.originalname)}`,
            Body: fs.createReadStream(req.file.path),
        };

        return awsS3.uploadProm(params)
            .then(data => {
                del([`${tempDir}/${req.file.filename}`]);

                let photoData = {
                    name: req.body.name,
                    desc: req.body.desc,
                    userId: req.user._id,
                    noteId: req.body.noteId,
                    imageURI: data.Location,
                    objectKey: data.Key,
                };
                resolve(photoData);
            })
            .catch(reject);
    });
};

module.exports = mongoose.model('photo', Photo);