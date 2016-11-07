// Language of the Banana Kingdom
(new PseudoLanguage("Mankiki"))
    .addNumbers(["ba", "na", "na", "ba", "na", "na", "ba", "na", "na", "ba"])
    .addLetters(["a"])
    .addShortWords(["ba", "na"])
    .addSyllabi(["ba", "na"])
    .addStaticWord(["banana"], "pneumoultramicroscopicossilicovulcanoconiotico")
    .getSyllableCustom = function () {
        if (this.currentTranslation === "" && this.chance(80)) {
            return "ba";
        } else if (this.currentTranslation === "ba" && this.chance(80)) {
            return "na";
        } else if (this.currentTranslation === "bana" && this.chance (80)) {
            return "na";
        } else if (this.currentTranslation === "banana" && this.chance(80)) {
            return " ";
        }
        return null;
    };