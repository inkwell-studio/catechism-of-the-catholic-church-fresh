import { Head } from '$fresh/runtime.ts';

import Content from '../../islands/content.tsx';
import { ActionBar } from '../../components/action-bar.tsx';

export default function Home() {
    return (
        <>
            <Head>
                <title>Catechism of the Catholic Church</title>
            </Head>
            <div class='h-screen flex flex-col bg-tan-100'>
                <div class='overflow-y-scroll flex justify-center'>
                    <div class='
                        relative bg-tan-50 text-justify h-[min-content]
                        rounded-md shadow md:shadow-2xl
                        w-full md:max-w-2xl lg:max-w-3xl
                        px-6 xs:px-10 sm:px-20 lg:px-32
                        pb-4 pt-4 sm:pt-8 md:pt-14 md:my-8 lg:pt-16
                    '>
                        <Content></Content>
                    </div>
                </div>
                {
                    /*
                <div>
                    <ActionBar></ActionBar>
                </div>
                */
                }
            </div>
        </>
    );
}
