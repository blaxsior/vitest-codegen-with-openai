export function filterStringsByRegex(strings: string[], filters: string[]): string[] {
    if(filters.length <= 0) return strings
    // 정규식 배열을 실제 RegExp 객체로 변환
    const regexes = filters.map(pattern => new RegExp(pattern));

    // 각 문자열을 모든 정규식과 비교하여 전부 매칭되어야 통과
    return strings.filter(str => regexes.every(regex => regex.test(str)));
}
