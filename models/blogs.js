const { default: mongoose } = require('mongoose')
const moongose=require('mongoose')

const blogSchema=new moongose.Schema({
    title:{
        type:String,
        required:true,
    },
    coverImageUrl:{
        type:String,
    },
    tags:{
        type:[String],
    },
    body:{
        type:String,
        required:true,
    },
    createdBy:{
        type:moongose.Types.ObjectId,
        ref:"user",
    }
},{
    timestamps:true,
})

const Blog=mongoose.model('blog',blogSchema)
module.exports=Blog