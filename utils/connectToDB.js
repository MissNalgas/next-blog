import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Invalid mongo URI")
}

let cache = global.mongoose;

if (!cache) {
    cache = global.mongoose = {conn: null, promise: null};
}

async function connectToDB() {
    if (cache.conn) {
        return cache.conn;
    }

    if (!cache.promise) {

        cache.promise = mongoose.connect(MONGODB_URI).then((m) => m);
    }

    cache.conn = await cache.promise
    return cache.conn;
}

export default connectToDB;