import React, {useState, useEffect} from 'react';
import Link from "next/link";
import styles from '../styles/SearchBar.module.css'
import Router from 'next/router';



export default function SearchBar({placeholder = "Paste your Spotify playlist link"}) {
  const [value, setValue] = useState("");  

  useEffect(() => {
    const cleanQuery = () => setValue("");
    Router.events.on("routeChangeComplete", cleanQuery);

    return () => {Router.events.off("routeChangeComplete", cleanQuery)};
  }, [])

  const handleClick = (val) => {
    const id = val.slice(val.lastIndexOf("/") + 1);
    window.location= `/result/${id}`;
  }

  return (
    <div className={styles.wrapper}>
      <input 
        className={styles.searchInput}
        type="text" 
        name="" 
        id="" 
        value={value}
        placeholder={placeholder}
        onChange={({ target: { value } }) => setValue(value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleClick(value);
          }
        }}
      />
      <button onClick={()=>{handleClick(value)}}>
        Analyze playlist
      </button>
    </div>
  );
}