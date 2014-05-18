var deviceFileOperation=(function(){
    
    var deviceFilesystem=null;
    var applicationDir=null;
    
   var init=function(){
       window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
          deviceFilesystem=fileSystem; 
            deviceFilesystem.root.getDirectory("ProductManagerApp",{create: true, exclusive: false},function(dir){
                  applicationDir=dir;
            },fail);
       }, fail);
   };
    
    var readFile=function(fileName,callBack){
        var fileURI=applicationDir.fullPath+'/'+fileName;
        fileURI="file://"+fileURI;
             window.resolveLocalFileSystemURI(fileURI, function(entry){
                 if(callBack){
                     callBack(entry.fullPath);
                 }
             }, fail); 
    };
    
    var moveFile=function(orgFile,fileName){
       window.resolveLocalFileSystemURI(orgFile, function(entry){
           alert("file found at:: "+entry.fullPath);
               entry.moveTo(applicationDir, fileName,  function(newEntry){
                    alert("new file created at:: "+newEntry.fullPath);
                  console.log("File created");
               }, fail);
       }, fail); 
    };
    
    var deleteFile=function(fileName,callBack){
        var fileURI=applicationDir.fullPath+'/'+fileName;
        deviceFilesystem.root.getFile(fileURI, null, function(fileEntry){
            fileEntry.remove(function(fileEntry){
              console.log("File Deleted");  
               if(callBack){
                    callBack();
                }
            }, fail);
        }, fail);
        
    };
    
    function fail(error) {
        alert("FILE OPERATION ERROR CODE::"+error.code);
    }
    
      $(document).on("deviceready", init);
    
    return{
        readFile:readFile,
        moveFile:moveFile,
        deleteFile:deleteFile
    };
    
})();