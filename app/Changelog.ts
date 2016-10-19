// This is a typescript file, but it's not to be written as typescript
// Only Changelog class usage is allowed in this file.
var change;

change = new Changelog(0, 8, 0);
change.addMessage("Implemented most of the application before Changelog implemented.", "en");
change.addMessage("Maior parte do aplicativo implementado antes da inclusão de Log de Mudanças.", "pt");

change = new Changelog(0, 9, 0);
change.addMessage("Implemented changelog.", "en");
change.addMessage("Log de Mudanças implementado.", "pt");

change = new Changelog(0, 10, 0);
change.addMessage("/log slash command added to chat.", "en");
change.addMessage("Comando /log adicionado ao chat.", "pt");

delete (change);

Changelog.finished();