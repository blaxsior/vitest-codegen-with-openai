# auto gen test using openai api

OpenAI API를 이용해 vitest 테스트를 자동으로 생성하는 CLI 도구입니다. 

기본 값은 CLI가 실행된 폴더를 기준으로  일반 .ts 파일(테스트, node_modules 제외) 에 대한 테스트 파일을 소스 파일과 동일한 위치에 생성합니다. 생성에는 openai api가 사용됩니다.

## 사용법
1. npm install로 의존성 설치
2. open api의 key를 환경 변수 OPENAI_API_KEY로 등록 (.env도 가능)
3. npm run build; npm i -g로 글로벌 환경에서 사용할 수 있게 설정
4. test-gen 명령을 통해 테스트 자동 생성


## Options
- --base &lt;base_root&gt;: 소스 코드를 탐색하는 기본 경로
- --on-test-exist &lt;option&gt;: 이미 테스트 코드 존재 시 전략 
    - override: 기존 내용을 덮어쓴다.
    - append: 기존 내용에 덧붙인다.
    - pass, error: 넘어간다.
- --regex &lt;regex...&gt;: 소스코드 필터링에 사용되는 regex 목록