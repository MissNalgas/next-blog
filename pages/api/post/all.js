import connectToDB from "../../../utils/connectToDB";
import Post from "../../../models/post";

export default async function handler(req, res) {
    
    const { method } = req;
    await connectToDB();

    switch(method){
        case "GET":
            try {
                const data = await Post.find({});
                res.status(200).json({message: "success", data});
            } catch (err) {
                res.status(500).json({message: "Error"})
            }
            break;
        default:
            res.status(400).json({message: "Page not found"})
            break;
    }

}