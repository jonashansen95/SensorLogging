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
            request.post('https://discordapp.com/api/webhooks/366589877686370304/mydsERo9RdJVeE-toIO2C03jvy82GfcL1Ko-13aYddnRw3CNH2cn_PivfcMCDzPxQf8O', {
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

router.route('/:user/:limit')
    .get(function (req, res) {
        models.Climate.findAll({
            where: {UserId: req.params.user},
            limit: parseInt(req.params.limit),
            order: [['id', 'DESC']]
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