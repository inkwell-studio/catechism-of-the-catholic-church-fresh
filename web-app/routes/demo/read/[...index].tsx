import { Head } from '$fresh/runtime.ts';

import Content from '../../../islands/content.tsx';
import { ActionBar } from '../../../components/action-bar.tsx';

export default function Home() {
    return (
        <>
            <Head>
                <title>Catechism of the Catholic Church</title>
            </Head>
            <div class='h-screen flex flex-col'>
                <div class='overflow-y-scroll flex justify-center bg-tan-100'>
                    <div class='relative max-w-xl h-[min-content] pl-6 pr-8 bg-tan-50'>
                        <Content></Content>
                    </div>
                </div>
                <div>
                    <ActionBar></ActionBar>
                </div>
            </div>
        </>
    );
}
