// A user-facing record of code changes

export type Changelog = Array<CodeChanges>;

export type CodeChanges = {
    date: Date;
    commits: Array<Commit>;
};

export type Commit = {
    hash: string;
    message: string;
};

export const changelog: Changelog = [
    {
        date: new Date(2023, 9, 7),
        commits: [
            {
                hash: '2e2def22b13a35df2114bf63b09747f8b1f0c833',
                message: 'add language selection page',
            },
        ],
    },
    {
        date: new Date(2023, 9, 6),
        commits: [
            {
                hash: '60d48bc31d818df537ddc3817d5ed1efd431a708',
                message: 'add ability to open and navigate by cross-references',
            },
        ],
    },
    {
        date: new Date(2023, 8, 12),
        commits: [
            {
                hash: 'c69dc73dd52419e11e2311e0f27d541c265b7626',
                message: 'add URL navigation by paragraph number',
            },
        ],
    },
    {
        date: new Date(2023, 8, 7),
        commits: [
            {
                hash: '29ad54072c0885fee592c5bd65568ec0b491ea76',
                message: 'add support for multiple languages',
            },
        ],
    },
    {
        date: new Date(2023, 7, 26),
        commits: [
            {
                hash: '4b6d2ddd673eea57dec1d3582c2fcf320b22bdde',
                message: 'finalize content-loading and Table of Contents generation algorithms',
            },
        ],
    },
    {
        date: new Date(2023, 6, 28),
        commits: [
            {
                hash: '3dc6356317b0f35c94611eaa39f8091ed122496d',
                message: 'add Table of Contents',
            },
        ],
    },
    {
        date: new Date(2023, 6, 24),
        commits: [
            {
                hash: '0e92881a9850c3116a98a97992d6f4df879eabe4',
                message: 'add ability to navigate to particular sections',
            },
        ],
    },
];

export function getLatestChanges(): CodeChanges {
    return changelog.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
}
