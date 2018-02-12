'use strict';

const bodyParser = require('body-parser').json();
const Note = require('../model/note');
const errorHandler = require('../lib/error-handler');
const bearerAuth = require('../lib/bearer-auth-middleware');

module.exports = function(router) {
    router.post('/note', bearerAuth, bodyParser, (req, res) => {
        req.body.userId = req.user._id;
        return new Note(req.body).save()
            .then(note => res.status(201).json(note))
            .catch(err => errorHandler(err, res));
    });

    router.get('/note/:_id?', bearerAuth, (req, res) => {
        // returns one note
        if (req.params._id) {
            return Note.findById(req.params._id)
                .then(note => res.status(200).json(note))
                .catch(err => errorHandler(err, res));
        }

        // returns all notes
        return Note.find()
            .then(notes => {
                let noteIds = notes.map(note => note._id);
                return res.status(200).json(noteIds);
            })
            .catch(err => errorHandler(err, res));
    });

    router.put('/note/:_id?', bearerAuth, bodyParser, (req, res) => {
        Note.findById(req.params._id, req.body)
            .then(note => {
                if (note._id.toString() === req.params._id.toString()) {
                    note.name = req.body.name || note.name;
                    note.content = req.body.content || note.content;
                    return note.save();
                }
                return errorHandler(new Error('Validation error. Invalid ID.'), res);
            })
            // res.status() sets the http status on the response. res.sendStatus() both sets and sends the status to the client.
            .then(() => res.sendStatus(204))
            .catch(err => errorHandler(err, res));
    });

    router.delete('/note/:_id?', bearerAuth, (req, res) => {
        return Note.findById(req.params._id)
            .then(note => {
                if (note._id.toString() === req.params._id.toString()) return note.remove();
                return errorHandler(new Error('Validation error. Invalid ID.'), res);
            })
            .then(() => res.sendStatus(204))
            .catch(err => errorHandler(err, res));
    });
};