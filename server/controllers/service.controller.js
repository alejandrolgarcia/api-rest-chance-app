const express = require('express');

const { checkToken } = require('../middleware/auth');

const Service = require('../models/service.model');

const app = express();

// GET ALL
app.get('/service', checkToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 20;
    limit = Number(limit);

    Service.find({ status: true })
        .skip(from)
        .limit(limit)
        .exec((err, service) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err,
                });
            }
            Service.countDocuments({ status: true }, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    from,
                    limit,
                    service,
                });
            });
        });

});

// GET BY USER ID
app.get('/service/:id', checkToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 20;
    limit = Number(limit);

    let id = req.params.id;

    Service.find({ status: true, user: id })
        .skip(from)
        .limit(limit)
        .exec((err, service) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err,
                });
            }
            Service.countDocuments({ status: true }, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    from,
                    limit,
                    service,
                });
            });
        });

});

// POST
app.post('/service', checkToken, (req, res) => {

    let body = req.body;
    let service = new Service({
        user: req.user._id,
        name: body.name,
        desc: body.desc,
        price: body.price,
        time: body.time,
        img: body.img,
    });

    service.save((err, serviceDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err,
            });
        }
        if (!serviceDB) {
            return res.status(400).json({
                ok: false,
                error: err,
            });
        }
        res.json({
            ok: true,
            service: serviceDB,
        });
    });

});

// PUT
app.put('/service/:id', checkToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let editService = {
        name: body.name,
        desc: body.desc,
        price: body.price,
        time: body.time,
        img: body.img,
    }

    Service.findByIdAndUpdate(id, editService, { new: true, runValidators: true, context: 'query', useFindAndModify: false },
        (err, serviceDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err,
                });
            }
            if (!serviceDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'El ID del servicio no existe'
                    }
                });
            }
            res.json({
                ok: true,
                service: serviceDB,
            });
        });
});

// DELETE
app.delete('/service/:id', checkToken, (req, res) => {
    let id = req.params.id;

    let changeStatus = {
        status: false,
    };

    Service.findByIdAndUpdate(id, changeStatus, { new: true, useFindAndModify: false }, (err, serviceDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err,
            });
        }
        if (!serviceDelete) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Tarjeta no encontrada',
                },
            });
        }
        res.json({
            ok: true,
            service: serviceDelete,
        });
    });
});

module.exports = app;