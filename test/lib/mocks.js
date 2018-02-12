'use strict';

const faker = require('faker');
const superagent = require('superagent');
const Auth = require('../../model/auth');
const Note = require('../../model/note');
const Photo = require('../../model/photo');
const path = `:${process.env.PORT}/api/v1/photo`;
const image = `${__dirname}/../snowdrop.jpg`;
const mocks = module.exports = {};

// Auth Mocks
mocks.auth = {};

mocks.auth.createOne = () => {
    let result = {};
    result.password = faker.internet.password();
    // console.log('password: ', result.password);

    let mockUser = new Auth({
        username: faker.internet.userName(),
        email: faker.internet.email(),
    });
    // console.log('mockUser: ', mockUser);

    return mockUser.generatePasswordHash(result.password)
        .then(user => result.user = user)
        .then(user => user.generateToken())
        .then(token => result.token = token)
        .then(() => {
            return result;
        });
};

// Note Mocks
mocks.note = {};

mocks.note.createOne = () => {
    let result = {};
    
    return mocks.auth.createOne()
        .then(user => result = user)
        .then(userMock => {
            return new Note({
                name: faker.internet.domainWord(),
                content: faker.random.words(15),
                userId: userMock.user._id,
            }).save(); 
        })
        .then(note => {
            result.note = note;
            return result;
        });
};

// Photo Mocks
mocks.photo = {};

mocks.photo.createOne = () => {
    let result = {}; 

    return mocks.note.createOne()
        .then(res => result = res)
        .then(res => {
            return superagent.post(path)
                .set('Authorization', `Bearer ${res.token}`)
                .field('name', faker.internet.domainWord())
                .field('desc', faker.random.words(15))
                .field('noteId', res.note._id.toString())
                .attach('image', image)
                .then(photo => {
                    result.photo = photo;
                    // console.log(result);
                    return result;
                })
                .catch(err => console.log(err));
            // new Photo({
            //     name: faker.internet.domainWord(),
            //     desc: faker.random.words(15),
            //     userId: res.user._id,
            //     noteId: res.note._id,
            //     objectKey: faker.internet.domainWord(),
            //     imageURI: faker.random.image(),
            // }).save();
        });
};

// Remove
mocks.auth.removeAll = () => Promise.all([Auth.remove()]);
mocks.note.removeAll = () => Promise.all([Note.remove()]);
mocks.photo.removeAll = () => Promise.all([Photo.remove()]);