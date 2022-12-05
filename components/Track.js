import React, {useState, useEffect} from 'react';
import Link from "next/link";
import Image from "next/image";
import styles from '../styles/Track.module.css'
import Router from 'next/router';



export default function Track({track}) {
  return (
    <div className={styles.container}>
      <Image
        src={track.ImageURL}
        alt={`cover picture for ${track.Artists[0]}'s ${track.Name}`}
        width={50}
        height={50}
      />
      <div className={styles.rightCol}>
        <p>{track.Name}</p>
        <p>{track.Artists[0]}</p>
      </div>
      
    </div>
  );
}