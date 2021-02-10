var User = require('../models/user-model');
var ConnectionSteps = require('../../helper/connection-steps');
var Config = require('../../helper/config');
var jwt = require('jsonwebtoken');
var conn = require('../../database');
var async = require('async');
const constants = require('../../constants');

module.exports.controllerLogin = function (req, res, next) {
    let aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, finalCallback) {
        let aUser = new User();
        async.waterfall([
            //validate email and password (checkCredentials)
            function (callback) {
                aUser.checkCredentials(connection, req.body.email, req.body.password, function (err, user) {
                    if (err) {
                        callback(err);
                    } else {
                        if (user == null || user == undefined) {
                            var error = new Error();
                            error.message = "Invalid e-mail or password !!!";
                            callback(error);
                        } else {
                            callback(null, user);
                        }
                    }
                });
            },
            //create token
            function (user, callback) {
                var token = jwt.sign({
                    data: { id: user.id, email: user.email },
                    exp: Math.floor(Date.now() / 1000) + (60 * 60)
                }, Config.secret, {});

                callback(null, token, user);
            },
            //update token
            function (token, user, callback) {
                aUser.updateUserToken(connection, user, token, function (err, user) {
                    callback(err, user);
                });
            }
        ], function (err, user) {
            finalCallback(err, user);
        });
    });

};

module.exports.controllerSignup = function (req, res, next) {
    let aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, finalCallback) {
        let aUser = new User();
        aUser.name = req.body.name;
        aUser.email = req.body.email;
        aUser.password = req.body.password;
        aUser.createdBy = null;
        aUser.updatedBy = null;
        aUser.createdOn = null;
        aUser.updatedOn = null;
        aUser.parentAccountId = constants.parentAccountId;
        aUser.isActive = true;

        async.waterfall([
            //validate email
            function (callback) {
                aUser.checkEmail(connection, aUser.email, function (err, found) {
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
            //insert user
            function (callback) {
                aUser.insertUser(connection, aUser, function (err, aUser) {
                    callback(err, aUser);
                });
            },
            //create token
            function (user, callback) {
                var token = jwt.sign({
                    data: { id: user.id, email: user.email },
                    exp: Math.floor(Date.now() / 1000) + (60 * 60)
                }, Config.secret, {});

                callback(null, token, user);
            },
            //update token
            function (token, user, callback) {
                aUser.updateUserToken(connection, user, token, function (err, user) {
                    callback(err, user);
                });
            }
        ], function (err, user) {
            finalCallback(err, user);
        });
    });

};

module.exports.verifyToken = function (token, finalcallback) {

    let aUser = new User();
    let aConnection = null;

    async.waterfall([
        function (callback2) {
            conn.connectToSql(function (err, connection) {
                aConnection = connection;
                callback2(err);
            });
        },
        //verify token
        function (callback2) {
            jwt.verify(token, Config.secret, function (err, decoded) {
                if (err) {
                    err.status = 403;
                    callback2(err, null);
                } else {
                    callback2(null, decoded.data.id);
                }
            });
        },
        //getUserAuth
        function (userId, callback2) {
            aUser.getUserAuth(aConnection, userId, function (err, user) {
                if (!err) {
                    if (user != null && user != undefined) {
                        if (user && token == user.FCMToken) {
                            callback2(null);
                        }
                        else {
                            let err = new Error();
                            err.message = "Your session has been expired";
                            err.status = 401;
                            callback2(err);
                        }
                    }
                    else {
                        let err = new Error();
                        err.message = "UNDIFINED USER";
                        err.status = 401;
                        callback2(err);
                    }
                }
                else {
                    callback2(err);
                }
            });
        },
        //getUserById
        function (callback2) {
            aUser.getUserById(aConnection, aUser.id, function (err, aUser) {
                callback2(err, aUser);
            });
        }
    ],
        function (err, aUser) {
            //closeSqlConnection
            conn.closeSqlConnection(err, aConnection, function (Err) {
                finalcallback(Err, aUser);
            });
        }
    );
};

module.exports.controllerGetAllUsers = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aUser = new User();
        aUser.getAllUsers(connection, function (err, listOfUsers) {
            callback(err, listOfUsers);
        });
    });
};

module.exports.controllerGetUserById = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aUser = new User();
        aUser.id = req.params.userId;
        aUser.getUserById(connection, aUser.id, function (err, aUser) {
            callback(err, aUser);
        });
    });
};

module.exports.controllerInsertUser = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aUser = new User();
        aUser.name = req.body.name;
        aUser.email = req.body.email;
        aUser.password = req.body.password;
        aUser.createdBy = req.user.id;
        aUser.updatedBy = null;
        aUser.createdOn = null;
        aUser.updatedOn = null;
        aUser.parentAccountId = req.body.parentAccountId;
        aUser.isActive = req.body.isActive;
        aUser.insertUser(connection, aUser, function (err, aUser) {
            callback(err, aUser);
        });
    });
};

module.exports.controllerUpdateUser = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aUser = new User();
        aUser.id = req.body.id;
        aUser.name = req.body.name;
        aUser.email = req.body.email;
        aUser.password = req.body.password;
        aUser.updatedBy = req.user.id;
        aUser.updatedOn = null;
        aUser.parentAccountId = req.body.parentAccountId;
        aUser.isActive = req.body.isActive;
        aUser.updateUser(connection, aUser, function (err, aUser) {
            callback(err, aUser);
        });
    });
};

module.exports.controllerDeleteUser = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aUser = new User();
        let userId = req.params.userId;
        aUser.deleteUser(connection, userId, function (err, aUser) {
            callback(err, aUser);
        });
    });
};