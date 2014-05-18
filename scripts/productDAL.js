/// <reference path="DAL.js" />
/// <reference path="DBSchema.js" />

var productDAL = (function () {

    var fetchCallBack;
    var sqlStatement;

    var getAllProducts = function () {
        sqlStatement = 'SELECT Id,ProductName FROM productList';
        DAL.executeSQL(sqlStatement, processRows);
    };

    var getProduct = function (productId) {
        sqlStatement = 'SELECT * FROM productList where id=' + productId;
        DAL.executeSQL(sqlStatement, processRows);
    };

    var processRows = function (tx, results) {
       
        var dbproducts = [];
        for (var i = 0; i < results.rows.length; i++) {
            dbproducts.push(results.rows.item(i));
        }
        if (productDAL.fetchCallBack) {
            productDAL.fetchCallBack(dbproducts);
        }
    };

    var insertProduct = function (values,callBack) {
        var sqlstmt = 'SELECT MAX(id) AS lastId FROM ' + dbSchema.tables[0].name;

        DAL.executeSQL(sqlstmt, function (tx, results) {
            var sqlStatement = 'INSERT INTO ' + dbSchema.tables[0].name + " ";//' (id, productName,price,warrenty_period) VALUES (';
            var cols = '(';
            var vals = '(';
            if (results.rows.item(0).lastId!==null) {
                values.id = results.rows.item(0).lastId + 1;
            }
            else {
                values.id = 1;
            }
            if(values.ProductImage){
            values.ProductImage=values.id+"-"+values.ProductName+"-pImage.png";
                }
            else{
                  values.ProductImage="NoImage.png";
            }
            if(values.BillImage){
            values.BillImage=values.id+"-"+values.ProductName+"-bImage.png"; 
            }else{
                values.BillImage="NoImage.png";
            }
            var insertedDataColumnNames = Object.keys(values);
            for (var i = 0; i < insertedDataColumnNames.length; i++) {
                cols = cols + insertedDataColumnNames[i];

                if ($.type(values[insertedDataColumnNames[i]]) === "string") {
                    if (values[insertedDataColumnNames[i]].trim().split(" ").length > 0) {
                        values[insertedDataColumnNames[i]] = "'" + values[insertedDataColumnNames[i]] + "'";
                    }
                }
                vals = vals + values[insertedDataColumnNames[i]];
                if (i !== insertedDataColumnNames.length - 1) {
                    cols = cols + ',';
                    vals = vals + ',';
                }
            }
            cols = cols + ')';
            vals = vals + ')';
            sqlStatement = sqlStatement + cols + " VALUES " + vals;

            DAL.executeSQL(sqlStatement,function(){
                if(callBack){
                    callBack({'Id':values.id,'ProductName':values.ProductName});
                }
            });
        });
    };

    var updateProduct = function (product,callBack) {
        var sqlStatement = 'UPDATE ' + dbSchema.tables[0].name + ' SET ';
        var columns = Object.keys(product);
        for (var i = 1; i < columns.length; i++) {
            if ($.type(product[columns[i]])==="string") {
                if (product[columns[i]].trim().split(" ").length > 0) {
                    product[columns[i]] = "'" + product[columns[i]] + "'";
                }
            }
            sqlStatement = sqlStatement + columns[i] + '=' + product[columns[i]];
            if (i !== columns.length - 1) {
                sqlStatement = sqlStatement + ',';
            }  
        }
        sqlStatement = sqlStatement + ' where Id=' + product.id;
        DAL.executeSQL(sqlStatement,callBack);
    };

    var deleteProduct = function (productId) {
        var sqlStatement = 'DELETE FROM ' + dbSchema.tables[0].name + ' WHERE Id=' + productId;
        DAL.executeSQL(sqlStatement, productDAL.fetchCallBack);
    };
    
    return {
        getAllProducts: getAllProducts,
        getProduct: getProduct,
        updateProduct:updateProduct,
        insertProduct: insertProduct,
        deleteProduct:deleteProduct,
        fetchCallBack: fetchCallBack
    };
})();