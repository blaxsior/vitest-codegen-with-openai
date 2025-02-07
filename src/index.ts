#!/usr/bin/env node

import { Command, Option } from 'commander';
import { getFilenamesFromRoot } from './util/file';
import { filterStringsByRegex } from './util/filter';
import { MakeTestCodeOptions, makeTestCodes } from './code_gen';
import path from 'path';

const onTestExistOptions: MakeTestCodeOptions['onTestExistPolicy'][] = ['override', 'append', 'pass', 'error'];

const options = new Command();
options.option(
    '--base <base_root>',
    'set base root',
    process.cwd()
);
options.addOption(
    new Option(
        '--on-test-exist <option>',
        'test file creation policy when test file already exist',
    ).default('error')
        .choices(onTestExistOptions)
);
options.option(
    '--regex <regex...>',
    'regex for filter path',
    (value, prev: string[]) => {
        if (value) return prev.concat(value)
        return prev
    },
    []
);

options.parse();

async function main() {
    // console.log(options.opts());
    // 기본 경로 얻기
    let base_root = path.resolve(options.opts().base);

    const test_exist_policy = options.opts().onTestExist as MakeTestCodeOptions['onTestExistPolicy'];
    const regex = options.opts()['regex'];

    // node_modules / spec 파일 제외
    const defaultRegex = ['\.ts$', '^(?!.*node_modules).*$', '^(?!.*\.(spec|test)\.).*$'];

    const filenames = await getFilenamesFromRoot(base_root);
    const target_names = filterStringsByRegex(filenames, [...defaultRegex, ...regex]);

    await makeTestCodes(target_names, { onTestExistPolicy: test_exist_policy });
}

main();