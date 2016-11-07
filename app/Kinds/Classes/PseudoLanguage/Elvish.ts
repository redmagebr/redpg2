(new PseudoLanguage("Elvish"))
    .addStaticWord(["elfos","elfas","elves"], "el'ar")
    .addStaticWord(["passaro","ave","passarinho","bird"], "simuh")
    .addStaticWord(["ha","hah","he","heh","hehe","haha","heheh","hahah","hehehe","hahaha"], "hehe")
    .addStaticWord(["alegria","felicidade","joy","happiness"], "luria")
    .addStaticWord(["rapido","veloz","velocidade","fast","speedy","speed"], "lerast")
    .addStaticWord(["lama","barro","mud","clay"], "vehal")
    .addStaticWord(["curar","sarar","heal"], "fahin")
    .addStaticWord(["bruxa","feiticeira","maga","witch","wizard","mage"], "amuhn")
    .addStaticWord(["esperanca","hope"], "elain")
    .addStaticWord(["falso","fake","falsos","fakes"], "el'zel")
    .addStaticWord(["elf","elfo","elfa"], "el'um")
    .addStaticWord(["azul","azulado"], "luin")
    .addStaticWord(["inimigo","inimigos","adversário","adversários","adversario","adversarios"], "zallon")
    .addStaticWord(["amigo","compadre","camarada","amigos","camaradas","compadres","aliado","aliados"], "mellon")
    .addStaticWord(['alto', 'grande'], 'tar')
    .addStaticWord(["verao","summer"], "laer")
    .addStaticWord(["coragem","confianca","bravery"], "thalias")
    .addStaticWord(["letra","letras","letter","letters"], "tenwar")
    .addStaticWord(["calor","quente","fogo","chama","flamejante","chamas","fogos"], "uloloki")
    .addNumbers(['o', 'u', 'uli', 'lia', 'sa', 'mi', 'ola', 'su', 'kaala', 'thus'])
    .addLetters(['a', 'i', 'e'])
    .addShortWords(['ae', 'ea', 'lae', 'lea', 'mia', 'thal', 'maae', 'leah', 'tea', 'ma', 'da', 'le', 'li', 'ta', 'te', 'ia', 'io'])
    .addSyllabi(['el', 'shal', 'shel', 'ae', 'ea', 'lae', 'lea', 'mia', 'thal', 'maae', 'leah', 'tea', 'ma', 'da', 'le', 'li', 'ta', 'te', 'ia', 'io', 'a', 'i', 'e'])
    .addStaticWord(['calor','quente','fogo','chama','flamejante','chamas','fogos'], "uloloki")
    .getSyllableCustom = function () {
    if (this.currentTranslation.length < 1 || this.currentWord.length < 4 || (this.currentWord.length - this.currentTranslation.length) < 3) {
        return null;
    }
    if (
        (this.currentTranslation.charAt(this.currentTranslation.length - 1) === "l"
        || this.currentTranslation.charAt(this.currentTranslation.length - 1) === "h")
        && ((this.usedSyllable.indexOf("'") === -1 && this.chance(95)) || this.chance(5))) {
        return "'";
    }
    if (
        (this.currentTranslation.charAt(this.currentTranslation.length - 1) === "e"
        || this.currentTranslation.charAt(this.currentTranslation.length - 1) === "a")
        && ((this.usedSyllable.indexOf("'") === -1 && this.chance(40)) || this.chance(20))) {
        return "'";
    }
    if (this.usedSyllable.indexOf("'") === -1 && this.chance(15)) {
        return "'";
    }
    return null;
};