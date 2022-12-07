import React, {useState, useEffect} from 'react';
import Link from "next/link";
import Image from "next/image";
import styles from '../styles/ValueSlider.module.css'
import Router from 'next/router';
import Slider, { SliderTooltip } from 'rc-slider';


export default function ValueSlider({field}) {
  const {name, checked, setChecked, setValue} = field;

  const marks = {
    0: 0,
    0.1: 0.1,
    0.2: 0.2,
    0.3: 0.3,
    0.4: 0.4,
    0.5: 0.5,
    0.6: 0.6,
    0.7: 0.7,
    0.8: 0.8,
    0.9: 0.9,
    1: 1
  };

  return (
    <div className={styles.sliderRow}>
      <p>{name}</p>
      <Slider disabled={checked} min={0} max={1} step={0.05} defaultValue={0} dots={true} marks={marks} onChange={(val)=> {setValue(val)}}/>
      <div className={styles.checkBox}>
        <input type="checkbox" id={name} name={name} checked={checked} onClick={()=>{setChecked(!checked)}} />
        <label htmlFor={name}>Disable</label>
      </div>
    </div>
  );
}