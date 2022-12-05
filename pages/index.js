import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from "next/link";
import SearchBar from '../components/SearchBar'


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Spotify Playlist Analyzer</title>
        <meta name="description" content="The website analyzes users' spotify playlist and what spotify recommends to the users based on their playlist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Spotify Playlist Analyzer
        </h1>
        <div className={styles.searchWrapper}>
          <SearchBar />
        </div>
        <p>You can find the link of your Spotify playlist by clicking the &quot;...&quot; button near the play button, then click &quot;Copy Playlist Link&quot; under the Share menu</p>
        <Image
          src="/demo.png"
          alt={`demo picture for the instructions of finding your Spotify playlist ID`}
          width={724}
          height={628}
        />

        


        {/* <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p> */}

        {/* <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  )
}
