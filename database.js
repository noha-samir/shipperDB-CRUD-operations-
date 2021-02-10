var async = require('async');
const sql = require('mssql/msnodesqlv8');
require('dotenv').config();
//msnodesqlv8 module is requiered for Windows Authentication without using Username and Password

const pool = new sql.ConnectionPool({
    database: process.env.DATABASE,
    server: process.env.WINDOWSAUTHSERVER,
    driver: process.env.DRIVER,
    options: {
        trustedConnection: true
    }
});

module.exports.connectToSql = function (finalCallback) {

    async.waterfall([
        function (callback) {
            try {
                pool.connect().then(() => {
                    callback(null, pool);
                });
            } catch (error) {
                callback(error);
            }
        }
    ], function (err, aConnection) {
        finalCallback(err, aConnection);
    })
}

module.exports.closeSqlConnection = function (err, connection, finalCallback) {
    if (!err) {
        try {
            connection.close();
            finalCallback(null);
        } catch (error) {
            finalCallback(error);
        }
    } else {
        finalCallback(err);
    }
}

module.exports.pool = pool;