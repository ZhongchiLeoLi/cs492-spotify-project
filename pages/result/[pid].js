import React, { useState, useEffect } from 'react';
import styles from '../../styles/Result.module.css'
import Image from 'next/image'
import Track from '../../components/Track';
import Link from 'next/link';
import Slider, { SliderTooltip } from 'rc-slider';

import { Agent } from 'https';

const { Handle } = Slider;

import 'rc-slider/assets/index.css';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import SearchBar from '../../components/SearchBar';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);



export async function getServerSideProps({ params }) {
  const id = params.pid;
  const httpsAgent = new Agent({
    rejectUnauthorized: false,
  });
  // console.log(id);

  // const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);
  const playlist = await fetch(`https://147.182.164.204:8080/playlist?id=${id}`, {agent: httpsAgent});
  const recs = await fetch(`https://147.182.164.204:8080/recs?id=${id}`, {agent: httpsAgent});
  try {
    const PlaylistData = await playlist.json();
    const RecsData = await recs.json();

    if(!PlaylistData || !RecsData) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        playlist: PlaylistData,
        recs: RecsData,
        id: id,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export default function Result({ playlist, recs, id}) {
  const [selectedTracks, setSelectedTracks] = useState([]);
  const {acousticness, danceability, instrumentalness, liveness, energy, speechiness, valence} = playlist.Centroid;
  const {acousticness: rec_acousticness, danceability: rec_danceability, instrumentalness: rec_instrumentalness, liveness: rec_liveness, energy: rec_energy, speechiness: rec_speechiness, valence: rec_valence} = recs.Centroid;
  const [ac, setAc] = useState(0);
  const [da, setDa] = useState(0);
  const [ins, setIns] = useState(0);
  const [li, setLi] = useState(0);
  const [en, setEn] = useState(0);
  const [sp, setSp] = useState(0);
  const [va, setVa] = useState(0);

  const [data, setData] = useState({
    labels: ['Acousticness', 'Danceability', 'Instrumentalness', 'Liveness', 'Energy', 'Speechiness', 'Valence'],
    datasets: [
      {
        label: 'Your playlist',
        data: [acousticness, danceability, instrumentalness, liveness, energy, speechiness, valence],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: "Spotify's recommendations",
        data: [rec_acousticness, rec_danceability, rec_instrumentalness, rec_liveness, rec_energy, rec_speechiness, rec_valence],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      }
    ],
  });

  const updateRecs = async () => {
    let tracks = selectedTracks.join();
    const recs = await fetch(`https://147.182.164.204:8080/recs?id=${id}&seeds${tracks}`);
    try {
      const RecsData = await recs.json();
      const RecsCentroid = RecsData.Centroid;
      setData({
        ...data,
        datasets: [
          {
            ...data.datasets[0],
            label: 'Your playlist',
            data: [acousticness, danceability, instrumentalness, liveness, energy, speechiness, valence],
          },
          {
            ...data.datasets[1],
            data: [RecsCentroid.acousticness, RecsCentroid.danceability, RecsCentroid.instrumentalness, RecsCentroid.liveness, RecsCentroid.energy, RecsCentroid.speechiness, RecsCentroid.valence],
          }
        ]
      });
    } catch (error) {
      console.log(error);
    }
  }

  const updateRecsWithCustomSpecs = async () => {
    const recs = await fetch(`https://147.182.164.204:8080/recs?id=${id}&acousticness=${ac}&danceability=${da}&instrumentalness=${ins}&liveness=${li}&energy=${en}&speechiness=${sp}&valence=${va}`);
    try {
      const RecsData = await recs.json();
      const RecsCentroid = RecsData.Centroid;
      setData({
        ...data,
        datasets: [
          {
            ...data.datasets[0],
            label: 'Your values',
            data: [ac, da, ins, li, en, sp, va],
          },
          {
            ...data.datasets[1],
            data: [RecsCentroid.acousticness, RecsCentroid.danceability, RecsCentroid.instrumentalness, RecsCentroid.liveness, RecsCentroid.energy, RecsCentroid.speechiness, RecsCentroid.valence],
          }
        ]
      });
    } catch (error) {
      console.log(error);
    }
  }

  const marks = {
    0: 0,
    1: 1
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftCol}>
        <div className={styles.leftHeader}>
          <button onClick={()=>{window.location= `/`}}>Back to home</button>
          <SearchBar placeholder='Paste another playlist link' />
        </div>
        <h4>
          The chart on the right shows the average statistics of your playlist, and the average statistics of the 50 songs recommended by spotify.
          To get the recommendations, 5 songs were selected randomly from your playlist and sent to Spotify. 
        </h4>
        <h5>
          To get new recommendations, you can select 5 songs from your playlist below, and click &quot;Get Recommendations&quot;.
          The chart will be updated with the new recommendations after a short moment.
          Note that the recommendations are different each time, so feel free to click &quot;Get Recommendations&quot; multiple times to see the differences.
        </h5>
        <div className={styles.leftHeader}>
          <h4>Your playlist:</h4>
          <div className={styles.selection}>
            <p className={selectedTracks.length > 5 && styles.error}>{selectedTracks.length}/5</p>
            <button
              onClick={() => setSelectedTracks([])}
            >
              Clear selections
            </button>
            <button
              onClick={() => updateRecs()}
              disabled={selectedTracks.length !== 5}
            >
              <strong>Get Recommendations</strong>
            </button>
          </div>
        </div>
        <div className={styles.trackList}>
          {playlist.Tracks.map((track) => (
            <div 
              key={track.ID}
              className={selectedTracks.includes(track.ID) && styles.selectedTrack}
              onClick={() => {
                if(!selectedTracks.includes(track.ID)) setSelectedTracks([...selectedTracks, track.ID]);
                else setSelectedTracks(selectedTracks.filter((t) => t !== track.ID));
              }}
            >
              <Track track={track} />
            </div>
          ))}
        </div>
        <h5>
          You can also adjust the sliders below, and the values of each field will be sent to Spotify for generating recommendations.
          You will see the graph update shortly after you click &quot;Get Recommendations&quot;.
        </h5>
        <div className={styles.leftHeader}>
          <h4>Value sliders:</h4>
          <button
            onClick={() => updateRecsWithCustomSpecs()}
          >
            <strong>Get Recommendations</strong>
          </button>          
        </div>
        <div className={styles.sliders}>
          <div className={styles.sliderRow}>
              <div>
                <p>Acousticness</p>
                <Slider min={0} max={1} step={0.1} defaultValue={0} dots={true} marks={marks} onChange={(val)=> {setAc(val)}}/>
              </div>
              <div>
                <p>Danceability</p>
                <Slider min={0} max={1} step={0.1} defaultValue={0} dots={true} marks={marks} onChange={(val)=> {setDa(val)}}/>
              </div>
          </div>
          <div className={styles.sliderRow}>
              <div>
                <p>Instrumentalness</p>
                <Slider min={0} max={1} step={0.1} defaultValue={0} dots={true} marks={marks} onChange={(val)=> {setIns(val)}}/>
              </div>
              <div>
                <p>Liveness</p>
                <Slider min={0} max={1} step={0.1} defaultValue={0} dots={true} marks={marks} onChange={(val)=> {setLi(val)}}/>
              </div>
          </div>
          <div className={styles.sliderRow}>
              <div>
                <p>Energy</p>
                <Slider min={0} max={1} step={0.1} defaultValue={0} dots={true} marks={marks} onChange={(val)=> {setEn(val)}}/>
              </div>
              <div>
                <p>Speechiness</p>
                <Slider min={0} max={1} step={0.1} defaultValue={0} dots={true} marks={marks} onChange={(val)=> {setSp(val)}}/>
              </div>
          </div>
          <div className={styles.sliderRow}>
              <div>
                <p>Valence</p>
                <Slider min={0} max={1} step={0.1} defaultValue={0}  dots={true} marks={marks} onChange={(val)=> {setVa(val)}}/>
              </div>
          </div>
        </div>
      </div>
      <div className={styles.chart}>
        <Radar type='radar' data={data} />
      </div>
    </div>
  );
}