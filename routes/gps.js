var express = require('express');
var router = express.Router();
var models = require('../models');
var request = require('request');

router.use(function (req, res, next) {
    console.log(req.url);
    next();
});

router.route('/')
    .post(isLoggedIn, function (req, res) {
        var gpsEntry = models.GpsEntry.build({
            time: req.body.time,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            altitude: req.body.altitude,
            speed: req.body.speed,
            heading: req.body.heading,
            longitudeErr: req.body.longitudeErr,
            latitudeErr: req.body.latitudeErr,
            altitudeErr: req.body.altitudeErr,
            speedErr: req.body.speedErr,
            timeOffset: req.body.timeOffset,
            UserId: req.user.id
        });
        gpsEntry.save().then(function () {
            res.json({data: gpsEntry});
        });
    })
    .get(function (req, res) {
        models.GpsEntry.findAll({
            include: [models.User]
        }).then(function (gpsEntries) {
            var result = [];
            gpsEntries.forEach(function (gpsEntry) {
                gpsEntry.User.apikey = null;
                result.push(gpsEntry);
            });
            res.json({data: result});
        });
    });

router.route('/:user')
    .get(function (req, res) {
        models.GpsEntry.findAll({
            where: {UserId: req.params.user}
        }).then(function (gpsEntries) {
            res.json({data: gpsEntries});
        });
    });

router.route('/:user/:limit')
    .get(function (req, res) {
        models.GpsEntry.findAll({
            where: {UserId: req.params.user},
            limit: parseInt(req.params.limit),
            order: [['id', 'DESC']]
        }).then(function (gpsEntries) {
            res.json({data: gpsEntries});
        });
    });

module.exports = router;

function isLoggedIn(req, res, next) {
    models.User.find({
        where: {apiKey: req.header('x-api-key'), active: true}
    }).then(function (user) {
        if (user !== null) {
            req.user = user;
            return next();
        } else {
            res.json({message: "Authentication required"});
        }
    });
}