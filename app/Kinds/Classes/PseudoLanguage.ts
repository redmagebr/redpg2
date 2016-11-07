class PseudoWord {
    private originalWord : string;
    private translatedWord : String = null;

    constructor (word : string) {
        this.originalWord = word;
    }

    public addTranslation (word : string) {
        this.translatedWord = word;
    }

    public getOriginal () {
        return this.originalWord;
    }

    public getTranslation () {
        return this.translatedWord === null ? this.originalWord : this.translatedWord;
    }
}

class PseudoLanguage {
    public singleLetters : Array<string> = [];
    public shortWords : Array<string> = [];
    public syllabi : Array<string> = [];
    public numbers : Array<string> = [];
    public staticWords : { [word : string] : string} = {};

    public words : Array<PseudoWord> = [];
    public index : number;

    public randomizeNumbers : boolean = false;
    public lowerCaseOnly : boolean = false;
    public allowPoints : boolean = true;
    public maxLengthDifference : number = 1;

    public rng : Function;

    protected static languages : { [id : string] : PseudoLanguage} = {};

    public currentWord : string;
    public currentTranslation : string;

    public static getLanguageNames () : Array<string> {
        var names = [];
        for (var id in PseudoLanguage.languages) {
            names.push(id);
        }
        names.sort();
        return names;
    }

    public static getLanguage (id : string) : PseudoLanguage {
        if (PseudoLanguage.languages[id] !== undefined) {
            return PseudoLanguage.languages[id];
        }
        return null;
    }

    constructor (id : string) {
        PseudoLanguage.languages[id] = this;
    }

    public addStaticWord (words : Array<string>, translation : string) {
        for (var i = 0; i < words.length; i++) {
            this.staticWords[words[i]] = translation;
        }
        return this;
    }

    public addLetters(as : Array<string>) {
        this.singleLetters = as;
        return this;
    }

    public addShortWords(as : Array<string>) {
        this.shortWords = as;
        return this;
    }

    public addNumbers(as : Array<string>) {
        this.numbers = as;
        return this;
    }

    public setRandomizeNumbers (rn : boolean) {
        this.randomizeNumbers = rn;
        return this;
    }

    public setLowerCase (lc : boolean) {
        this.lowerCaseOnly = lc;
        return this;
    }

    public setAllowPoints (ap : boolean) {
        this.allowPoints = ap;
        return this;
    }

    public addSyllabi (syllabi : Array<string>) {
        this.syllabi = syllabi;
        return this;
    }

    public getLastWord () {
        return this.words[this.index - 1];
    }

    public getCurrentWord () {
        return this.words[this.index];
    }

    public getNextWord () {
        return this.words[this.index + 1];
    }

    public lastSyllable = "";
    public usedSyllable = [];

    public getSyllableCustom () : string {
        return null;
    }

    public getSyllable () {
        var syllable : string = this.getSyllableCustom();
        if (syllable !== null) {
            this.lastSyllable = syllable;
            this.usedSyllable.push(syllable);
            return syllable;
        }
        syllable = this.syllabi[Math.floor(this.rng() * this.syllabi.length)];
        while (
               ((this.lastSyllable === syllable && this.syllabi.length > 1 && (this.rng() * 100) > 10))
            ||
               ((this.usedSyllable.indexOf(syllable) !== -1 && (this.rng() * 100) > 50))
            ){
            syllable = this.syllabi[Math.floor(this.rng() * this.syllabi.length)];
        }
        this.lastSyllable = syllable;
        if (this.usedSyllable.indexOf(syllable) === -1) {
            this.usedSyllable.push(syllable);
        }
        return syllable;
    }

    public chance (chance : number) {
        return (this.rng() * 100) > (100 - chance);
    }

    public increaseCurrentTranslation () {
        this.currentTranslation += this.getSyllable();
    }

    public isAcceptable () {
        if (this.currentTranslation.length === this.currentWord.length && (this.rng() * 100) > 10) {
            return true;
        }

        if (Math.abs(this.currentTranslation.length - this.currentWord.length) > this.maxLengthDifference) {
            return false;
        }

        if (this.currentTranslation.length < this.currentWord.length && (this.rng() * 100) > 10) {
            return false;
        }

        return true;
    }

    public getSingleLetter() {
        return this.singleLetters[Math.floor(this.rng() * this.singleLetters.length)];
    }

    public getShortWord () {
        return this.shortWords[Math.floor(this.rng() * this.shortWords.length)];
    }

    public translateWord (pseudo : PseudoWord) {
        this.currentTranslation = "";
        var word = pseudo.getOriginal();

        if (word === "") {
            pseudo.addTranslation(this.currentTranslation);
            return;
        }

        var exclamation = word.indexOf('!') !== -1;
        var interrobang = word.indexOf('?') !== -1;
        var finish = word.indexOf('.') !== -1;
        var trespontos = word.indexOf('...') !== -1;
        var doispontos = word.indexOf(':') !== -1;
        var virgula = word.indexOf(',') !== -1;
        word = word.replace(/\!/g, '');
        word = word.replace(/\?/g, '');
        word = word.replace(/\./g, '');
        word = word.replace(/\:/g, '');
        word = word.replace(/\,/g, '');

        this.currentWord = word;
        this.lastSyllable = "";
        this.usedSyllable = [];

        if (!isNaN(parseInt(this.currentWord)) && this.numbers.length > 0) {
            for (var i = 0; i < this.currentWord.length; i++) {
                if (!this.randomizeNumbers) {
                    this.currentTranslation += this.numbers[parseInt(this.currentWord.charAt(i))];
                } else {
                    this.currentTranslation += this.numbers[Math.floor(this.rng() * this.numbers.length)];
                }
            }
        } else {
            var lowerWord = (<Latinisable> <String> this.currentWord).latinise().toLowerCase();
            this.rng = new Math['seedrandom'](lowerWord);
            if (this.staticWords[lowerWord] !== undefined) {
                this.currentTranslation = this.staticWords[lowerWord];
            } else if (this.currentWord.length === 1 && this.singleLetters.length > 0) {
                this.currentTranslation = this.getSingleLetter();
            } else if (this.currentWord.length <= 3 && this.shortWords.length > 0) {
                this.currentTranslation = this.getShortWord();
            } else {
                while (!this.isAcceptable()) {
                    if (this.currentTranslation.length > this.currentWord.length) {
                        this.currentTranslation = "";
                    }
                    this.increaseCurrentTranslation();
                }
            }
        }

        if (this.allowPoints) {
            this.currentTranslation +=
                (virgula ? ',' : '') +
                (doispontos ? ':' : '') +
                (exclamation ? '!' : '') +
                (interrobang ? '?' : '') +
                (finish ? '.' : '') +
                (trespontos ? '..' : '');
        }

        if (!this.lowerCaseOnly) {
            var corrected = "";
            for (var i = 0; i < this.currentTranslation.length; i++) {
                var character;
                if (i > this.currentWord.length -1) {
                    character = this.currentWord[this.currentWord.length - 1];
                } else {
                    character = this.currentWord[i];
                }
                if (character !== character.toLowerCase()) {
                    corrected += this.currentTranslation[i].toUpperCase();
                } else {
                    corrected += this.currentTranslation[i];
                }
            }
            this.currentTranslation = corrected;
        }

        pseudo.addTranslation(this.currentTranslation);
    }

    public translate (phrase : string) {
        var words = phrase.split(" ");

        this.words = [];
        for (var i = 0; i < words.length; i++) {
            this.words.push(new PseudoWord(words[i]));
        }

        for (var i = 0; i < this.words.length; i++) {
            this.index = i;
            this.translateWord(this.words[i]);
        }

        var translatedWords = [];
        for (var i = 0; i < this.words.length; i++) {
            translatedWords.push(this.words[i].getTranslation());
        }

        return translatedWords.join(" ");
    }
}