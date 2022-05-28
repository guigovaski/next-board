import styles from './styles.module.scss';
import Image from 'next/image';
import Link from 'next/link';

import { SignInButton } from '../../SignInButton';

import logoImg from '../../../../public/images/logo.svg';

export const Header = () => {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/">
                    <Image src={logoImg} alt="Logo Board" width={72} height={76} layout="raw" />
                </Link>
                <nav>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                    
                    <Link href="/board">
                        <a>Meu board</a>
                    </Link>
                </nav>
                <SignInButton />
            </div>
        </header>
    );
}