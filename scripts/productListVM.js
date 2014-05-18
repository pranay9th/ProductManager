/// <reference path="productDAL.js" />
/// <reference path="productDetailsVM.js" />
/// <reference path="deviceFileOperation.js" />

var productListVM = (function () {
    var products = ko.observableArray();
    var deleteProductId;
    var init = function () {
        $("#page-productList").on('pagebeforeshow', loadProducts);
    };

    var loadProducts = function () {
        productDAL.fetchCallBack = renderProducts;
        productDAL.getAllProducts();
        
    };

    var deleteConfirm = function (item) {
        deleteProductId = item.Id;
        $("#deletePopup").popup("open");
    };

    removeProduct = function () {
        productDAL.fetchCallBack = updateUIProductList;
        productDAL.deleteProduct(deleteProductId);
    };

    var updateUIProductList = function () {
        var currentProductList = products();
        var newProductList = currentProductList.filter(function(p) {
            if (p.Id !== deleteProductId) {
                return true;
            }
        });
        $("#deletePopup").popup("close");
        renderProducts(newProductList);
    };

    var renderProducts = function (data) {
        products(data);
        $('#idProductList').listview('refresh');
    };

    var getSelectedProduct = function (selectedProduct) {
        selectedProductInfo.selectedProduct = selectedProduct;
        selectedProductInfo.selectedProductImageInfo.name=selectedProductInfo.selectedProduct.Id+"-"+selectedProductInfo.selectedProduct.ProductName+"-pImage.png";
        selectedProductInfo.selectedProductBillImageInfo.name=selectedProductInfo.selectedProduct.Id+"-"+selectedProductInfo.selectedProduct.ProductName+"-bImage.png";
        deviceFileOperation.readFile(selectedProductInfo.selectedProductImageInfo.name,function(pImageURI){
            selectedProductInfo.selectedProductImageInfo.imageURI=pImageURI;
            deviceFileOperation.readFile(selectedProductInfo.selectedProductBillImageInfo.name,function(bImageURI){
                    selectedProductInfo.selectedProductBillImageInfo.imageURI=bImageURI;
                    $.mobile.changePage("#page-productDetails");  
            });
        });
    };
   

    $(document).on("deviceready", init);

    return {
        products: products,
        getSelectedProduct: getSelectedProduct,
        removeProduct: removeProduct,
        deleteConfirm: deleteConfirm
    };
})();
