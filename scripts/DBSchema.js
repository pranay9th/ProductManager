var dbSchema = {
    dbName: '',
    dbDisplayName: '',
    dbVersion: '',
    dbSize: '',
    tables: [], //it will be list of table object
    sqlQuery: '',
    executionCallBack: '',//hold the query execution callback function.
    createOrOpenDB: function () {
        dbSchema.dbName = "ProductDB";
        dbSchema.dbDisplayName = "ProductDB";
        dbSchema.dbSize = 200000;
        dbSchema.dbVersion = "1.0";
        DAL.createOrOpenDB();
    },
    createOrGetTable: function (callBack) {
        var columns = [];
        columns.push({ 'name': 'Id', type: 'unique' });
        columns.push({ 'name': 'ProductName' });
        columns.push({ 'name': 'Category' });
        columns.push({ 'name': 'Brand' });
        columns.push({ 'name': 'ModelNumber' });
        columns.push({ 'name': 'SerialNumber' });
        columns.push({ 'name': 'ProductImage' });
        columns.push({ 'name': 'Price' });
        columns.push({ 'name': 'PurchasedDate' });
        columns.push({ 'name': 'WarrantyExpiresBy' });
        columns.push({ 'name': 'PurchasedAt' });
        columns.push({ 'name': 'BillImage' });
        columns.push({ 'name': 'ServiceCenterNumber' });
        columns.push({ 'name': 'CompanyContactNumber' });
        columns.push({ 'name': 'CompanyUserName' });
        columns.push({ 'name': 'CompanyPassword' });
        columns.push({ 'name': 'LatestComplaintDetails' });
        columns.push({ 'name': 'Notes' });

        table.name = "productList";
        table.columns = columns;
        dbSchema.tables.push(table);
        var sqlStatement;

        //Just for the first time --Droping old table
        //sqlStatement = 'DROP TABLE IF EXISTS productList';
        //DAL.executeSQL(sqlStatement, callBack);
        //

        sqlStatement = "CREATE TABLE IF NOT EXISTS " + table.name + "(";
        for (var i = 0; i < table.columns.length; i++) {
            sqlStatement = sqlStatement + table.columns[i].name;
            if (table.columns[i].type !== undefined) {
                sqlStatement = sqlStatement + " " + table.columns[i].type;
            }
            if (i !== table.columns.length - 1) {
                sqlStatement = sqlStatement + ",";
            }
        }
        sqlStatement = sqlStatement + ")";
       
        DAL.executeSQL(sqlStatement, callBack);
    }
};
var table = {
    tblName: '',
    columns:[]  //it will be list of column object
};

var column = {name:'',type:''};
