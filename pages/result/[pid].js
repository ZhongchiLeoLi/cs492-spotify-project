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
import ValueSlider from '../../components/ValueSlider';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const httpsAgent = new Agent({
  rejectUnauthorized: false,
});

export async function getServerSideProps({ params }) {
  const id = params.pid;
  // console.log(id);

  // const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);
  const playlist = await fetch(`https://walrus-app-hcvlh.ondigitalocean.app/cs492-back2/playlist?id=${id}`, {agent: httpsAgent});
  const recs = await fetch(`https://walrus-app-hcvlh.ondigitalocean.app/cs492-back2/recs?id=${id}`, {agent: httpsAgent});
  try {
    const PlaylistData = await playlist.json();
    const RecsData = await recs.json();
    console.log("PlaylistData", PlaylistData)

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
  const [recTracks, setRecTracks] = useState(recs.Tracks);
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
  const [disableAc, setDisableAc] = useState(false);
  const [disableDa, setDisableDa] = useState(false);
  const [disableIns, setDisableIns] = useState(false);
  const [disableLi, setDisableLi] = useState(false);
  const [disableEn, setDisableEn] = useState(false);
  const [disableSp, setDisableSp] = useState(false);
  const [disableVa, setDisableVa] = useState(false);

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

  const fields = [
    {
      name: "Acousticness",
      checked: disableAc,
      setChecked: setDisableAc,
      setValue: setAc,
    },
    {
      name: "Danceability",
      checked: disableDa,
      setChecked: setDisableDa,
      setValue: setDa,
    },
    {
      name: "Instrumentalness",
      checked: disableIns,
      setChecked: setDisableIns,
      setValue: setIns,
    },
    {
      name: "Liveness",
      checked: disableLi,
      setChecked: setDisableLi,
      setValue: setLi,
    },
    {
      name: "Energy",
      checked: disableEn,
      setChecked: setDisableEn,
      setValue: setEn,
    },
    {
      name: "Speechiness",
      checked: disableSp,
      setChecked: setDisableSp,
      setValue: setSp,
    },
    {
      name: "Valence",
      checked: disableVa,
      setChecked: setDisableVa,
      setValue: setVa,
    }
  ];

  const updateRecs = async () => {
    let tracks = selectedTracks.join();
    const recs = await fetch(`https://walrus-app-hcvlh.ondigitalocean.app/cs492-back2/recs?id=${id}&seeds=${tracks}`, {agent: httpsAgent});
    try {
      const RecsData = await recs.json();
      const RecsCentroid = RecsData.Centroid;
      setRecTracks(RecsData.Tracks);
      setData({
        ...data,
        datasets: [
          data.datasets[0],
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
    const recs = await fetch(`https://walrus-app-hcvlh.ondigitalocean.app/cs492-back2/recs?id=${id}${disableAc ? "" : "&acousticness=" + ac}${disableDa ? "" : "&danceability=" + da}${disableIns ? "" : "&instrumentalness=" + ins}${disableLi ? "" : "&liveness=" + li}${disableEn ? "" : "&energy=" + en}${disableSp ? "" : "&speechiness=" + sp}${disableVa ? "" : "&valence=" + va}`, {agent: httpsAgent});
    try {
      const RecsData = await recs.json();
      const RecsCentroid = RecsData.Centroid;
      setRecTracks(RecsData.Tracks);
      setData({
        ...data,
        datasets: [
          data.datasets[0],
          {
            ...data.datasets[1],
            data: [RecsCentroid.acousticness, RecsCentroid.danceability, RecsCentroid.instrumentalness, RecsCentroid.liveness, RecsCentroid.energy, RecsCentroid.speechiness, RecsCentroid.valence],
          },
          {
            label: "Your slider values",
            data: [disableAc ? 0 : ac, disableDa ? 0 : da, disableIns ? 0 : ins, disableLi ? 0 : li, disableEn ? 0 : en, disableSp ? 0 : sp, disableVa ? 0 : va],
            backgroundColor: 'rgba(75,192,192, 0.2)',
            borderColor: 'rgb(75,192,192)',
            borderWidth: 1,
          }
        ]
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftCol}>
        <div className={styles.leftHeader}>
          <button onClick={()=>{window.location= `/`}}>Back to home</button>
          <SearchBar placeholder='Paste another playlist link' />
        </div>
        <h4>
          The chart on the right shows the average statistics of your playlist, and the average statistics of the 20 songs recommended by spotify.
          To get the recommendations, 5 songs were selected randomly from your playlist and sent to Spotify. 
        </h4>
        <h5>
          To get new recommendations, you can select 5 songs from your playlist below, and click &quot;Get Recommendations&quot;.
          The chart will be updated with the new recommendations after a short moment.
          Note that the recommendations are different each time, so feel free to click &quot;Get Recommendations&quot; multiple times to see the differences.
        </h5>
        <div className={styles.leftHeader}>
          <h4>Your playlist {`(MSE: ${playlist.MSE.toFixed(3)})`}:</h4>
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
        <div className={styles.leftHeader}>
          <h4>Spotify&apos;s Recommendations:</h4>
        </div>
        <div className={styles.trackList}>
          {recTracks.map((track) => (
            <Link key={track.ID} href={`https://open.spotify.com/track/${track.ID}`} target="_blank" >
              <Track key={track.ID} track={track} />
            </Link>
          ))}
        </div>
        <h5>
          You can also adjust the sliders below, and the values of each field will be sent to Spotify along with your playlist for generating recommendations.
          Disable the sliders if you don&apos;t want their values to be submitted.
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
          {fields.map((field => (
            <ValueSlider key={field.name} field={field} />
          )))}
        </div>
      </div>
      <div className={styles.chart}>
        <Radar type='radar' data={data} />
      </div>
    </div>
  );
}