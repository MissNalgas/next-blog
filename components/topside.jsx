import styles from "./topside.module.css";
import Link from "next/link";

import React from "react";
import {ThemeContext} from "../pages/_app";

export default function Topside() {

    const theme = React.useContext(ThemeContext);

    const toggleTheme = (e) => {

        let myTheme = "dark";
        if (theme.theme === "dark") myTheme = "light";

        theme.setTheme((s) => ({
            ...s,
            theme: myTheme
        }))
    }

    return  <div className={theme.theme === "light" ? styles.container : `${styles.container} ${styles.darkContainer}`}>
                <div className={styles.mainItem}>
                    <span className={styles.logo}>Juan Aragon</span>
                </div>
                <div className={styles.mainItem}>
                    <ul className={styles.menu}>
                        <li className={styles.menuItem}><Link href="/"><a>Latest</a></Link></li>
                        <li className={styles.menuItem}><Link href="/?order=top"><a>Top</a></Link></li>
                    </ul>
                </div>
                <div className={styles.mainItem}>
                    <ul className={styles.menu}>
                        <li className={styles.menuItem}><button onClick={toggleTheme}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" strokeWidth="2" className="ai ai-MoonFill"><path className={styles.moon} d="M20.958 15.325c.204-.486-.379-.9-.868-.684a7.684 7.684 0 0 1-3.101.648c-4.185 0-7.577-3.324-7.577-7.425a7.28 7.28 0 0 1 1.134-3.91c.284-.448-.057-1.068-.577-.936C5.96 4.041 3 7.613 3 11.862 3 16.909 7.175 21 12.326 21c3.9 0 7.24-2.345 8.632-5.675z"/><path className={styles.moon} d="M15.611 3.103c-.53-.354-1.162.278-.809.808l.63.945a2.332 2.332 0 0 1 0 2.588l-.63.945c-.353.53.28 1.162.81.808l.944-.63a2.332 2.332 0 0 1 2.588 0l.945.63c.53.354 1.162-.278.808-.808l-.63-.945a2.332 2.332 0 0 1 0-2.588l.63-.945c.354-.53-.278-1.162-.809-.808l-.944.63a2.332 2.332 0 0 1-2.588 0l-.945-.63z"/></svg></button></li>
                        <li className={styles.menuItem}><a href="/rss/feed.xml"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ai ai-Rss"><path className={styles.rssLine} d="M4 10.418c6.068-.319 9.9 3.514 9.582 9.582"/><circle className={styles.rssCircle} cx="5" cy="19" r="1"/><path className={styles.rssLine} d="M4 4.03C14.114 3.5 20.501 9.887 19.97 20"/></svg></a></li>
                    </ul>
                </div>
            </div>
}