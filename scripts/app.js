
$(document).on("deviceready",function () {
    ko.applyBindings(homeVM, document.getElementById("page-home"));
    ko.applyBindings(productListVM, document.getElementById("page-productList"));
    ko.applyBindings(productDetailsVM, document.getElementById("page-productDetails"));
    $("#deletePopup").popup({ dismissible: false });
    $("#idEnlargePhoto").popup();
});