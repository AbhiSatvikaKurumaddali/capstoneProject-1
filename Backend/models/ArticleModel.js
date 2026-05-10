import {Schema,Types,model} from 'mongoose';

const commentSchema=new Schema(
    {
        user:
        {
            type:Types.ObjectId,
            ref:"user",
            required:[true,"User Id required"]
        },
        comment:
        {
            type:String,
            required:[true,"Enter a Comment"]
        },
    }
)

const articleSchema=new Schema(
    {
        author:
        {
            type:Types.ObjectId,
            ref:"user",
            required:[true,"Author Id is required"]
        },
        title:
        {
            type:String,
            required:[true,"Title is required"]
        },
        category:
        {
            type:String,
            required:[true,"category is required"]
        },
        content:
        {
            type:String,
            required:[true,"Content is required"]
        },
        comments:[{type:commentSchema,default:[]}],
        isArticleActive:
        {
            type:Boolean,
            default:true
        }
    },
    {
        versionKey:false,
        timestamps:true,
        strict:"throw"
    }
);
export const ArticleModel=model("author",articleSchema)
