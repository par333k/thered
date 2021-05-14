/*function refineText(s, options) {
      s = s.replace("   ", " ")
        .replace("\t", " ")
        .replace("  ", " ")
        .replace("  ", " ")
        .replace("  ", " ")
        .replace("\t ", " ")
        .replace("mockist", "*******")
        .replace("purist", "******");
    if (options) {
        for (const bannedWord of options.bannedWords) {
            s = s.replace(bannedWord, "*".repeat(bannedWord.length));
        }
    }

    return s;
}*/

// 위 운영 코드를 리팩토링 해보자
// function refineText(source, options) {
//     return [normalizeWhiteSpaces, compactWhiteSpaces, maskBannedWords].reduce(
//         (value, filter) => filter(value, options), source
//     );
// }
//
// function maskBannedWords(source, options) {
//     return options ? options.bannedWords.reduce(maskBannedWord, source) : source;
// }
//
//
// function maskBannedWord(source, bannedWord) {
//     const mask = "*".repeat(bannedWord.length);
//     return source.replace(bannedWord, mask);
// }
//
// function normalizeWhiteSpaces(source) {
//     return source.replace("\t", " ");
// }
//
// function compactWhiteSpaces(source) {
//     return source.indexOf("  ") < 0
//         ? source
//         : compactWhiteSpaces(source.replace("  ", " "));
// }


// 위 코드들을 테스트 주도 개발 방식으로 변경해보자.
// 절삭 기능을 추가해보자 - 문자열 앞뒤의 공백을 제거하는 기능
function refineText(source, options) {
    // 테스트 주도 개발을 위한 가장 빠르고 단순한 개선 추가
    // source = source.trim();
    return [
        normalizeWhiteSpaces,
        compactWhiteSpaces,
        maskBannedWords,
    //    x => x.trim() // 1차 리팩터링
        trimWhitespaces,
    ].reduce(
        (value, filter) => filter(value, options), source
    );
}

// 2차 리팩토링 - 코드의 분리를 통해 느슨한 결합도, 가독성, 재사용성을 달성하면서도
// 필요한 요구사항을 충족하는 기능을 유지할 수 있었다.
function trimWhitespaces(value) {
    return value.trim();
}

function maskBannedWords(source, options) {
    return options ? options.bannedWords.reduce(maskBannedWord, source) : source;
}


function maskBannedWord(source, bannedWord) {
    const mask = "*".repeat(bannedWord.length);
    return source.replace(bannedWord, mask);
}

function normalizeWhiteSpaces(source) {
    return source.replace("\t", " ");
}

function compactWhiteSpaces(source) {
    return source.indexOf("  ") < 0
        ? source
        : compactWhiteSpaces(source.replace("  ", " "));
}
module.exports = refineText;
