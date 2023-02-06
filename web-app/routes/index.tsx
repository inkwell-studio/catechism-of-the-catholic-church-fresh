import { Head } from '$fresh/runtime.ts';

export default function Home() {
    return (
        <>
            <Head>
                <title>Catechism</title>
            </Head>
            <body class='bg-gray-500 text-gray-100 font-mono'>
                <div class='h-[80vh] flex flex-col justify-center items-center'>
                    <div class='text-lg sm:text-2xl md:text-2xl lg:text-3xl p-8 flex items-center'>
                        <span className='text-4xl sm:text-6xl opacity-50'>[</span>
                        <span class='px-4 text-center'>Under Construction</span>
                        <span className='text-4xl sm:text-6xl opacity-50'>]</span>
                    </div>
                    <div class='font-italic text-sm sm:text-base'>
                        <span>Please check back on February 7.</span>
                    </div>
                </div>
                <a
                    class='fixed bottom-0 left-0 right-0 text-center py-4 opacity-60 hover:opacity-100 transition-opacity'
                    href='mailto:joecode@tuta.io'
                >
                    Contact
                </a>
            </body>
        </>
    );
}
