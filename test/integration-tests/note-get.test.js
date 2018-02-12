'use strict';

require('jest');
const faker = require('faker');
const superagent = require('superagent');
const server = require('../../lib/server');
const mocks = require('../lib/mocks');
const path = `:${process.env.PORT}/api/v1/note`;

describe('GET /api/v1/note', () => {
    beforeAll(server.start);
    beforeAll(() => mocks.auth.createOne().then(data => this.mockUser = data));
    beforeAll(() => mocks.note.createOne().then(data => this.mockNote = data));

    afterAll(server.stop);
    afterAll(mocks.auth.removeAll);
    afterAll(mocks.note.removeAll);

    it('should return status 200 for a request made with a valid ID', () => {
        return superagent.get(`${path}/${this.mockNote.note._id}`)
            .set('Authorization', `Bearer ${this.mockUser.token}`)
            .then(res => expect(res.status).toBe(200));
    });

    it('should return status 200 for request made without an ID', () => {
        return superagent.get(path)
            .set('Authorization', `Bearer ${this.mockUser.token}`)
            .then(res => expect(res.status).toBe(200));
    });

    it('should return status 401 if invalid token was provided', () => {
        return superagent.get(`${path}/${this.mockNote.note._id}`)
            .set('Authorization', `Bearer cats`)
            .catch(err => expect(err.status).toBe(401));
    });

    it('should return status 404 for a valid request with an ID that is not found', () => {
        return superagent.get(`${path}/cats`)
            .set('Authorization', `Bearer ${this.mockUser.token}`)
            .catch(err => expect(err.status).toBe(404));
    });
});


/*
GET - test 200, for a request made with a valid id
GET - test 200, for a request made with no id param
GET - test 401, if no token was provided
GET - test 404, for a valid request with an id that was not found
*/