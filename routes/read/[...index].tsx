import { HandlerContext, PageProps } from '$fresh/server.ts';

import { ActionBar } from '../../components/action-bar.tsx';
import { ContentContainer } from '../../components/content-container.tsx';
import { TableOfContents } from '../../components/table-of-contents.tsx';

import { Element, getElementAndPathID } from '../../utils/element.ts';

export function handler(request: Request, context: HandlerContext) {
    const contentPath = context.params.index;

    const elementAndPathID = getElementAndPathID(contentPath);
    if (elementAndPathID) {
        return context.render({
            element: elementAndPathID.element,
            pathID: elementAndPathID.pathID,
        });
    } else {
        return context.renderNotFound();
    }
}

export default function Home(props: PageProps) {
    const { element, pathID } = props.data;

    let mainElement = <></>;

    if (Element.TABLE_OF_CONTENTS === element) {
        mainElement = <TableOfContents></TableOfContents>;
    } else if (Element.CONTENT === element) {
        mainElement = <ContentContainer pathID={pathID}></ContentContainer>;
    }

    return (
        <div class='flex flex-col'>
            {mainElement}
            {
                /*
            <div>
                <ActionBar></ActionBar>
            </div>
            */
            }
        </div>
    );
}
