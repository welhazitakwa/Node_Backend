const multer = require('multer')
const path = require('path')

const imageFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true)
  }else{
    cb('Seulement des images',false)
  }
}

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './public/uploads/')
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  },
})

var upload = multer({
  storage: storage,
  fileFilter: imageFilter,
})
module.exports = upload