import { Head } from '$fresh/runtime.ts';

export default function Home() {
    return (
        <>
            <Head>
                <title>Catechism of the Catholic Church</title>
            </Head>
            <body class='flex flex-col items-center bg-tan-100'>
                <div class='bg-red-900 w-full h-8 opacity-70'>&nbsp;</div>

                <div class='h-[80vh] flex flex-col justify-center items-center px-8'>
                    <h1 class='font-serif font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center'>
                        <span class='inline-block'>Catechism of&nbsp;the</span>
                        <br />
                        <span class='inline-block mt-1 md:mt-2 lg:mt-3'>Catholic Church</span>
                    </h1>
                    <h2 class='italic text-center text-lg sm:text-xl md:text-2xl lg:text-3xl my-8'>
                        A Better Online Version — Proof&nbsp;of&nbsp;Concept
                    </h2>
                </div>

                <div class='max-w-xl md:max-w-2xl px-6 sm:px-8'>
                    <div class='bg-red-900 h-px -mb-2 w-screen hidden xs:block relative xs:static xs:w-full xs:left-0 xs:right-0 lg:relative lg:-left-8 lg:-right-8 lg:w-[110%]'>
                        &nbsp;
                    </div>
                    <Title highlight={true}>What This Is</Title>
                    <Paragraph>
                        A proof-of-concept for a better online version of the{' '}
                        <span class='italic'>Catechism of the Catholic&nbsp;Church</span>.
                    </Paragraph>

                    <Title>Why It Exists</Title>
                    <Paragraph>
                        To provide a more fitting digital home for one of the Church's great treasures, and to
                        demonstrate how the <span class='italic'>Catechism</span>{' '}
                        can be better presented with modern web features:
                    </Paragraph>

                    <Title>What Already Exists</Title>
                    <Paragraph>
                        Currently, there are six websites with the English translation of the{' '}
                        <span class='italic'>Catechism</span>. All of these lack some, if not all, of the features
                        listed above.
                        <ol class='list-disc ml-6 space-y-0.5'>
                            <li>
                                <a href='http://www.vatican.va/archive/ENG0015/_INDEX.HTM'>Vatican archive</a>
                            </li>
                            <li>
                                <a href='https://www.usccb.org/beliefs-and-teachings/what-we-believe/catechism/catechism-of-the-catholic-church'>
                                    United States Conference of Catholic Bishops
                                </a>
                            </li>
                            <li>
                                <a href='https://scborromeo2.org/catechism-of-the-catholic-church'>
                                    St. Charles Borromeo Catholic Church of Picayune, Mississippi
                                </a>
                            </li>
                            <li>
                                <a href='http://cccref.com/'>A wrapper around the St. Charles Borromeo website</a>
                            </li>
                            <li>
                                <a href='https://www.catechismonline.com/home'>www.catechismonline.com</a>
                            </li>
                            <li>
                                <a href='https://www.catholicculture.org/culture/library/catechism/index.cfm'>
                                    www.catholicculture.org
                                </a>
                            </li>
                        </ol>
                    </Paragraph>

                    <Title>Why not improve an existing site?</Title>
                    <Paragraph>
                        The existing sites do not appear to have the technical foundation for providing all the features
                        this site is capable of:
                        <ul class='list-disc mb-4 ml-6 space-y-0.5'>
                            <li>responsive design</li>
                            <li>a single site for all translations</li>
                            <li>URL navigation by paragraph number, chapter number, etc.</li>
                            <li>robust and intuitive search</li>
                            <li>
                                intuitive and traceable navigation by paragraph numbers, cross references, and topics
                            </li>
                            <li>
                                API for human and machine querying (to help make projects like{' '}
                                <a href='https://github.com/konohitowa/catebot' class='italic'>CateBot</a> possible)
                            </li>
                        </ul>
                    </Paragraph>
                    <Paragraph>
                        This new site, with its architecture, provides opportunity for all these.
                    </Paragraph>

                    <Title highlight={true}>What Comes Next</Title>
                    <Paragraph>
                        Much development work remains.
                    </Paragraph>
                    <Paragraph>
                        Licensing permission needs to be obtained before the actual text of the{' '}
                        <span class='italic'>Catechism</span>{' '}
                        can be used here (the United&nbsp;States Conference of Catholic&nbsp;Bishops holds the copyright
                        for the English translation).
                    </Paragraph>

                    <Title>Learning More</Title>
                    <Paragraph>
                        If you would like to see the code or contact&nbsp;the&nbsp;developer, please&nbsp;do&nbsp;so:
                    </Paragraph>
                    <div className='my-4 flex justify-center'>
                        <ButtonLink
                            newTab={true}
                            href='https://github.com/inkwell-studio/catechism-of-the-catholic-church'
                            text='source code'
                        >
                        </ButtonLink>
                        <ButtonLink newTab='true' href='mailto:joecode@tuta.io' text='joecode@tuta.io'></ButtonLink>
                    </div>

                    <Title highlight={true}>View the Demo</Title>
                    <Paragraph>
                        <span class='italic'>
                            Please check back later today, February 7, 2023.
                        </span>
                    </Paragraph>
                    {
                        /*
                    <Paragraph>
                        The sample text is from Matthew's Gospel, and bold and italic text formatting is added randomly.<br/>
                    </Paragraph>
                    <Paragraph>
                        Many features are not yet implemented.
                    </Paragraph>
                    <Paragraph>
                        <div className='mt-4 flex justify-center'>
                            <ButtonLink newTab={false} classes='w-full  text-lg' href='/read' text='Enter'></ButtonLink>
                        </div>
                    </Paragraph>
                    */
                    }
                </div>
                <div class='bg-red-900 w-full h-6 md:h-8 opacity-70 mt-8 md:mt-16 md:opacity-80'>&nbsp;</div>
            </body>
        </>
    );
}

function Title({ children, highlight }) {
    return (
        <span class='relative'>
            {highlight ? <span class='block absolute -inset-1 rounded-sm bg-tan-50 opacity-30'></span> : {}}
            <h3 class={(highlight ? 'mt-8' : 'mt-6') + ' relative font-serif font-bold italic text-xl p-1 mb-4'}>
                {children}
            </h3>
        </span>
    );
}

function Paragraph({ children }) {
    return <p class='px-4 mb-2'>{children}</p>;
}

function ButtonLink({ href, text, newTab, classes }) {
    const target = newTab ? '_blank' : '';

    return (
        <a
            href={href}
            target={target}
            class={classes +
                ' inline-block font-sans text-center border border-2 rounded bg-tan-50/20 hover:bg-tan-50 transition-bg p-3 mt-2 mr-3'}
        >
            {text}
        </a>
    );
}
