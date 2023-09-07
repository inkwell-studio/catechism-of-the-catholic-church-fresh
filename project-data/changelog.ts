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
    {
        date: new Date(2023, 1, 14),
        commits: [
            { hash: '81149e5094203ca2427b28d9e1d1258bcceb3f0c', message: 'add update log' },
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

export function getLatestChanges(): CodeChanges {
    return changelog.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
}
