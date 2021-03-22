var Challenge = require('../models/challenge-model');
var ConnectionSteps = require('../../helper/connection-steps');
const constants = require('../../constants');

module.exports.controllerGetAllChallenges = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aChallenge = new Challenge();
        aChallenge.getAllChallenges(connection, function (err, listOfChallenges) {
            callback(err, listOfChallenges);
        });
    });
};

module.exports.controllerGetChallengeById = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aChallenge = new Challenge();
        aChallenge.id = req.params.challengeId;
        aChallenge.getChallengeById(connection, aChallenge.id, function (err, aChallenge) {
            callback(err, aChallenge);
        });
    });
};

module.exports.controllerInsertChallenge = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aChallenge = new Challenge();
        if(req.body.startDate > req.body.endDate){
            let err = new Error();
            err.message = "EndDate must be after StartDate !!!";
            callback(err);
        }else{
        aChallenge.name = req.body.name;
        aChallenge.visibilityType = req.body.visibilityType;
        aChallenge.description = req.body.description;
        aChallenge.tags = req.body.tags;
        aChallenge.location = req.body.location;
        aChallenge.startDate = req.body.startDate;
        aChallenge.endDate = req.body.endDate;
        aChallenge.image = req.body.image;
        aChallenge.isActive = req.body.isActive;
        aChallenge.userId = req.body.userId;
        aChallenge.insertChallenge(connection, aChallenge, function (err, aChallenge) {
            callback(err, aChallenge);
        });
    }
    });
};

module.exports.controllerUpdateChallenge = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aChallenge = new Challenge();
        if(req.body.startDate > req.body.endDate){
            let err = new Error();
            err.message = "EndDate must be after StartDate !!!";
            callback(err);
        }else{
            aChallenge.id = req.body.id;
            aChallenge.name = req.body.name;
            aChallenge.visibilityType = req.body.visibilityType;
            aChallenge.description = req.body.description;
            aChallenge.tags = req.body.tags;
            aChallenge.location = req.body.location;
            aChallenge.startDate = req.body.startDate;
            aChallenge.endDate = req.body.endDate;
            aChallenge.image = req.body.image;
            aChallenge.isActive = req.body.isActive;
            aChallenge.userId = req.body.userId;
            aChallenge.updateChallenge(connection, aChallenge, function (err, aChallenge) {
                callback(err, aChallenge);
            });
        }
        
    });
};

module.exports.controllerDeleteChallenge = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aChallenge = new Challenge();
        let challengeId = req.params.challengeId;
        aChallenge.deleteChallenge(connection, challengeId, function (err, aChallenge) {
            callback(err, aChallenge);
        });
    });
};