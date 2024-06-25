const Blog=require('../models/blogs')

const blogForm=(req,res)=>{
    return res.render('blogForm',{user:req.user});
}

const addBlog=async(req,res)=>{
    const {title,tags,body}=req.body;
    await Blog.create({title:title,tags:tags,body:body,coverImageUrl:`/uploads/${req.file.filename}`,createdBy:req.user._id})
    .then((data)=>{
        res.redirect(`/blog/show-blog/${data._id}`);
    })
    .catch((err)=>{
        console.error(err);
    })
}

const showBlog=async(req,res)=>{
    const id=req.params.id;
    const blogs=await Blog.findById(id);
    res.render('viewBlog',{user:req.user,blogs:blogs});
}

const viewBlog=async(req,res)=>{
    const blogs=await Blog.find({});
    res.render('blog',{user:req.user,blogs:blogs});
}

module.exports={blogForm,addBlog,showBlog,viewBlog}