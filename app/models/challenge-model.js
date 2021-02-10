var async = require('async');
const constants = require('../../constants');
var CRUD = require('../../helper/crud');
var User = require('../models/user-model');
var extraFunctions = require('../../helper/extraFunctions');

function Challenge() {
    this.id = null;
    this.name = null;
    this.visibilityType = null;
    this.description = null;
    this.tags = null;
    this.location = null;
    this.startDate = null;
    this.endDate = null;
    this.image = null;
    this.isActive = null;
    this.userId = null;
}

function challengeMapping(challengeRow) {
    let aChallenge = new Challenge();
    aChallenge.id = challengeRow.Id;
    aChallenge.name = challengeRow.Name;
    aChallenge.visibilityType = challengeRow.VisibilityType;
    aChallenge.description = challengeRow.Description;
    aChallenge.tags = challengeRow.Tags;
    aChallenge.location = challengeRow.Location;
    aChallenge.startDate = challengeRow.StartDate;
    aChallenge.endDate = challengeRow.EndDate;
    aChallenge.image = challengeRow.Image;
    aChallenge.isActive = challengeRow.IsActive;
    aChallenge.userId = challengeRow.UserId;
    return aChallenge;       
};

Challenge.prototype.getChallengeById = function (gConnection, id, finalCallback) {
    async.waterfall([
        function (callback) {
            let aCRUD = new CRUD();
            aCRUD.getObjectById(gConnection,constants.challengeTableName,id,function (err,returnedObj) {
                if(err){
                    callback(err);
                }else{
                    let mappedObj = challengeMapping(returnedObj);
                    callback(null,mappedObj);
                }
            });
        }
    ], function (err,mappedObj) {
        finalCallback(err, mappedObj);
    });
};

Challenge.prototype.getAllChallenges = function (gConnection, finalCallback) {
    async.waterfall([
        function (callback) {
            let aCRUD = new CRUD();
            aCRUD.getAllObjects(gConnection,constants.challengeTableName,function (err,returnedArr) {
                if(err){
                    callback(err);
                }else{
                    callback(null,returnedArr);
                }
            });
        },
        function (listOfChallenges, callback) {
            let outputList = [];
            listOfChallenges.forEach(element => {
                outputList.push(challengeMapping(element));
            });
            callback(null, outputList);
        }
    ],
        function (err, outputList) {
            finalCallback(err, outputList);
        });
};

Challenge.prototype.insertChallenge = function (gConnection, challenge, finalCallback) {
    async.waterfall([
        function (callback) {
            let aUser = new User();
            aUser.getUserById(gConnection, challenge.userId, function (err, aUser) {
                callback(err);
            });
        },
        function(callback) {
            let aExtraFunctions = new extraFunctions();
            let startDate = aExtraFunctions.convertDateToSQLDate(challenge.startDate);
            let endDate = aExtraFunctions.convertDateToSQLDate(challenge.endDate);
            callback(null,startDate,endDate);
        },
        function (startDate,endDate,callback) {
            let aCRUD = new CRUD();
            let ValuesString = "'"+challenge.name + "'," + challenge.visibilityType + ",'" + challenge.description + "','"
            + challenge.tags + "','" + challenge.location + "','" + startDate + "','"
            + endDate + "','" + challenge.image + "','" + challenge.isActive + "'," + challenge.userId;
     
            aCRUD.insertObject(gConnection,constants.challengeTableName,constants.challengeColsString,ValuesString,function (err,insertedId) {
                if(err){
                    callback(err);
                }else{
                    callback(null,insertedId);
                }
            });
        },
        function (insertedId, callback) {
            let aChallenge = new Challenge();
            aChallenge.getChallengeById(gConnection, insertedId, function (err, aChallenge) {
                callback(err, aChallenge);
            });
        }
    ],
        function (err, challenge) {
            finalCallback(err, challenge);
        });
};

Challenge.prototype.updateChallenge = function (gConnection, challenge, finalCallback) {
    async.waterfall([
        function(callback) {
            let aExtraFunctions = new extraFunctions();
            let startDate = aExtraFunctions.convertDateToSQLDate(challenge.startDate);
            let endDate = aExtraFunctions.convertDateToSQLDate(challenge.endDate);
            callback(null,startDate,endDate);
        },
        function (startDate,endDate,callback) {
            var sets = " set Name = '" + challenge.name + "', VisibilityType= " + challenge.visibilityType +","
                + " Description = '" + challenge.description + "', "
                + " Tags = '" + challenge.tags + "',Location = '"+challenge.location+"', "
                + " StartDate = '" + startDate + "',EndDate = '" + endDate + "',"
                + " Image = '" + challenge.image + "',IsActive = '" + challenge.isActive + "',"
                + " UserId = " + challenge.userId ;

            let aCRUD = new CRUD();
            aCRUD.updateObject(gConnection,constants.challengeTableName ,sets,challenge.id,function(err,challenge){
                callback(err, challenge);
            });
        }
    ],
        function (err, challenge) {
            finalCallback(err, challenge);
        });
};

Challenge.prototype.deleteChallenge = function (gConnection, challengeID, finalCallback) {
    async.waterfall([
        function (callback) {
            let aChallenge = new Challenge();
            aChallenge.getChallengeById(gConnection, challengeID, function (err, aChallenge) {
                callback(err, aChallenge);
            });
        },
        function (aChallenge,callback) {
            let aCRUD = new CRUD();
            aCRUD.deleteObject(gConnection,constants.challengeTableName,challengeID,function(err){
                callback(err,aChallenge);
            });
        }
    ],
        function (err, challenge) {
            finalCallback(err, challenge);
        });
};

module.exports = Challenge;

