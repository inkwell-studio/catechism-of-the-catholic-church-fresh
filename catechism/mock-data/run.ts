import { buildMockData } from './build/build.ts';
import { writeSourceCode } from './write/write.ts';

const catechism = buildMockData();
writeSourceCode(catechism);
