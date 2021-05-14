const sut = require("./index");
const faker = require("faker");
/*test('sut transforms "hello  world" to "hello world"', () => {
    const actual = sut("hello  world");
    expect(actual).toBe("hello world");
});

test('sut transforms "hello    world" to "hello world"', () => {
    const actual = sut("hello    world");
    expect(actual).toBe("hello world");
})

test('sut transforms "hello       world" to "hello world"', () => {
    const actual = sut("hello       world");
    expect(actual).toBe("hello world");
})*/

// 반복은 줄였으나 중간에 실패하면 나머지 테스트는 진행이 안됨
/*test('sut correctly works', () => {
    for (const source of ['hello  world', 'hello   world', 'hello    world', 'hello     world']) {
        const actual = sut(source);
        expect(actual).toBe("hello world");
    }
});*/

// 반복 코드를 줄이면서도 전체 피드백을 더 명확하게 받을 수 있는 parameter를 이용하는 테스트
// jest에서 제공하는 each 메서드를 사용
test.each`
    source | expected
    ${"hello  world"} | ${"hello world"}
    ${"hello   world"} | ${"hello world"}
    ${"hello    world"} | ${"hello world"}
    ${"hello     world"} | ${"hello world"}
`('sut transforms "${source}" to "$expected"', ({ source, expected }) => {
    const actual = sut(source);
    expect(actual).toBe(expected);
});

test.each`
    source | expected
    ${"hello\t world"} | ${"hello world"}
    ${"hello \tworld"} | ${"hello world"}
`('sut transforms "${source}" that contains tab character to "${expected}"', ({ source, expected }) => {
    const actual = sut(source);
    expect(actual).toBe(expected);
})

test.each`
    source | bannedWords | expected
    ${"hello mockist"} | ${["mockist", "purist"]} | ${"hello *******"}
    ${"hello purist"} | ${["mockist", "purist"]} | ${"hello ******"}
`('sut transforms "${source}" to "${expected}"',
    ({ source, bannedWords, expected }) => {
        const actual = sut(source, { bannedWords });
        expect(actual).toBe(expected);
});

describe('given banned word', () => {
    const bannedWord = faker.lorem.word();
    const source = "hello " + bannedWord;
    const expected = "hello " + "*".repeat(bannedWord.length);

    test(`${bannedWord} when invoke sut then it returns ${expected}`, () => {
        const actual = sut(source, { bannedWords: [bannedWord] });
        expect(actual).toBe(expected);
    })
});
// 테스트 주도 개발을 위한 테스트 추가
// 실패하면, 통과하기 위한 가장 빠르고 단순한 방법의 운영코드 개선을 추가한다.
// 실패(red) - 통과(green) - 리팩터링(blue)
test.each`
    source | expected
    ${" hello world"} | ${"hello world"}
`('sut correctly trims whitespace',({ source, expected }) => {
    const actual = sut(source);
    expect(actual).toBe(expected);
});
