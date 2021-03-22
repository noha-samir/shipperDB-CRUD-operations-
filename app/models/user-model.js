var async = require('async');
const constants = require('../../constants');
var CRUD = require('../../helper/crud');

function User() {
    this.id = null;
    this.name = null;
    this.email = null;
    this.password = null;
    this.otp = null;
    this.fcmToken = null;
    this.createdBy = null;
    this.updatedBy = null;
    this.createdOn = null;
    this.updatedOn = null;
    this.parentAccountId = null;
    this.isActive = null;
}

function userMapping(userRow) {
    let aUser = new User();
    aUser.id = userRow.Id;
    aUser.name = userRow.Name;
    aUser.email = userRow.Email;
    aUser.password = userRow.Password;
    aUser.otp = userRow.OTP;
    aUser.fcmToken = userRow.FCMToken;
    aUser.createdBy = userRow.CreatedBy;
    aUser.updatedBy = userRow.UpdatedBy;
    aUser.createdOn = userRow.CreatedOn;
    aUser.updatedOn = userRow.UpdatedOn;
    aUser.parentAccountId = userRow.ParentAccountId;
    aUser.isActive = userRow.IsActive;
    return aUser;
};

User.prototype.getUserById = function (gConnection, id, finalCallback) {
    async.waterfall([
        function (callback) {
            let aCRUD = new CRUD();
            aCRUD.getObjectById(gConnection,constants.userTableName,id,function (err,returnedObj) {
                if(err){
                    callback(err);
                }else{
                    let mappedObj = userMapping(returnedObj);
                    callback(null,mappedObj);
                }
            });
        }
    ], function (err,mappedObj) {
        finalCallback(err, mappedObj);
    });
};

User.prototype.checkCredentials = function (gConnection, email, password, finalCallback) {

    async.waterfall([
        function (callback) {
            var queryString = "select * from [ShipperDB].[dbo].[User] where email = '" + email + "';";
            gConnection.query(queryString, (err, result) => {
                if (!err) {
                    if (result.recordsets[0].length > 0) {
                        let returnedUser = userMapping(result.recordsets[0][0]);
                        if (returnedUser != null && returnedUser.password == password) {
                            callback(null, returnedUser);
                        } else {
                            callback(null);
                        }
                    } else {
                        let Err = new Error();
                        Err.message = "No user with this Email!!!";
                        callback(Err);
                    }
                }
                else {
                    callback(err);
                }
            });
        }
    ], function (err, user) {
        finalCallback(err, user);
    });

};

User.prototype.updateUserToken = function (gConnection, user, token, finalCallback) {
    async.waterfall([
        function (callback) {
            var queryString = "update [ShipperDB].[dbo].[User] set FCMToken = '" + token + "' where Id = " + user.id + ";";
            gConnection.query(queryString, (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    if (result.rowsAffected.length > 0) {
                        user.fcmToken = token;
                        callback(null, user);
                    }
                    else {
                        var Err = new Error();
                        Err.message = "Err in update token!!!";
                        callback(Err);
                    }
                }
            });
        }
    ], function (err, user) {
        finalCallback(err, user);
    });
};

User.prototype.getUserAuth = function (gConnection, userId, finalCallback) {
    var self = this;
    self.id = userId;
    async.waterfall([
        function (callback) {
            var queryString = "SELECT FCMToken FROM [ShipperDB].[dbo].[User] where Id = " + self.id + ";";
            gConnection.query(queryString, (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    if (result.recordsets[0].length > 0) {
                        self.FCMToken = result.recordsets[0][0].FCMToken;
                        callback(null);
                    }
                    else {
                        let Err = new Error();
                        Err.message = "No user with this token!!!";
                        callback(Err);
                    }
                }
            });
        }
    ], function (err) {
        finalCallback(err, self);
    });

};

User.prototype.getAllUsers = function (gConnection, finalCallback) {
    async.waterfall([
        function (callback) {
            let aCRUD = new CRUD();
            aCRUD.getAllObjects(gConnection,constants.userTableName,function (err,returnedArr) {
                if(err){
                    callback(err);
                }else{
                    callback(null,returnedArr);
                }
            });
        },
        function (listOfUsers, callback) {
            let outputList = [];
            listOfUsers.forEach(element => {
                outputList.push(userMapping(element));
            });
            callback(null, outputList);
        }
    ],
        function (err, outputList) {
            finalCallback(err, outputList);
        });
};

User.prototype.insertUser = function (gConnection, user, finalCallback) {
    async.waterfall([
        function (callback) {
            let aUser = new User();
            aUser.checkEmail(gConnection, user.email, function (err, found) {
                if (err) {
                    callback(err);
                } else {
                    if (found == true) {
                        var Err = new Error();
                        Err.message = "This email is already exist!!!";
                        callback(Err);
                    } else {
                        callback(null);
                    }
                }
            });
        },
        function (callback) {
                let aCRUD = new CRUD();
                let ValuesString = "'"+ user.name + "','" + user.email + "'," + user.password + ","
                + user.createdBy + "," + user.updatedBy + ",GETDATE()," + user.updatedOn + ","
                + user.parentAccountId + ",'" + user.isActive +"'";
    
                aCRUD.insertObject(gConnection,constants.userTableName,constants.userColsString,ValuesString,function (err,insertedId) {
                    if(err){
                        callback(err);
                    }else{
                        callback(null,insertedId);
                    }
                });
        },
        function (insertedId, callback) {
            let aUser = new User();
            aUser.getUserById(gConnection, insertedId, function (err, aUser) {
                callback(err, aUser);
            });
        }
    ],
        function (err, user) {
            finalCallback(err, user);
        });
};

User.prototype.checkEmail = function (gConnection, email, finalCallback) {
    async.waterfall([
        function (callback) {
            var queryString = "select * from [ShipperDB].[dbo].[User] where email = '" + email + "';";
            gConnection.query(queryString, (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    if (result.recordsets[0].length > 0) {
                        callback(null, true, result.recordsets[0][0].Id);
                    }
                    else {
                        callback(null, false);
                    }
                }
            });
        }
    ],
        function (err, found, userId) {
            finalCallback(err, found, userId);
        });
};

User.prototype.updateUser = function (gConnection, user, finalCallback) {
    async.waterfall([
        function (callback) {
            let aUser = new User();
            aUser.checkEmail(gConnection, user.email, function (err, found,userID) {
                if (err) {
                    callback(err);
                } else {
                    if (user.id != userID && found == true) {
                        var Err = new Error();
                        Err.message = "This email is already exist!!!";
                        callback(Err);
                    } else {
                        callback(null);
                    }
                }
            });
        },
        function (callback) {

            var sets = " set Name = '" + user.name + "', Email= '" + user.email + "',Password = " + user.password + ", "
                + " UpdatedBy = " + user.updatedBy + ",UpdatedOn = GETDATE(), "
                + " ParentAccountId = " + user.parentAccountId + ",IsActive = '" + user.isActive + "'"

            let aCRUD = new CRUD();
            aCRUD.updateObject(gConnection,constants.userTableName,sets,user.id,function(err,user){
                callback(err, user);
            });

        }
    ],
        function (err, user) {
            finalCallback(err, user);
        });
};

User.prototype.deleteUser = function (gConnection, userID, finalCallback) {
    async.waterfall([
        function (callback) {
            let aCRUD = new CRUD();
            aCRUD.deleteAllRecordsRelatedToUser(gConnection, constants.challengeTableName, userID, function (err) {
                callback(err);
            });
        },
        function (callback) {
            let aUser = new User();
            aUser.getUserById(gConnection, userID, function (err, aUser) {
                callback(err, aUser);
            });
        },
        function (aUser,callback) {
            let aCRUD = new CRUD();
            aCRUD.deleteObject(gConnection,constants.userTableName,userID,function(err){
                callback(err,aUser);
            });
        }
    ],
        function (err, user) {
            finalCallback(err, user);
        });
};

module.exports = User;