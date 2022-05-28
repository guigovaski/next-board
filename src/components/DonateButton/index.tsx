import Link from 'next/link';
import styles from './styles.module.scss';

export const DonateButton = () => { 

    return (
        <Link href="/donate">
            <button className={styles.button}>Donate</button>
        </Link>
    );
}