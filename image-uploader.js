var multer = require('multer');
var upload = multer({dest: './uploads/'});
var cloudinary = require('cloudinary');

var config = require('./config/cloudinary');
cloudinary.config(config);

module.exports.upload = function image_upload(path,id){
    return new Promise(function(fulfill,reject){
        console.log("In promise 1");
        var options = {};
        if (id)
            options.public_id = id;
        cloudinary.uploader.upload(path, function(result,error){
            console.log("In promise 2");
            if (error)
            {console.log("In promise 3");
                reject(error);}
            else {
                console.log("In promise 4");
                fulfill({url: result.url, id: result.public_id});
            }
        }, options);
    })
};
module.exports.middlewares = {
    //Move single to it's proper place, doesnt belong in the image uploader
    single : upload.single(),
    photo: upload.single('photo'),
    photos: upload.array('photos',2)

};

