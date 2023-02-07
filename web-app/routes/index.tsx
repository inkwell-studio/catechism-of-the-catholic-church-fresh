import { Head } from '$fresh/runtime.ts';

export default function Home() {
    return (
        <>
            <Head>
                <title>Catechism of the Catholic Church</title>
            </Head>
            <body class='flex flex-col items-center bg-tan-100'>
                <div class='h-[80vh] flex flex-col justify-center items-center px-8'>
                    <h1 class='font-serif font-bold text-4xl md:text-5xl lg:text-6xl text-center'>
                        Catechism of&nbsp;the Catholic&nbsp;Church
                    </h1>
                    <h2 class='italic text-xl md:text-2xl lg:text-3xl my-4'>Proof of Concept</h2>
                </div>

                <div class='max-w-xl md:max-w-2xl px-8'>
                    <div class='bg-red-900 w-full h-px mb-4'>&nbsp;</div>

                    <Title>What This Is</Title>
                    <Paragraph>
                        A step toward a better online version of the{' '}
                        <span class='italic'>Catechism of the Catholic Church</span>.
                    </Paragraph>

                    <Title>Why It Exists</Title>
                    <Paragraph>
                        To provide a more fitting digital home for one of the Church's great treasures.
                    </Paragraph>

                    <Title>Next Steps</Title>
                    <Paragraph>
                        Licensing permission needs to be obtained from the copyright holders (the United&nbsp;States
                        Conference of Catholic&nbsp;Bishops holds the copyright for the English translation of the{' '}
                        <span className='italic'>Catechism</span>).
                    </Paragraph>
                    <Paragraph>
                        Also, much development work remains.
                    </Paragraph>

                    <Title>Contact</Title>
                    <Paragraph>
                        If you would like more information, please email me, the sole developer, at{' '}
                        <a class='italic' href='mailto:joecode@tuta.io'>joecode@tuta.io</a>.
                    </Paragraph>
                </div>
            </body>
        </>
    );
}

function Title({ children }) {
    return <h3 class='font-serif font-bold italic text-xl mt-6 mb-4'>{children}</h3>;
}

function Content({ children }) {
    return <div class='px-4'>{children}</div>;
}

function Paragraph({ children }) {
    return <p class='px-4 mb-2'>{children}</p>;
}
