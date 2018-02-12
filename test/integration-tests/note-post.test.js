'use strict';

require('jest');
const faker = require('faker');
const superagent = require('superagent');
const server = require('../../lib/server');
const mocks = require('../lib/mocks');
const path = `:${process.env.PORT}/api/v1/note`;

describe('POST /api/v1/note', () => {
    beforeAll(server.start);
    beforeAll(() => mocks.auth.createOne().then(data => this.mockUser = data));
    afterAll(mocks.auth.removeAll);
    afterAll(mocks.note.removeAll);
    afterAll(server.stop);

    it('should return status 201 for valid post', () => {
        let noteMock = null;
        return mocks.note.createOne()
            .then(mock => {
                noteMock = mock;
                return superagent.post(path)
                    .set('Authorization', `Bearer ${mock.token}`)
                    .send({
                        name: faker.lorem.word(),
                        content: faker.lorem.words(15),
                    })
                    .catch(err => console.log(err));
            })
            .then(res => {
                expect(res.status).toBe(201);
                expect(res.body).toHaveProperty('name');
                expect(res.body).toHaveProperty('content');
                expect(res.body).toHaveProperty('_id');
                expect(res.body.userId).toEqual(noteMock.note.userId.toString());
            })
            .catch(err => console.log(err));
    });

    it('should return status 401 if given an invalid token', () => {
        return superagent.post(path)
            .set('Authorization', 'Bearer cats')
            .catch(err => expect(err.status).toBe(401));
    });

    it('should return status 400 given an invalid body', () => {
        return superagent.post(path)
            .set('Authorization', `Bearer ${this.mockUser.token}`)
            .send({})
            .catch(err => expect(err.status).toBe(400));
    });
});