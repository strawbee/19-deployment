'use strict';

require('jest');
const faker = require('faker');
const superagent = require('superagent');
const server = require('../../lib/server');
const mocks = require('../lib/mocks');
const path = `:${process.env.PORT}/api/v1/photo`;

describe('GET /api/v1/photo', () => {
    beforeAll(server.start);
    beforeAll(() => mocks.photo.createOne().then(data => this.mock = data));
    afterAll(server.stop);
    afterAll(mocks.auth.removeAll);
    afterAll(mocks.note.removeAll);
    afterAll(mocks.photo.removeAll);

    it('should return status 200 for valid get with an ID', () => {
        return superagent.get(`${path}/${this.mock.photo.body._id}`)
            .set('Authorization', `Bearer ${this.mock.token}`)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body._id).toBe(this.mock.photo.body._id);
            });
    });

    it('should return status 200 for valid get all', () => {
        return superagent.get(path)
            .set('Authorization', `Bearer ${this.mock.token}`)
            .then(res => {
                expect(res.body).toContain(this.mock.photo.body._id);
            });
    });

    it('should return status 404 for invalid get request path', () => {
        return superagent.get(`${path}/cats`)
            .set('Authorization', `Bearer ${this.mock.token}`)
            .catch(err => expect(err.status).toBe(404));
    });

    it('should return status 401 for invalid token', () => {
        return superagent.get(`${path}/${this.mock.photo.body._id}`)
            .set('Authorization', `Bearer cats`)
            .catch(err => expect(err.status).toBe(401));
    });
});