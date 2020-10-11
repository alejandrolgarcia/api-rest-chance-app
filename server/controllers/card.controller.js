const express = require('express');

const { checkToken } = require('../middleware/auth');

const Card = require('../models/card.model');

const app = express();

// GET ALL
app.get('/card', checkToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 20;
    limit = Number(limit);

    Card.find({ status: true })
        .skip(from)
        .limit(limit)
        .populate('user', 'firstname lastname')
        .exec((err, card) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err,
                });
            }
            Card.countDocuments({ status: true }, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    from,
                    limit,
                    card,
                });
            });
        });

});

// GET ID
app.get('/card/:id', checkToken, (req, res) => {
    
    let id = req.params.id;

    Card.findById(id)
        .populate('user', 'firstname lastname')
        .exec( (err, card) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err,
                });
            }
            res.json({
                ok: true,
                card,
            });
        });
});

// POST
app.post('/card', checkToken, (req, res) => {

    let body = req.body;
    let card = new Card({
        user: req.user._id,
        profession: body.profession,
        phone: body.phone,
        email: body.email,
        website: body.website,
        address: body.address,
        company: body.company,
        slogan: body.slogan,
    });

    card.save((err, cardDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err,
            });
        }
        if (!cardDB) {
            return res.status(400).json({
                ok: false,
                error: err,
            });
        }
        res.json({
            ok: true,
            card: cardDB,
        });
    });

});

// PUT
app.put('/card/:id', checkToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let editCard = {
        profession: body.profession,
        phone: body.phone,
        email: body.email,
        website: body.website,
        address: body.address,
        company: body.company,
        slogan: body.slogan,
    }

    Card.findByIdAndUpdate(id, editCard, { new: true, runValidators: true, context: 'query', useFindAndModify: false },
        (err, cardDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err,
                });
            }
            if (!cardDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'El ID de la tarjeta no existe'
                    }
                });
            }
            res.json({
                ok: true,
                card: cardDB,
            });
        });
});

// DELETE
app.delete('/card/:id', checkToken, (req, res) => {
    let id = req.params.id;

    let changeStatus = {
        status: false,
    };

    Card.findByIdAndUpdate(id, changeStatus, { new: true, useFindAndModify: false }, (err, cardDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err,
            });
        }
        if (!cardDelete) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Tarjeta no encontrada',
                },
            });
        }
        res.json({
            ok: true,
            card: cardDelete,
        });
    });
});

module.exports = app;