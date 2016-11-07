// Ancient
(new PseudoLanguage("Binary"))
    .addSyllabi(['.','-', '!', "+", "#", "|", "\\", "/", "<", ">", "$", "%", ".", "-", ".", "-", ".", "-", ".", "-", "¢", "%", "@", "?", ":", ";"])
    .addNumbers(["0", "1", "00", "01", "10", "11", "000", "001", "010", "011", "100", "101", "110", "111"])
    .setAllowPoints(false)
    .setRandomizeNumbers(true)
    .setLowerCase(true);