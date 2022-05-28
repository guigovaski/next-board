import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { format } from 'date-fns';
import brazilLocale from 'date-fns/locale/pt-BR';

import styles from './task.module.scss';
import { FiCalendar } from 'react-icons/fi';

type DataType = {
    id: string;
    created: string | Date;
    createdFormated: string;
    name: string;
    task: string;
    userId: string;
}

type Props = {
    data: string;
}

export default function Task({ data }: Props) {
    const task = JSON.parse(data) as DataType;

    return (
        <>
            <Head>
                <title>Detalhes da tarefa</title>  
            </Head>

            <article className={styles.container}>
                <div className={styles.taskHeader}>
                    <FiCalendar size={25} color="#FFF" />
                    <span>Tarefa criada em:</span>
                    <time>{task.createdFormated}</time>
                </div>
                <p>{task.task}</p>
            </article>  
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    let { id } = params;
    const session = await getSession({ req });

    if (!session?.lastDonate) {
        return {
            redirect: {
                destination: '/board',
                permanent: false
            }
        }
    }

    const docRef = doc(db, 'tasks', id as string);
    const data = await getDoc(docRef)
        .then(snap => {
            let data = {
                id: snap.id,
                created: snap.data().created,
                createdFormated: format(snap.data().created.toDate(), 'dd/MM/yyyy', {locale: brazilLocale}),
                name: snap.data().name,
                task: snap.data().task,
                userId: snap.data().userId

            }

            return JSON.stringify(data);
        })
        .catch(() => {
            return {}
        })

    if (Object.keys(data).length === 0) {
        return {
            redirect: {
                destination: '/board',
                permanent: false
            }
        }
    }

    return {
        props: {
            data
        }
    }
}