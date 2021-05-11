const sut = require("./index");

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
