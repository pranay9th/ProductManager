/// <reference path="DBSchema.js" />
/// <reference path="productDAL.js" />
/// <reference path="productDetailVM.js" />

var homeVM = (function () {
    var userOption = ko.observableArray();
    
    var init = function () {
        var options = [];
        options.push({ 'id': 'option_1', 'name': 'Get Stored Product' });
        options.push({ 'id': 'option_2', 'name': 'Add New Product' });
        userOption(options);
       
        dbSchema.createOrOpenDB();
        dbSchema.createOrGetTable();
      
    };


    var getUserSelection = function (option) {
        switch (option.id) {
            case 'option_1':
                $.mobile.changePage("#page-productList");
                break;
            case 'option_2':
                selectedProductInfo.isAddProduct = true;
                $.mobile.changePage("#page-productDetails");
                break;
        }
    };

    $(document).on("deviceready", init);

    return {
        userOption: userOption,
        getUserSelection: getUserSelection
    };
})();
