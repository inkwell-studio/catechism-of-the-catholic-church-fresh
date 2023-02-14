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
