import { Head } from '$fresh/runtime.ts';

export default function Demo() {
    return (
        <>
            <Head>
                <title>Catechism</title>
            </Head>
            <body class='bg-gray-600 text-gray-100 font-mono'>
                <div className='h-screen flex flex-col justify-center items-center'>
                    <span>Demo</span>
                    {/* TODO: Add information */}
                    <a href='/demo/read'>[ enter ]</a>
                </div>
            </body>
        </>
    );
}
