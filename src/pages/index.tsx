import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import styles from '../styles/styles.module.scss'

import { db } from '../services/firebaseConfig'

import boardUserImg from '../../public/images/board-user.svg';

type DataType = {
  id: string;
  donater: boolean;
  lastDonate: Date;
  image: string;
  name: string;
}

type Props = {
  data: string;
}

export default function Home({ data }: Props) {
  const [donaters, setDonaters] = useState<DataType[]>(JSON.parse(data));
  
  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas</title>
      </Head>

      <main className={styles.mainHome}>
        <Image src={boardUserImg} alt="Ferramenta Board" />
        <section className={styles.mainTool}>
          <h1>Uma ferramenta para seu dia a dia. Escreva, planeje e organize.</h1>
          <p><span>100% Gratuita </span>e online</p>
        </section>

        {donaters.length > 0 && (
          <>
            <h3>Apoiadores:</h3>
            <div className={styles.donaters}>
              {donaters.map((item, index) => (
                <Image key={index} src={item.image} alt={item.name} width={40} height={40} layout="raw" />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  
  const donaters = await getDocs(collection(db, 'users'));
  
  const data = JSON.stringify(donaters.docs.map(item => {
    return {
      id: item.id,
      ...item.data()
    }
  }));

  return {
    props: {
      data
    },
    revalidate: 60 * 60
  }
}
