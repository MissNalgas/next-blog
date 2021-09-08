import Link from "next/link";
import styles from "./posts.module.css";

import { useRouter } from "next/router";

import { ThemeContext } from "../pages/_app";
import React from "react";

export default function Posts({posts, filter}) {

    const { order } = useRouter().query;
    const theme = React.useContext(ThemeContext);

    return  <div className={theme.theme === "light" ? '' : styles.postDark}>
                <ul className={styles.posts}>
                {posts.filter((post) => {
                    if (filter === "") return true;
                    return post.data.topics.includes(filter)
                    }).sort((a, b) => {
                        if (order === "top") {
                            return b.data.likes - a.data.likes;
                        } else {
                            return new Date(b.data.date) - new Date(a.data.date);
                        }
                    }).map((post) => {
                    return  <li key={post.filepath}>
                                <Link href={`/blog/${post.filepath.replace(/\.mdx?$/, "")}`}><a className={styles.post}>
                                    <h3>{post.data.title}</h3>
                                    <p>{post.data.summary}</p>
                                    <p className={styles.readMore}><i>Read more...</i></p>
                                </a></Link>
                            </li>
                })}
                </ul>
            </div>
}