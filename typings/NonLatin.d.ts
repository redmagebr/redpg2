interface Latinisable extends String {
    latinise() : string;
    isLatin() : boolean;
}

declare function saveAs(blob : Blob, filename : string): void;