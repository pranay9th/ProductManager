/// <reference path="productDAL.js" />
/// <reference path="DBSchema.js" />
var DAL = (function () {
    var database;

    var createOrOpenDB = function (schema) {
        database= window.openDatabase(dbSchema.dbName, dbSchema.dbVersion, dbSchema.dbDisplayName, dbSchema.dbSize);
    };

    var executeSQL = function (sqlStatement,callBack) {
        database.transaction(function(tx) {
            tx.executeSql(sqlStatement, [], callBack, errorDB);
        }, errorDB, successDB);
    };
    
    var errorDB = function (err) {
        alert("Error processing SQL: " + err);
    };

    var successDB = function () {
        console.log("success!");
    };

    return {
        createOrOpenDB: createOrOpenDB,
        executeSQL: executeSQL
    };
})();