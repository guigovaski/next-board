import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

import styles from './styles.module.scss';

import rocketImg from '../../../public/images/rocket.svg';

type Props = {
    user: {
        id: string;
        name: string;
        image: string;
    }
}

export default function Donate({ user }: Props) {
    const [showDonation, setShowDonation] = useState(false);

    async function saveDonate() {
        await setDoc(doc(db, 'users', user.id), {
            donater: true,
            lastDonate: new Date(),
            image: user.image,
            name: user.name
        }).then(() => {
            setShowDonation(true);
        })
    }

    return (
        <>
            <Head>
                <title>Página de doação</title>
            </Head>

            <main className={styles.container}>
                <Image src={rocketImg} alt="Imagem Foguete" />

                {showDonation && (
                    <div className={styles.donater}>
                        <Image src={user.image} alt={user.name} width={50} height={50} />
                        <span>Obrigado por se tornar um apoiador, {user.name}</span>
                    </div>
                )}

                <h1>Seja um apoiador deste projeto 🏆</h1>
                <h3>Contribua com apenas <span>R$ 1,00</span></h3>
                <strong>Apareça na nossa home e tenha funcionalidades exclusivas</strong>
            
                <PayPalButtons 
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: '1' 
                                }
                            }]
                        })
                    }}

                    onApprove={(data, actions) => {
                        return actions.order.capture()
                            .then(details => {
                                console.log('Compra aprovada ' + details.payer.name.given_name);
                                saveDonate();
                            })
                    }}
                />
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });

    if (!session?.id) {
        return {
            redirect: {
                destination: '/board',
                permanent: false
            }
        }
    }

    let user = {
        id: session?.id,
        name: session?.user.name,
        image: session?.user.image
    }

    return {
        props: {
            user
        }
    }
}