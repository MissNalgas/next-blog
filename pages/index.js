import Topside from "../components/topside";
import Posts from "../components/posts";
import {POSTS_PATH, postFilePaths } from "../utils/blogUtils";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

import styles from "../styles/home.module.css";

import { useState, useEffect } from "react";

import axios from "axios";


export default function Home({posts, topics}) {

  const [filter, setFilter] = useState("");
  const [sPosts, setSPosts] = useState(posts);

  useEffect(() => {
    axios.get("/api/post/all").then((res) => {
      setSPosts((state) => {
        return state.map((post) => {
          const likes = res.data.data.filter((p) => p.slug === post.data.slug)[0].likes || 0;
          post.data.likes = likes;
          return post;
        })
      })
    })
  }, [])


  const selectTopic = (t) => {
    if (filter === t) {
      setFilter("");
    } else {
      setFilter(t);
    }
  }

  return  <div>
            <div className={styles.topics}>
              {topics.map((top) => {
                return <button className={(filter === top) ? `${styles.topic} ${styles.topicSelected}` : styles.topic} key={top} onClick={() => selectTopic(top)}>{top}</button>
              })}
            </div>
            <div className={styles.container}>
              <div className={styles.leftSide}><Posts filter={filter} posts={sPosts} /></div>
              <div className={styles.rightSide}>
                <p className="gray">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et diam suscipit ipsum tincidunt congue ut vitae orci. Quisque non suscipit erat, nec viverra est. Curabitur eget ex vehicula, porta leo bibendum, viverra mauris. Nam et purus vel lectus porta efficitur. Phasellus maximus rutrum vehicula.</p>
              </div>
            </div>
          </div>
}

import Post from "../models/post";
import connectToDB from "../utils/connectToDB";
import { Feed } from "feed";

export async function getStaticProps(context) {

  await connectToDB();
  const siteURL = "http://192.168.39.164:3000";
  const date = new Date();
  const author = {
    name: "Juan Aragon",
    email: "me@juanaragon.co",
    link: "https://juanaragon.co"
  };

  const feed = new Feed({
    title: "Juan Aragon - Blog",
    description: "",
    id: siteURL,
    link: siteURL,
    image: `${siteURL}/logo.svg`,
    favicon: `${siteURL}/favicon.png`,
    copyright: `All right reserved ${date.getFullYear()}, MssnApps.`,
    updated: date,
    generator: "Awesome",
    feedLinks: {
      rss2: `${siteURL}/rss/feed.xml`,
      json: `${siteURL}/rss/feed.json`,
      atom: `${siteURL}/rss/atom.xml`
    },
    author
  })

  const topics = [];

  const posts = postFilePaths.map((filepath) => {

    const source = fs.readFileSync(path.join(POSTS_PATH, filepath));
    const { content, data } = matter(source);

    data.topics.forEach((top) => {
      if (!topics.includes(top)) topics.push(top);
    })

    try {
      data.date = data.date.toISOString();
    } catch (err) {}

    const slug = filepath.replace(/\.mdx?$/, "");
    data.slug = slug;

    Post.exists({slug}).then((res) => {
      if (!res) {
        Post.create({slug, likes: 0});
      } 
    }).catch(() => {});

    data.likes = 33;


    const postUrl = `${siteURL}/blog/${slug}`;
    feed.addItem({
      title: data.title,
      id: postUrl,
      link: postUrl,
      description: data.summary,
      content: data.summary,
      author: [author],
      contributor: [author],
      date: new Date(data.date)
    })
    

    return {
      filepath,
      data
    }
  });

  fs.mkdirSync("./public/rss", {recursive: true});
  fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
  fs.writeFileSync("./public/rss/atom.xml", feed.atom1());
  fs.writeFileSync("./public/rss/feed.json", feed.json1());


  return { props: {posts, topics}}
}