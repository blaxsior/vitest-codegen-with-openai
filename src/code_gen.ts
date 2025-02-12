import { OpenAI } from 'openai';
import { Project } from 'ts-morph';
import { readFile, access, constants, writeFile } from 'fs/promises'
import 'dotenv/config';
import { getTestFileName } from './util/path';

export type MakeTestCodeOptions = {
    /**
     * 기존 테스트 파일이 존재하면 어떻게 할지 정책
     */
    onTestExistPolicy: 'override' | 'append' | 'pass' | 'error';
}

/**
 * 
 * @param filenames 테스트 파일을 만들 파일 이름들
 */
export async function makeTestCodes(
    filenames: string[],
    options: MakeTestCodeOptions = {
        onTestExistPolicy: 'pass'
    }) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const testPolicy = options.onTestExistPolicy;


    for (const filename of filenames) {
        const test_filename = getTestFileName(filename);
        console.log(test_filename);

        if (testPolicy === 'pass') {
            try {
                await access(test_filename, constants.W_OK);
                console.log('file already exist at ', test_filename, 'pass');
                continue;
            } catch (e) {}
        } else if (testPolicy === 'error') {
            try {
                await access(test_filename, constants.W_OK);
                console.error('file already exist at ', test_filename);
                continue;
            } catch (e) {}
        }
        const functionInfos = await getFunctionInfo(filename);
        if (functionInfos.length <= 0) continue; // 함수 없으면 무시

        const result = await openai.chat.completions.create({
            model: 'gpt-4o-mini',

            messages: [
                {
                    role: 'developer', content: [
                        {
                            type: "text", text: `
User inputs a function or method def, and you generate corresponding tests. 
Original and test files in the same folder. 
No implementation, just code, no code block.
first line is at least import { describe, it, expect, vi, Mock } from 'vitest';
When mocking, use type casting (item as Mock) from vitest (not vi.Mock)
`
                        }
                    ]
                },
                {
                    role: 'user', content: [
                        {
                            type: 'text', text: JSON.stringify({filename, fn: functionInfos})
                        }
                    ]
                }
            ]
        });
        const data = result.choices[0].message.content;
        if (!data) continue;

        if (testPolicy === 'append') await writeFile(test_filename, data, {flag: 'a'});
        else await writeFile(test_filename, data, {flag: 'w'});
    }
}

async function getFunctionInfo(filename: string) {
    const buffer = await readFile(filename);
    const data = buffer.toString('utf-8');

    // const project = new Project();
    // const sourceFile = project.createSourceFile("noexist.ts", data);

    // // 아이템 정보 추출
    // const items: any[] = sourceFile.getFunctions().map(fn => ({
    //     name: fn.getName(),
    //     signature: fn.getSignature().getDeclaration().getText(true)
    // }));

    // // 클래스 정보 추출
    // const classes = sourceFile.getClasses().map(cls => ({
    //     name: cls.getName(),
    //     methods: cls.getMethods().map(method => ({
    //         name: method.getName(),
    //         comment: method.getJsDocs().map(doc => doc.getText()).join("\n"),
    //         signature: method.getSignature().getDeclaration().getText(),
    //     }))
    // }));

    // return items.concat(classes);

    return data;
}
