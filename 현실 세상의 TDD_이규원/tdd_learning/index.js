function refineText(s) {
    return s.replace("   ", " ")
        .replace("\t", " ")
        .replace("  ", " ")
        .replace("  ", " ")
        .replace("  ", " ")
        .replace("\t ", " ")
        .replace("mockist", "*******")
        .replace("purist", "******");
}

module.exports = refineText;
