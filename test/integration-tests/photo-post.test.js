'use strict';

require('jest');
const faker = require('faker');
const superagent = require('superagent');
const server = require('../../lib/server');
const mocks = require('../lib/mocks');
const path = `:${process.env.PORT}/api/v1/photo`;

describe('POST /api/v1/photo', () => {
    beforeAll(server.start);
    beforeAll(() => mocks.photo.createOne().then(data => this.mock = data));
    afterAll(server.stop);
    afterAll(mocks.auth.removeAll);
    afterAll(mocks.note.removeAll);
    afterAll(mocks.photo.removeAll);

    it('should return status 201 for valid post', () => {
        expect(this.mock.photo.status).toBe(201);
    });

    it('should return status 401 if given an invalid token', () => {
        return superagent.post(path)
            .set('Authorization', `Bearer cats`)
            .field('name', faker.internet.domainWord())
            .field('desc', faker.random.words(15))
            .field('noteId', this.mock.note._id.toString())
            .attach('image', `${ __dirname }/../snowdrop.jpg`)
            .catch(err => expect(err.status).toBe(401));
    });

    it('should return status 400 given an invalid body', () => {
        return mocks.note.createOne()
            .then(res => {
                return superagent.post(path)
                    .set('Authorization', `Bearer ${res.token}`)
                    .send()
                    .catch(err => {
                        expect(err.status).toBe(400);
                    });
            });
    });
});