import { Head } from '$fresh/runtime.ts';

export default function Home() {
    return (
        <>
            <Head>
                <title>Catechism</title>
            </Head>
            <body class="bg-tan-100">
                <div class='h-[80vh] flex flex-col justify-center items-center px-8'>
                    <h1 class="font-serif font-bold text-4xl md:text-5xl lg:text-6xl text-center">Catechism of&nbsp;the Catholic&nbsp;Church</h1>
                    <h2 class='italic text-xl md:text-2xl lg:text-3xl my-4'>Proof of Concept</h2>
                </div>
                <a
                    class='fixed bottom-0 left-0 right-0 text-center py-4 opacity-60 hover:opacity-100 transition-opacity font-sans md:text-lg'
                    href='mailto:joecode@tuta.io'
                >
                    Contact
                </a>
            </body>
        </>
    );
}
