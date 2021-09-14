import {POSTS_PATH, postFilePaths } from "../../utils/blogUtils";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Link from "next/link";
import styles from "../../styles/post.module.css";

import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../_app";
import CodeBlock from "../../components/codeBlock";
import Head from "next/head";

const components = {
    code: (props) => (<CodeBlock {...props}/>)
}
const WEBSITE_URL = "https://blog.mssnapps.com";

export default function Post({source, frontMatter, slug}) {

    const [likes, setLikes] = useState(0);
    const [heart, setHeart] = useState(false);

    const theme = useContext(ThemeContext);

    useEffect(() => {
        axios.get(`/api/post?s=${slug}`).then((res) => {
            setLikes(res.data.data.likes);
        })
    }, [slug]);



    const like = (e) => {

        if (heart) {

            axios.post(`/api/post?s=${slug}`, {amount: -1}).then((res) => {
                setLikes(res.data.data.likes);
                setHeart(false);
            }).catch( () => {});
            

        } else {
            axios.post(`/api/post?s=${slug}`, {amount: 1}).then((res) => {
                setLikes(res.data.data.likes);
                setHeart(true);
            }).catch( (err) => {console.error(err)});
            
        }

        
        
        
    }

    return  <div className={theme.theme === "light" ? styles.container : `${styles.container} ${styles.darkContainer}`}>
                <Head>
                    <title>{frontMatter.title} - Juan Aragon</title>
                    <meta type="description" content={frontMatter.summary}/>
                    <meta key="keywords" type="keywords" content={frontMatter.topics.join(", ")}/>
                
                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content={frontMatter.title}/>
                    <meta property="og:description" content={frontMatter.summary}/>
                    <meta property="og:image" content={`${WEBSITE_URL}/banana.png`}/>
                    <meta property="og:site_name" content="JuanAragon.co"/>
                    <meta property="og:url" content={`${WEBSITE_URL}/blog/${slug}`}/>
                    <meta property="article:publisher" content="https://juanaragon.co/"/>
                    <meta property="article:publisher_time" content={new Date(frontMatter.date).toLocaleDateString("en-us", {month: "numeric", day: "numeric", year: "numeric"})}/>


                    <meta property="twitter:card" content="summary_large_image"/>
                    <meta property="twitter:url" content={`${WEBSITE_URL}/blog/${slug}`}/>
                    <meta property="twitter:title" content={frontMatter.title}/>
                    <meta property="twitter:description" content={frontMatter.summary}/>
                    <meta property="twitter:image:src" content={`${WEBSITE_URL}/banana.png`}/>
                    <meta property="twitter:site" content="@juanaragon1997"/>
                    
                    
                </Head>
                <div className={heart ? `${styles.likes} ${styles.likesHeart}` : styles.likes}>
                    <button onClick={like}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ai ai-Heart"><path d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.985.985 0 0 0 1.024 0C21.125 15.395 22 10.157 22 7.95 22 5.216 19.761 3 17 3s-5 3-5 3-2.239-3-5-3z"/></svg>
                    </button>
                    {likes}
                </div>
                <header className={styles.header}>
                    <h1>{frontMatter.title}</h1>
                    <p className="gray">{frontMatter.summary}</p>
                    <p className="gray">{new Date(frontMatter.date).toLocaleDateString("en-us", {month: "long", day: "numeric", year: "numeric"})}</p>
                    <ul className={styles.topics}>
                        {frontMatter.topics.map((topic) => {
                            return <li className={styles.topic} key={topic}>{topic}</li>
                        })}
                    </ul>
                </header>
                <article className={styles.postBody}>
                    <MDXRemote {...source} components={components}/>
                </article>
            </div>
}

export async function getStaticProps({params}) {
    
    const filePath = path.join(POSTS_PATH, params.slug+".mdx");

    const source = fs.readFileSync(filePath);

    const { content, data } = matter(source);

    try {
        data.date = data.date.toISOString();
    } catch (err) {
    }


    const mdxSource = await serialize(content, {
        mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: []
        },
        scope: data
    });

    return {
        props: {source: mdxSource, frontMatter: data, slug: params.slug}
    }
}

export async function getStaticPaths () {
    const paths = postFilePaths.map((path) => path.replace(/\.mdx?$/, "")).map((slug) => ({params: {slug}}))

    return {
        paths,
        fallback: false
    }
}