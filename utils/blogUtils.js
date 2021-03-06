import path from "path";
import fs from "fs";

export const POSTS_PATH = path.join(process.cwd(), "posts");

export const postFilePaths = fs.readdirSync(POSTS_PATH).filter((p) => /\.mdx?$/.test(p));