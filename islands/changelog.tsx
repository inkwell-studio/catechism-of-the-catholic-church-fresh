import { state } from '../state/state.ts';

type Commit = {
    hash: string;
    message: string;
};

type DayOfCommits = {
    date: Date;
    commits: Array<Commit>;
};

const commitLog: Array<DayOfCommits> = [
    {
        date: new Date(2023, 1, 14),
        commits: [
            { hash: '81149e5094203ca2427b28d9e1d1258bcceb3f0c', message: 'add update log', },
            { hash: '752e91674205f7a441b4a8043ad4cac2cd0a2c52', message: 'extract common code' },
            { hash: 'e89d792bdee6ab4acd77bbd104ce8de395fbe904', message: 'add 404 page' },
        ],
    },
    {
        date: new Date(2023, 1, 10),
        commits: [
            { hash: '4e5f4a61e67ae845d0cb645b28dc580cf57da47f', message: 'add complementary color' },
        ],
    },
];

export default function Changelog() {
    return (
        <div
            class={`${
                state.value.showChangelog ? 'flex' : 'hidden'
            } fixed inset-0 z-50 justify-center items-stretch sm:items-center`}
        >
            <div class='relative bg-tan-50 flex flex-col gap-8 items-start rounded-md shadow-2xl w-full sm:w-auto p-4 xs:p-6 sm:p-10'>
                <button onClick={close} class='absolute top-4 right-4'>Close</button>
                <strong class='text-xl font-bold'>Updates</strong>
                <ol class='space-y-6'>
                    {commitLog.map((commits) => DayOfCommitsElement(commits))}
                </ol>
                <a
                    class='hover:underline'
                    target='_blank'
                    href='https://github.com/inkwell-studio/catechism-of-the-catholic-church/commits/master'
                >
                    <strong class='font-bold italic'>See all updates</strong>
                </a>
            </div>
        </div>
    );
}

function DayOfCommitsElement(day: DayOfCommits) {
    return (
        <div>
            <strong className='font-bold'>{day.date.toLocaleDateString()}</strong>
            <ol class='list-disc list-inside font-sans'>
                {day.commits.map((c) => <li>{CommitElement(c)}</li>)}
            </ol>
        </div>
    );
}

function CommitElement(commit: Commit) {
    return (
        <a
            class='hover:underline'
            target='_blank'
            href={`https://github.com/inkwell-studio/catechism-of-the-catholic-church/commit/${commit.hash}`}
        >
            {commit.message}
        </a>
    );
}

function close(): void {
    state.value = {
        ...state.value,
        showChangelog: false,
    };
}
