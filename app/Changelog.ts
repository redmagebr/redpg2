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

change = new Changelog(0, 11, 0);
change.addMessage("Sheet permissions implemented.", "en");
change.addMessage("Implementadas permissões para fichas.", "pt");

change = new Changelog(0, 12, 0);
change.addMessage("Style editor implemented.", "en");
change.addMessage("Editor de estilos implementado.", "pt");

change = new Changelog(0, 13, 0);
change.addMessage("Sheet creation implemented.", "en");
change.addMessage("Opening sheets implemented.", "en");
change.addMessage("Cutscene mode implemented in chats.", "en");
change.addMessage("Criação de fichas implementada.", "pt");
change.addMessage("Abrir fichas implementado.", "pt");
change.addMessage("Modo Cutscene implementado em chats.", "pt");

change = new Changelog(0, 14, 0);
change.addMessage("Improvements to custom types in custom styles.", "en");
change.addMessage("Fix: sharing Sound Effects correctly shares as a Sound Effect, rather than a BGM.", "en");
change.addMessage("Fix: Scouring SheetLists for values.", "en");
change.addMessage("Exporting sheets as JSON always exports current state.", "en");
change.addMessage("Reduce unnecessary Math field change trigger.", "en");
change.addMessage("Adds more SheetVariables and SheetButtons.", "en");
change.addMessage("Melhoras para tipos personalizados em estilos personalizados.", "pt");
change.addMessage("Fix: compartilhar Efeitos Sonoros corretamente compartilha como Efeito Sonoro e não BGM.", "pt");
change.addMessage("Fix: Buscar valores dentro de SheetLists.", "pt");
change.addMessage("Exportar fichas como JSON sempre exporta o estado atual da ficha.", "pt");
change.addMessage("Reduz atualizações desnecessárias causadas por campos Math.", "pt");
change.addMessage("Adiciona mais SheetVariables e SheetButtons.", "pt");

change = new Changelog(0, 15, 0);
change.addMessage("Create Account.", "en");
change.addMessage("Login error messages.", "en");
change.addMessage("Criação de contas.", "pt");
change.addMessage("Mensagens de erro para login.", "pt");

change = new Changelog(0, 16, 0);
change.addMessage("Language Tracker implemented.", "en");
change.addMessage("Multiple Languages added.", "en");
change.addMessage("Gerenciador de Línguas implementado.", "pt");
change.addMessage("Múltiplas línguas adicionadas.", "pt");

change = new Changelog(0, 16, 1);
change.addMessage("Default chat font changed to Alegreya. Caudex still available in options.", "en");
change.addMessage("Fonte padrão do chat alterada para Alegreya. Caudex ainda disponível em opções.", "pt");

change = new Changelog(0, 17, 0);
change.addMessage("It is now possible to force sounds into a folder.", "en");
change.addMessage("Opção para forçar sons a uma determinada pasta criada.", "pt");

change = new Changelog(0, 18, 0);
change.addMessage("Chat font defaults to Caudex again, it was chosen for a reason.", "en");
change.addMessage("Fonte do chat padrão retornada para Caudex. Alegreya ainda pode ser utilizada em opções.", "pt");
change.addMessage("It is now possible to force images into a folder.", "en");
change.addMessage("Opção para forçar imagens a uma determinada pasta criada.", "pt");

change = new Changelog(0, 19, 0);
change.addMessage("Initial combat tracker release. More planned for later.", "en");
change.addMessage("Lançamento inicial do Combat Tracker. Atualizações planejadas para o futuro.", "pt");

change = new Changelog(0, 20, 0);
change.addMessage("Effect tracking added to Combat Tracker. Admin screen not implemented for it.", "en");
change.addMessage("Efeitos adicionados ao Combat Tracker. Uma tela de administração para eles não foi implementada.", "pt");

change = new Changelog(0, 21, 0);
change.addMessage("Multiple changes to Sheet classes.", "en");
change.addMessage("Várias mudanças em classes Sheet.", "pt");

delete (change);

Changelog.finished();