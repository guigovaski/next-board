import styles from './styles.module.scss';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/client';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

export const SignInButton = () => {
    const [session] = useSession();

    return !session ? (
        <button
            type="button"
            className={styles.signInButton}
            onClick={() => signIn('github')}
        >
            <FaGithub
                size={30}
                color="#FFb800" 
            />
            Entrar com GitHub
        </button>
    ) : (
        <button
            type="button"
            className={styles.signInButton}
            onClick={() => signOut()}
        >
            <Image src={session.user.image} alt="Foto do usuário" width={40} height={40} layout="raw" />
            Olá {session.user.name}
            <FiX 
                size={30}
                color="#737380"
            />
        </button>
    );
}