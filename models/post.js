import mongoose from "mongoose";


const PostSchema = new mongoose.Schema({
    slug: String,
    likes: Number
})

export default mongoose.models.Post || mongoose.model("Post", PostSchema);