/// <reference path="productDAL.js" />
/// <reference path="deviceFileOperation.js" />

selectedProductInfo = {
    selectedProduct: undefined,
    selectedProductImageInfo:{'name':'','imageURI':''},
    selectedProductBillImageInfo:{'name':'','imageURI':''},
    isEdit: false,
    isAddProduct:false
};

var productDetailsVM = (function () {
    
    var productName = ko.observable();
    var category = ko.observable();
    var brand = ko.observable();
    var modelNumber = ko.observable();
    var serialNumber = ko.observable();
    var productImage = ko.observable();
    var price = ko.observable();
    var purchasedDate = ko.observable();
    var warrantyExpiresBy = ko.observable();
    var purchasedAt = ko.observable();
    var billImage = ko.observable();
    var serviceCenterNumber = ko.observable();
    var companyContactNumber = ko.observable();
    var companyUserName = ko.observable();
    var companyPassword = ko.observable();
    var latestComplaintDetails = ko.observable();
    var Notes = ko.observable();
    
    var enlargImage=ko.observable();

    var isAddProduct = ko.observable(false);
    var targetImageHolderElement;
    
    var productImageURI=undefined;
    var productBillImageURI=undefined;
    var isProductImageUpdated=false;
    var isProductBillImageUpdated=false;
    
    var init = function () {
        $("#page-productDetails").on('pagebeforeshow', loadProductDetails);
        
        $("#page-productDetails").on("pageinit", function() {
            $(".photopopup").on({
                popupbeforeposition: function() {
                    var maxHeight = $( window ).height() - 60 + "px";
                    $( ".photopopup img" ).css( "max-height", maxHeight);
                }
            });
        });
    };
    var loadProductDetails = function () {

        isAddProduct(selectedProductInfo.isAddProduct);

        if (selectedProductInfo.isAddProduct) {
            clearInput();
            selectedProductInfo.isAddProduct = false;
        }
        else {
            productDAL.fetchCallBack = renderProductDetails;
            productDAL.getProduct(selectedProductInfo.selectedProduct.Id);
        }
    };
   
    var renderProductDetails = function (product) {
        productName(product[0].ProductName);
        category(product[0].Category);
        brand(product[0].Brand);
        modelNumber(product[0].ModelNumber);
        serialNumber(product[0].SerialNumber);
        productImage(selectedProductInfo.selectedProductImageInfo.imageURI);
        price(product[0].Price);
        purchasedDate(product[0].PurchasedDate);
        warrantyExpiresBy(product[0].WarrantyExpiresBy);
        purchasedAt(product[0].PurchasedAt);
        billImage(selectedProductInfo.selectedProductBillImageInfo.imageURI);
        serviceCenterNumber(product[0].ServiceCenterNumber);
        companyContactNumber(product[0].CompanyContactNumber);
        companyUserName(product[0].CompanyUserName);
        companyPassword(product[0].CompanyPassword);
        latestComplaintDetails(product[0].LatestComplaintDetails);
        Notes(product[0].Notes);
    };
    var enableEdit = function () {
        isEdit(true);
        return true;
    };

    var clearInput = function () {
        productName('');
        category('');
        brand('');
        modelNumber('');
        serialNumber('');
        productImage('');
        price('');
        purchasedDate('');
        warrantyExpiresBy('');
        purchasedAt('');
        billImage('');
        serviceCenterNumber('');
        companyContactNumber('');
        companyUserName('');
        companyPassword('');
        latestComplaintDetails('');
        Notes('');
    };

    var updateProduct = function () {
        var productImageName=selectedProductInfo.selectedProduct.Id+"-"+productName()+"-pImage.png";
        var productBillImageName=selectedProductInfo.selectedProduct.Id+"-"+productName()+"-bImage.png";  
        var productDetails = {  'id': selectedProductInfo.selectedProduct.Id,
                                'ProductName':productName(),
                                'Category':category(),
                                'Brand':brand(),
                                'ModelNumber':modelNumber(),
                                'SerialNumber':serialNumber(),
                                'ProductImage':productImageName,
                                'Price':price(),
                                'PurchasedDate':purchasedDate(),
                                'WarrantyExpiresBy':warrantyExpiresBy(),
                                'PurchasedAt':purchasedAt(),
                                'BillImage':productBillImageName,
                                'ServiceCenterNumber':serviceCenterNumber(),
                                'CompanyContactNumber':companyContactNumber(),
                                'CompanyUserName':companyUserName(),
                                'CompanyPassword':companyPassword(),
                                'LatestComplaintDetails':latestComplaintDetails(),
                                'Notes':Notes()
        };
        productDAL.updateProduct(productDetails,function(){
          if(productName()!==selectedProductInfo.selectedProduct.ProductName){
                 if(!isProductImageUpdated){
                   deviceFileOperation.moveFile("file://"+productImage(),productImageName); // need to change product image file name.
                    isProductImageUpdated=false;
                 }
              if(!isProductBillImageUpdated){
                  deviceFileOperation.moveFile("file://"+billImage(),productBillImageName);  // need to change bill image file name.
                  isProductBillImageUpdated=false;
              }
          }
        });
    };

    var addProduct = function () {
       
        var productDetails = {
                                'ProductName':productName(),
                                'Category':category(),
                                'Brand':brand(),
                                'ModelNumber':modelNumber(),
                                'SerialNumber':serialNumber(),
                                'ProductImage':isProductImageUpdated,//based on it's value as true or false name will image name will be stored in sqlDB.
                                'Price':price(),
                                'PurchasedDate':purchasedDate(),
                                'WarrantyExpiresBy':warrantyExpiresBy(),
                                'PurchasedAt':purchasedAt(),
                                'BillImage':isProductBillImageUpdated,//based on it's value as true or false name will image name will be stored in sqlDB.
                                'ServiceCenterNumber':serviceCenterNumber(),
                                'CompanyContactNumber':companyContactNumber(),
                                'CompanyUserName':companyUserName(),
                                'CompanyPassword':companyPassword(),
                                'LatestComplaintDetails':latestComplaintDetails(),
                                'Notes':Notes() 
                             };
     
        productDAL.insertProduct(productDetails,function(insertedProduct)
                                                    {
                                                      var pname=insertedProduct.ProductName.replace("'","").replace("'","");
                                                      var productImageName=insertedProduct.Id+"-"+pname+"-pImage.png";
                                                      var productBillImageName=insertedProduct.Id+"-"+pname+"-bImage.png";  
                                                      deviceFileOperation.moveFile(productImageURI,productImageName); 
                                                      deviceFileOperation.moveFile(productBillImageURI,productBillImageName);  
                                                       
                                                    });
    };

     
     var capturePhoto=function(evt,ui) {
         var cameraOption={
            quality: 50,
            allowEdit : true,
            encodingType: Camera.EncodingType.PNG,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            destinationType: navigator.camera.DestinationType.FILE_URI
        };
        targetImageHolderElement=ui.target.id;
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, cameraOption);
    };

    var onPhotoDataSuccess = function (imageURI) {
      
        if(targetImageHolderElement==='idProductPhoto'){
              productImage(imageURI);
              productImageURI=imageURI;
            if(!isAddProduct()){
                    isProductImageUpdated=true;
                    var productImageName=selectedProductInfo.selectedProduct.Id+"-"+productName()+"-pImage.png";
                    deviceFileOperation.deleteFile(selectedProductInfo.selectedProductImageInfo.name,function(){
                        deviceFileOperation.moveFile(productImageURI,productImageName); 
                    });
                }
          }
        else{
             billImage(imageURI);
             productBillImageURI=imageURI;
             if(!isAddProduct()){
                 isProductBillImageUpdated=true;
                 var productBillImageName=selectedProductInfo.selectedProduct.Id+"-"+productName()+"-bImage.png";  
                 deviceFileOperation.deleteFile(selectedProductInfo.selectedProductBillImageInfo.name,function(){
                     deviceFileOperation.moveFile(productBillImageURI,productBillImageName);     
                 });
             }
        }
    };
    var zoomInImage=function(evt,ui){
        
         if(ui.currentTarget.id==='idProductEnlarg'){
                 enlargImage(productImage());
         }
        else{
             enlargImage(billImage());
        }
         $("#idEnlargePhoto").popup("open");
    };
    
    var onFail = function (message) {
        alert('Failed because: ' + message);
    };
    
     $(document).on("deviceready", init);

    return {
        productName: productName,
        category: category,
        brand: brand,
        modelNumber: modelNumber,
        serialNumber: serialNumber,
        productImage: productImage,
        price: price,
        purchasedDate: purchasedDate,
        warrantyExpiresBy: warrantyExpiresBy,
        purchasedAt: purchasedAt,
        billImage: billImage,
        serviceCenterNumber: serviceCenterNumber,
        companyContactNumber: companyContactNumber,
        companyUserName: companyUserName,
        companyPassword: companyPassword,
        latestComplaintDetails: latestComplaintDetails,
        Notes: Notes,
        isAddProduct: isAddProduct,
        enableEdit: enableEdit,
        clearInput: clearInput,
        updateProduct: updateProduct,
        addProduct: addProduct,
        capturePhoto:capturePhoto,
        enlargImage:enlargImage,
        zoomInImage:zoomInImage
    };
})();