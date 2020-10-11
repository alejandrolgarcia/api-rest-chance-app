const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user.model');
const { checkToken } = require('../middleware/auth');

const app = express();

// GET ALL
app.get('/user', checkToken, function(req, res) {

    // Pagination
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 20;
    limit = Number(limit);

    User.find({ status: true }, 'firstname lastname email img')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err,
                });
            }
            User.countDocuments({ status: true }, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    from,
                    limit,
                    users,
                });
            });

        });
});

// POST
app.post('/user', checkToken, function(req, res) {
    let body = req.body;

    let user = new User({
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });

});

// PUT
app.put('/user/:id', checkToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['firstname', 'lastname', 'email', 'img']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' },
        (err, userDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err,
                });
            }
            res.json({
                ok: true,
                user: userDB,
            });
        }
    );
});

app.delete('/user/:id', checkToken, function(req, res) {

    let id = req.params.id;
    let changeStatus = {
        status: false,
    };

    User.findByIdAndUpdate(id, changeStatus, { new: true, useFindAndModify: false },
        (err, userDelete) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err,
                });
            }
            if (!userDelete) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'User not found',
                    },
                });
            }
            res.json({
                ok: true,
                user: userDelete,
            });
        }

    );

});

module.exports = app;