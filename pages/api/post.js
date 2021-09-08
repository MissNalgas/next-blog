import connectToDB from "../../utils/connectToDB";
import Post from "../../models/post";

export default async function handler(req, res) {

    const { method } = req;
    const { s } = req.query;

    await connectToDB();

    switch (method) {
        case "GET":
            try {
                
                const posts = await Post.findOne({slug: s});
                res.status(200).json({message: "success", data: posts});

            } catch (err) {
                console.log(err);
                res.status(500).json({message: "Error fetching post"})
            }
            break;
        case "POST":
            try {
                const data = await Post.findOneAndUpdate({slug: s}, {$inc: {likes: 1}}, {new: true});
                res.status(200).json({message: "success", data});
            } catch (err) {
                res.status(500).json({message: "error"});
            }
            break;
        default:
            res.status(400).json({message: "Route not found"});
    }

}