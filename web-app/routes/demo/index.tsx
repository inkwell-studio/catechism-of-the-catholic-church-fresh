import { Head } from '$fresh/runtime.ts';

export default function Demo() {
    return (
        <>
            <Head>
                <title>Catechism</title>
            </Head>
            <body class='font-mono'>
                <div className='h-screen flex flex-col justify-center items-center'>
                    <span>Demo</span>
                    {/* TODO: Add information */}
                    <a href='/demo/read'>[ enter ]</a>
                </div>
            </body>
        </>
    );
}
