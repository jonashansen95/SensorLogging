"use strict";

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        name: DataTypes.STRING,
        apikey: {
            type: DataTypes.STRING
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

    User.associate = function (models) {
        User.hasMany(models.Climate);
        User.hasMany(models.GpsEntry);
    };
    return User;
};