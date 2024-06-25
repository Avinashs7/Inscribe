const {Router}=require('express')
const router=Router()
const path=require('path')
const multer=require('multer')
const {blogForm,addBlog,showBlog,viewBlog}=require('../controllers/blog');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
        const filename=`${Date.now()}-${file.originalname}`
        cb(null,filename);
    }
  })
const upload=multer({storage:storage})

router.get('/add',blogForm);

router.post('/add-blog',upload.single('coverImage'),addBlog);

router.get('/view-blogs',viewBlog);

router.get('/show-blog/:id',showBlog);


module.exports=router