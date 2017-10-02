"use strict";
var hat = require('hat');
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        name: DataTypes.STRING,
        apikey: {
            type: DataTypes.STRING,
            defaultValue: hat()
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

    User.associate = function (models) {
        User.hasMany(models.Climate);
    };
    return User;
};