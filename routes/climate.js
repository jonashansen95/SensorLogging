var express = require('express');
var router = express.Router();
var models = require('../models');

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
        models.Climate.find({
            where: {User: req.params.user}
        }).then(function (climate) {
            climate.User.apikey = null;
            res.json({data: climate});
        });
    });

module.exports = router;

function isLoggedIn(req, res, next) {
    models.User.find({
        where: {apiKey: req.header('x-api-key')}
    }).then(function (user) {
        if (user !== null) {
            req.user = user;
            return next();
        } else {
            res.json({message: "Authentication required"});
        }
    });
}