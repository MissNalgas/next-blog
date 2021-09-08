import '../styles/globals.css'
import Topside from "../components/topside";

import React from "react";
export const ThemeContext = React.createContext({theme: "light", setTheme: () => {}});

function MyApp({ Component, pageProps }) {

  const [sTheme, sSetTheme] = React.useState({
    theme: "light",
    setTheme: (s) => sSetTheme(s) 
  })

  React.useEffect(() => {
    const prefferCS = window.matchMedia("(prefers-color-scheme: dark)");
    if (prefferCS.matches) {
      sSetTheme((s) => ({...s, theme: "dark"}))
    } else {
      sSetTheme((s) => ({...s, theme: "light"}))
    }
    console.log(prefferCS);

  }, []);

  React.useEffect(() => {
    if (sTheme.theme === "dark") {
      Object.assign(document.body.style, {backgroundColor: "#090f14", color: "#fff"})
    } else {
      Object.assign(document.body.style, {backgroundColor: "#fff", color: "#293845"})
    }
  }, [sTheme.theme])
  

  return  <ThemeContext.Provider value={sTheme}>
            <div className="container">
              <Topside/>
              <Component {...pageProps} />
            </div>
          </ThemeContext.Provider>
}

export default MyApp
