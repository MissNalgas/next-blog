import '../styles/globals.css'
import Topside from "../components/topside";

import React from "react";
export const ThemeContext = React.createContext({theme: "light", setTheme: () => {}});
import Head from "next/head";

function MyApp({ Component, pageProps }) {

  const [sTheme, sSetTheme] = React.useState({
    theme: "light",
    setTheme: (s) => sSetTheme(s) 
  })

  React.useEffect(() => {
    const prefferCS = window.matchMedia("(prefers-color-scheme: dark)");
    
    const themeCookieP = document.cookie.split("; ").find((row) => row.startsWith("theme=")) || "";
    const themeCookie = themeCookieP.split("=")[1] || "";


    if (themeCookie === "dark") {
      sSetTheme((s) => ({...s, theme: "dark"}))
    } else if (themeCookie === "light") {
      sSetTheme((s) => ({...s, theme: "light"}))
    } else if (prefferCS.matches) {
      sSetTheme((s) => ({...s, theme: "dark"}))
    } else {
      sSetTheme((s) => ({...s, theme: "light"}))
    }

  }, []);

  React.useEffect(() => {
    if (sTheme.theme === "dark") {
      Object.assign(document.body.style, {backgroundColor: "#090f14", color: "#fff"})
    } else {
      Object.assign(document.body.style, {backgroundColor: "#fff", color: "#293845"})
    }
  }, [sTheme.theme])
  

  return  <ThemeContext.Provider value={sTheme}>
            <Head>
              <meta key="keywords" name="keywords" content="blog, technology, opinion, security, angular, react, nodejs, frameworks, javascript, coding"/>
              <meta name="robots" content="index, follow"/>
              <meta name="language" content="English"/>
            </Head>
            <div className="container">
              <Topside/>
              <Component {...pageProps} />
            </div>
          </ThemeContext.Provider>
}

export default MyApp
