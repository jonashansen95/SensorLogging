var express = require('express');
var router = express.Router();
var models = require('../models');

router.use(function (req, res, next) {
    console.log(req.url);
    next();
});

router.route('/')
    .post(isLoggedIn, function (req, res) {
        var user = models.User.build({
            name: req.body.name
        });
        user.save().then(function () {
            res.json({data: user});
        });
    })
    .get(isLoggedIn, function (req, res) {
        models.User.findAll().then(function (users) {
            res.json({data: users})
        });
    });

router.route('/:user_id')
    .get(isLoggedIn, function (req, res) {
        models.User.find({
            where: {id: req.params.user_id}
        }).then(function (user) {
            res.json({data: user});
        });
    });

module.exports = router;

function isLoggedIn(req, res, next) {
    console.log("Header key: "+req.get('X-API-Key'));
    models.User.find({
        where: {apiKey: req.header('x-api-key'), active: true}
    }).then(function (user) {
        if (user !== null) {
            return next();
        } else {
            res.json({message: "Authentication required"});
        }
    });
}