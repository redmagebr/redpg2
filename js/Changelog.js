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

change = new Changelog(0, 22, 0);
change.addMessage("Multiple changes to Sheets. It's now possible to save sheets.", "en");
change.addMessage("Várias mudanças em Sheets. Agora é possível salvar sheets.", "pt");

change = new Changelog(0, 23, 0);
change.addMessage("Fixes for sheets.", "en");
change.addMessage("Sheet Auto-Update is now the Default state.", "en");
change.addMessage("Move from Beta to Current.", "en");
change.addMessage("Correções em Sheets.", "pt");
change.addMessage("Atualizar Fichas Automaticamente agora é o estado padrão.", "pt");
change.addMessage("Mudança de Beta para Atual. We 2 now.", "pt");

change = new Changelog(0, 24, 0);
change.addMessage("New button to toggle out of Sheet editing.", "en");
change.addMessage("Holding Control while opening a sheet will not move the page.", "en");
change.addMessage("Novo botão para sair de edição de fichas.", "pt");
change.addMessage("Segurar Control ao abrir fichas não troca a página.", "pt");

change = new Changelog(0, 24, 1);
change.addMessage("Fix: Cutscene mode", "en");
change.addMessage("Fix: Modo Cutscene.", "pt");

change = new Changelog(0, 24, 2);
change.addMessage("Fix: Logger should correctly log.", "en");
change.addMessage("Fix: Logger deve loggar corretamente.", "pt");

change = new Changelog(0, 24, 3);
change.addMessage("Improvements to logger.", "en");
change.addMessage("Melhoras ao logger.", "pt");

change = new Changelog(0, 24, 4);
change.addMessage("Fix: Sheet Variables randomly forgetting who they are.", "en");
change.addMessage("Fix: Variáveis de Ficha esquecendo quem são.", "pt");

change = new Changelog(0, 25, 0);
change.addMessage("Filters are now available in Rooms.", "en");
change.addMessage("É possível aplicar Filtros em Salas.", "pt");

change = new Changelog(0, 26, 0);
change.addMessage("New message type: quotes. Usage: /quote Name, Quote.", "en");
change.addMessage("New option to not print certain message types for immersion purposes.", "en");
change.addMessage("Novo tipo de mensagem: citação. Como usar: /citar Nome, Citação.", "pt");
change.addMessage("Nova opção para não imprimir certos tipos de mensagem e aumentar imersão.", "pt");


change = new Changelog(0, 27, 0);
change.addMessage("Updates to sheet code.", "en");
change.addMessage("Fix: /images works when unnecessary messages are disabled.", "en");
change.addMessage("Updates no código de sheets.", "pt");
change.addMessage("Fix: /imagens funciona quando mensagens desnecessárias está desabilitado.", "pt");

change = new Changelog(0, 27, 1);
change.addMessage("Updates to sheet code.", "en");
change.addMessage("Added syllabi to Elvish.", "en");
change.addMessage("Updates no código de sheets.", "pt");
change.addMessage("Adicionadas sílabas a Elfico.", "pt");

change = new Changelog(0, 27, 1);
change.addMessage("Fix: /w auto-complete will use the FULL nickname rather than the UNIQUE nickname.", "en");
change.addMessage("Fix: Auto-completar do /w ira usar o nick COMPLETO ao invés de nick ÚNICO.", "pt");

change = new Changelog(0, 27, 2);
change.addMessage("Fix: Logs should work now. Old logs need to be recreated or fixed manually.", "en");
change.addMessage("Fix: Logs devem funcionar agora. Logs antigos deverão ser recriados ou consertados manualmente.", "pt");

change = new Changelog(0, 27, 2);
change.addMessage("Fix: Logs will no longer include personal messages.", "en");
change.addMessage("Fix: Logs não irão mais incluir mensagens pessoais.", "pt");

change = new Changelog(0, 27, 3);
change.addMessage("Personas with the same name will now correctly maintain their order in th Persona Manager.", "en");
change.addMessage("Fix: Personas with no avatar will no longer bug out.", "en");
change.addMessage("Personas com o mesmo nome irão manter uma ordem consistente no gerenciador de personas.", "pt");
change.addMessage("Fix: Personas sem um link de imagem não vão mais causar erros.", "pt");

change = new Changelog(0, 27, 4);
change.addMessage("Common URL fixing will be applied to any images opened.", "en");
change.addMessage("Links de qualquer imagem aberta serão corrigidos.", "pt");

change = new Changelog(0, 28, 0);
change.addMessage("Art and other tools added to images.", "en");
change.addMessage("Arte e outras ferramentas adicionadas a imagens.", "pt");

change = new Changelog(0, 28, 1);
change.addMessage("Circles and Squares added.", "en");
change.addMessage("/board added. It's used to create boards for art.", "en");
change.addMessage("Círculos e quadrados adicionados.", "pt");
change.addMessage("/quadro adicionado. Pode ser utilizado para criar quadros para desenhos.", "pt");

delete (change);

Changelog.finished();