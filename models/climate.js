"use strict";

module.exports = function (sequelize, DataTypes) {
    var Climate = sequelize.define("Climate", {
        temp: DataTypes.INTEGER,
        humidity: DataTypes.INTEGER
    });

    Climate.associate = function (models) {
        Climate.belongsTo(models.User);
    };

    return Climate;
};