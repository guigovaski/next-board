import { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { Header } from '../components/partials/Header';
import '../styles/global.scss';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
    "client-id": "AXI-mWE6AaFgEf8n-lQKwMpcCHNZsER2vSZUj0vKm8IDwTOh-OvFVq0RiUeVafyMY3GrgX0L2SAksUwR",
    currency: "BRL",
    intent: "capture"
}

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <NextAuthProvider session={pageProps.session}>
            <PayPalScriptProvider options={initialOptions}>
                <Header />
                <Component {...pageProps} />
            </PayPalScriptProvider>
        </NextAuthProvider>
    );
}

export default MyApp;
