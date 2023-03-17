import {Format} from '../wasm';
import {dump, load} from 'js-yaml';


export const fmtCue = (lineage: string): string =>
    Format(lineage);

export const fmtJson = (input: string): string =>
    JSON.stringify(JSON.parse(input), null, "\t");

export const fmtYaml = (input: string): string =>
    dump(load(input), {sortKeys: true, indent: 4})
