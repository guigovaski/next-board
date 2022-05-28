import styles from './styles.module.scss';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { db } from '../../services/firebaseConfig';
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { format, formatDistance } from 'date-fns';
import brazilLocale from 'date-fns/locale/pt-BR';

import { FaEdit, FaPlus, FaTrash, FaClock } from 'react-icons/fa';
import { FiCalendar } from 'react-icons/fi';
import { DonateButton } from '../../components/DonateButton';
import { FiX } from 'react-icons/fi';

type TaskListType = {
    id: string;
    created: string | Date;
    createdFormated?: string;
    task: string;
    userId: string;
    name: string;
}

type Props = {
    user: {
        name: string;
        id: string;
        lastDonate: string | Date | false;
    },
    data: string;
}

export default function Board({ user, data }: Props) {
    const [task, setTask] = useState('');
    const [taskList, setTaskList] = useState<TaskListType[]>(JSON.parse(data));
    const [taskEdit, setTaskEdit] = useState<TaskListType | null>(null);

    async function handleAddTask(e: FormEvent) {
        e.preventDefault();

        if (!task) {
            alert('Preencha alguma tarefa!');
            return;
        }

        if (taskEdit) {
            await updateDoc(doc(db, 'tasks', taskEdit.id), {
                task
            })
                .then(() => {
                    let data = taskList;
                    let taskIndex = taskList.findIndex(item => item.id === taskEdit.id);
                    data[taskIndex].task = task;

                    setTaskList(data);
                    setTaskEdit(null);
                    setTask('');
                }) 
        }

        await addDoc(collection(db, 'tasks'), {
            created: new Date(),
            task,
            userId: user.id,
            name: user.name
        })
            .then(doc => {
                let data = {
                    id: doc.id,
                    created: new Date(),
                    createdFormated: format(new Date(), 'dd MMMM yyyy'),
                    task,
                    userId: user.id,
                    name: user.name
                }

                setTaskList([...taskList, data]);
                setTask('');
            })
            .catch(err => console.log(err))
    }

    async function handleDeleteTask(id: string) {
        await deleteDoc(doc(db, 'tasks', id))
            .then(() => {
                const dataUpdated = taskList.filter(item => item.id !== id);

                setTaskList(dataUpdated);
            })
            .catch(err => {
                console.log(err);
            })
    }

    async function handleEditTask(task: TaskListType) {
        setTask(task.task);
        setTaskEdit(task);
    }

    async function handleCancelEdit() {
        setTask('');
        setTaskEdit(null);
    }

    return (
        <>
            <Head>
                <title>Minhas tarefas - Board</title>
            </Head>

            <main className={styles.mainContainer}>
                {taskEdit && (
                    <button type="button" className={styles.cancelButton} onClick={handleCancelEdit}>
                        <FiX size={25} color="#FF3636" />
                        Cancelar
                    </button>
                )}
                <form onSubmit={handleAddTask}>
                    <input 
                        type="text" 
                        placeholder="Escreva uma tarefa..." 
                        value={task}
                        onChange={e => setTask(e.target.value)}
                    />
                    <button type="submit">
                        <FaPlus size={24} color="#17181f" />
                    </button>
                </form>

                <h1>Você tem {taskList.length} taref{taskList.length > 1 ? 'as' : 'a'}</h1>

                <section className={styles.taskContainer}>
                    {taskList.map(item => (
                        <>
                            <article key={item.id} className={styles.taskList}>
                                <Link href={`/board/${item.id}`}>
                                    <p>{item.task}</p>
                                </Link>
                                <div className={styles.actions}>
                                    <div className={styles.edit}>
                                        <div>
                                            <FiCalendar size={20} color="#FFB800" />
                                            <time>{item.createdFormated}</time>
                                        </div>
                                        <div>
                                            {user.lastDonate && (
                                                <button type="button" onClick={() => handleEditTask(item)}>
                                                    <FaEdit size={20} color="#FFF" />
                                                    Editar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.delete}>
                                        <button type="submit" onClick={() => handleDeleteTask(item.id)}>
                                            <FaTrash size={20} color="#FF3636" />
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </article>         
                        </>
                    ))}
                </section>
            </main>

            {user.lastDonate && (
                <section className={styles.donationsContainer}>
                    <h2>Obrigado por apoiar esse projeto.</h2>
                    <div className={styles.donations}>
                        <FaClock size={25} color="#FFF" />
                        <time>Ultima doação foi há {formatDistance(new Date(user.lastDonate), new Date(), { locale: brazilLocale })}</time>
                    </div>
                </section>
            )}
            
            <DonateButton />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });

    if (!session?.id) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const q = query(collection(db, 'tasks'), where('userId', '==', session?.id), orderBy('created', 'asc'))
    const tasks = await getDocs(q);
    const data = JSON.stringify(tasks.docs.map(item => {
        return {
            id: item.id,
            createdFormated: format(item.data().created.toDate(), 'dd/MM/yyyy', {locale: brazilLocale}),
            ...item.data()
        }
    }));

    const user = {
        name: session?.user.name,
        id: session?.id,
        lastDonate: session?.lastDonate
    }

    return {
        props: {
            user,
            data
        }
    }
}