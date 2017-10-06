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
        var climate = models.Climate.build({
            temp: req.body.temp,
            humidity: req.body.humidity,
            UserId: req.user.id
        });
        climate.save().then(function () {
            request.post('https://discordapp.com/api/webhooks/365594994016518160/P92x7fsr9B8t9g318m1I-pJjmqEsVYUUSZ0_rOodsByUk13TbkN2AJZFt9ohOnHjeWKq', {
                form: {
                    content: 'It is now ' + climate.temp + '°C & the humidity is ' + climate.humidity + '% at ' + req.user.name + '\'s place.'
                }
            });
            res.json({data: climate});
        });
    })
    .get(function (req, res) {
        models.Climate.findAll({
            include: [models.User]
        }).then(function (climates) {
            var result = [];
            climates.forEach(function (climate) {
                climate.User.apikey = null;
                result.push(climate);
            });
            res.json({data: result});
        });
    });

router.route('/:user')
    .get(function (req, res) {
        models.Climate.findAll({
            where: {UserId: req.params.user}
        }).then(function (climates) {
            res.json({data: climates});
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