"use strict";

module.exports = function (sequelize, DataTypes) {
    var GpsEntry = sequelize.define("GpsEntry", {
        time: DataTypes.DATE,
        longitude: DataTypes.DOUBLE,
        latitude: DataTypes.DOUBLE,
        altitude: DataTypes.DOUBLE,
        speed: DataTypes.DOUBLE,
        heading: DataTypes.DOUBLE,
        longitudeErr: DataTypes.INTEGER,
        latitudeErr: DataTypes.INTEGER,
        altitudeErr: DataTypes.INTEGER,
        speedErr: DataTypes.INTEGER,
        timeOffset: DataTypes.DOUBLE
    });

    GpsEntry.associate = function (models) {
        GpsEntry.belongsTo(models.User);
    };

    return GpsEntry;
};