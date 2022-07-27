import { Types, Schema, models, model } from "mongoose";

const categorySchema = new Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:['post', 'gist', 'feed']
    }
}, {timestamps:true})

const Category = models.Category || model("Category", categorySchema);

export default Category;