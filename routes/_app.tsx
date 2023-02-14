import { Head } from '$fresh/runtime.ts';
import { AppProps } from '$fresh/server.ts';

export default function App({ Component }: AppProps) {
    return (
        <html>
            <Head>
                <title>Catechism of the Catholic Church</title>
            </Head>
            <body class='min-h-screen bg-tan-100'>
                <Component />
            </body>
        </html>
    );
}
