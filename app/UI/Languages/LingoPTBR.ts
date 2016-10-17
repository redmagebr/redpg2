// Create new Lingo
var ptbr = new Lingo();
ptbr.ids = ["pt", "pt-br"]
ptbr.name = "Português - Brasil";
ptbr.shortname = "Português";
ptbr.flagIcon = "PT_BR";


// Login Screen
ptbr.setLingo("_LOGINEMAIL_", "E-mail");
ptbr.setLingo("_LOGINPASSWORD_", "Senha");
ptbr.setLingo("_LOGINSUBMIT_", "Entrar");

// Changelog
ptbr.setLingo("_CHANGELOGTITLE_", "Histórico de mudanças");
ptbr.setLingo("_CHANGELOGP1_", "Para receber os updates marcados em vermelho você precisa atualizar sua aplicação para a última versão.");
ptbr.setLingo("_CHANGELOGP2_", "Compatibilidade com versões anteriores não é intencional. Não existem garantias de que versões desatualizadas funcionem e é recomendável sempre utilizar a versão mais recente do aplicativo.");
ptbr.setLingo("_CHANGELOGCURRENTVERSION_", "A sua versão é");
ptbr.setLingo("_CHANGELOGMOSTRECENTVERSION_", "A versão mais recente é");
ptbr.setLingo("_CHANGELOGVERSIONWARNING_", "Seu aplicativo está desatualizado. Recomenda-se atualizar o seu aplicativo. Caso esteja acessando a versão Online através de RedPG.com.br, é só recarregar a página (F5).");

// Home  Page
ptbr.setLingo("_REDPGTITLE_", "RedPG");
ptbr.setLingo("_REDPGEXP1_", "RedPG é um sistema para facilitar RPGs de Mesa através da internet. Funções do sistema incluem o compartilhamento de Imagens, Sons, Fichas de Personagens, uma sala para troca de mensagens com suporte a dados e muito mais, com novas funções sempre sendo adicionadas.");
ptbr.setLingo("_REDPGEXP2_", "Todos os aspectos do sistema existem e estão presos aos Grupos, um grupo de RPG. Então para criar qualquer coisa ou utilizar o sistema de qualquer maneira, você precisa criar ou ser convidado a um Grupo. Isso é feito na seção \"Grupos\", no menu à esquerda.");
ptbr.setLingo("_REDPGFORUMTITLE_", "Últimos posts no Fórum");
// TODO: Implementar mensagens do fórum.
ptbr.setLingo("_REDPGFORUM1_", "Não Implementado");
ptbr.setLingo("_REDPGDONATIONTITLE_", "Doações");
ptbr.setLingo("_REDPGDONATIONEXP1_", "RedPG é um sistema gratuito e permanecerá gratuito enquanto isso for possível. Mas o servidor possui um custo e alguém precisa pagar.");
ptbr.setLingo("_REDPGDONATIONEXP2_", "Através de doações, você funda o desenvolvimento do sistema e ajuda a pagar as mensalidades do servidor. Com a ajuda de todos, RedPG poderá ser grátis para sempre!");
ptbr.setLingo("_REDPGDONATIONEXP3_", "Sempre que fizer uma doação, tente realizar ela a partir de uma conta registrada no mesmo nome registrado no RedPG. Assim, no futuro suas doações poderão ser contabilizadas pelo sistema do RedPG!");
ptbr.setLingo("_REDPGLINKSTITLE_", "Links úteis");
ptbr.setLingo("_REDPGLINKFRONTBUTTON_", "RedPG Front on GitHub");
ptbr.setLingo("_REDPGLINKFRONTEXP_", "Versão offline do cliente RedPG. Usuários que queiram abrir o RedPG a partir da própria máquina devem baixar versões atualizadas aqui. A versão offline permite que jogadores e mestres compartilhem sons que estejam dentro da pasta Sons, sem a necessidade de um servidor para compartilhar sons.");

// Menu
ptbr.setLingo("_MENULOGOUT_", "Logout");
ptbr.setLingo("_MENUGAMES_", "Grupos");
ptbr.setLingo("_MENUCONFIG_", "Opções");
ptbr.setLingo("_MENUCHAT_", "Chat");
ptbr.setLingo("_MENUSHEETS_", "Fichas");
ptbr.setLingo("_MENUIMAGES_", "Fotos");
ptbr.setLingo("_MENUSOUNDS_", "Sons");
ptbr.setLingo("_MENUIMAGE_", "Foto");
ptbr.setLingo("_MENUHITBOX_", "Hitbox");
ptbr.setLingo("_MENUYOUTUBE_", "Video");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("", "");

// Estilos
ptbr.setLingo("_STYLESTITLE_", "Estilos de Fichas");
ptbr.setLingo("_STYLESEXP1_", "Um estilo de ficha é como um formulário em branco que pode ser preenchido para criar uma ficha. O sistema é bem aberto e não existem limites para o que um estilo de ficha pode realizar. O uso mais comum para o estilo de ficha é definir quais campos a ficha terá e como eles são apresentados para servirem como fichas de personagens durante o jogo, mas muitos outros tipos de \"ficha\" já foram criados no passado (como História de Personagem, Mapas, Notas Pessoais, etc).");
ptbr.setLingo("_STYLESEXP2_", "A confecção de um estilo é algo um tanto complicado, então essa parte do sistema deve ser utilizada por usuários avançados.");
ptbr.setLingo("_STYLESNEWSTYLE_", "--- Criar novo estilo");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("", "");

// Estilo Designer
ptbr.setLingo("_STYLEEDITOR_", "Editor de Estilo");
ptbr.setLingo("_STYLEEDITOREXP_", "");
ptbr.setLingo("_STYLEEDITORNAME_", "Nome do Estilo");
ptbr.setLingo("_STYLEEDITORPUBLIC_", "Estilo é Público");
ptbr.setLingo("_STYLEEDITORPUBLICEXP_", "Estilos públicos podem ser utilizados em qualquer mesa.");
ptbr.setLingo("_STYLEEDITORGAME_", "Mesa:");
ptbr.setLingo("_STYLEEDITORGAMEEXP_", "Estilos só podem ser utilizados para fichas criadas na mesa definida.");
ptbr.setLingo("_STYLEEDITORHTML_", "HTML:");
ptbr.setLingo("_STYLEEDITORCSS_", "CSS:");
ptbr.setLingo("_STYLEEDITORJS_", "JavaScript:");
ptbr.setLingo("_STYLEEDITORPUBLICCODE_", "Código Público:");
ptbr.setLingo("_STYLEEDITORCOPY_", "Copiar Estilo:");
ptbr.setLingo("_STYLEEDITORCOPYEXP_", "Copia todos os valores do estilo selecionado para o atual.");
ptbr.setLingo("_STYLEEDITORCOPYBUTTON_", "Copiar");
ptbr.setLingo("_STYLEEDITORREMAIN_", "Permanecer nessa tela");
ptbr.setLingo("_STYLEEDITORSAVE_", "Salvar");

// Sons
ptbr.setLingo("_SOUNDSTITLE_", "Sons");
ptbr.setLingo("_SOUNDSLINKTITLE_", "Link Direto");
ptbr.setLingo("_SOUNDSDROPBOXCHOOSER_", "Escolher do Dropbox");
ptbr.setLingo("_SOUNDSEXP01_", "Aqui você pode adicionar músicas e efeitos sonoros para compartilhar em Salas ou utilizar em Fichas.");
ptbr.setLingo("_SOUNDSEXP02_", "Quando adicionando arquivos, veja a opção \"Adicionar como BGM\". Sons adicionados como BGM irão tocar no primeiro canal, que por padrão se repete automaticamente. Sons que forem adicionados sem serem BGM serão considerados SE, tocarão no segundo canal e não se repetirão. Existem opções separadas de volume para os dois tipos de sons, essas opções podem ser encontradas na seção \"Opções\", do lado esquerdo.");
ptbr.setLingo("_SOUNDSISBGM_", "Adicionar como BGM");
ptbr.setLingo("_SOUNDSNOFOLDERNAME_", "Sem Pasta");
ptbr.setLingo("_SOUNDSRENAME_", "Renomear");
ptbr.setLingo("_SOUNDSFOLDER_", "Renomear Pasta");
ptbr.setLingo("_SOUNDSPLAY_", "Tocar");
ptbr.setLingo("_SOUNDSRENAMEPROMPT_", "Digite o novo nome para \"%a\":");
ptbr.setLingo("_SOUNDSRENAMEFOLDERPROMPT_", "Digite a nova pasta para \"%a\", atualmente em \"%b\":");

// Imagens
ptbr.setLingo("_IMAGESTITLE_", "Fotos");
ptbr.setLingo("_IMAGESEXP01_", "Imagens ficam anexadas à sua conta e podem ser utilizadas em qualquer seção do RedPG.");
ptbr.setLingo("_IMAGESEXP02_", "Você deve adicionar imagens como um Link direto ou através de uma conta Dropbox. É possível utilizar o botão Dropbox abaixo para começar a guardar as imagens na sua conta RedPG.");
ptbr.setLingo("_IMAGESEXP03_", "O sistema tentará organizar as imagens adicionadas através do Dropbox em pastas automaticamente, porém você pode alterar essas pastas mais tarde. Imagens com um \"-\" no nome do arquivo terão tudo que estiver antes do traço como sendo o nome da pasta, e o que vier depois sendo considerado o nome da imagem. O sistema não vai permitir imagens repetidas (tanto como Link, quanto como Pasta/Nome).");
ptbr.setLingo("_IMAGESDROPBOXCHOOSER_", "Escolher do Dropbox");
ptbr.setLingo("_IMAGESLINKTITLE_", "Link Direto");
ptbr.setLingo("_IMAGESERROR_", "Erro carregando a lista de imagens. Tente novamente.");
ptbr.setLingo("_IMAGESSAVEERROR_", "Houve um erro salvando a lista de imagens.");
ptbr.setLingo("_IMAGESNOFOLDERNAME_", "Sem Pasta");
ptbr.setLingo("_IMAGESSHARE_", "Compartilhar na sala atual (se conectado)");
ptbr.setLingo("_IMAGESVIEW_", "Visualizar");
ptbr.setLingo("_IMAGESPERSONA_", "Utilizar como Persona");
ptbr.setLingo("_IMAGESDELETE_", "Deletar");
ptbr.setLingo("_IMAGESRENAME_", "Renomear");
ptbr.setLingo("_IMAGESFOLDER_", "Alterar Pasta");
ptbr.setLingo("_IMAGESRENAMEPROMPT_", "Digite o novo nome para \"%a\":");
ptbr.setLingo("_IMAGESRENAMEFOLDERPROMPT_", "Digite a nova pasta para \"%a\", atualmente em \"%b\":");
ptbr.setLingo("", "");
ptbr.setLingo("", "");

// PICAS
ptbr.setLingo("_PICASHARE_", "Compartilhar no Chat");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("", "");


// Fichas
ptbr.setLingo("_SHEETSTITLE_", "Fichas");
ptbr.setLingo("_SHEETSEXP01_", "Fichas são algo que mestres e seus jogadores podem guardar no sistema, garantindo que todos estejam vendo a mesma versão desse recurso.");
ptbr.setLingo("_SHEETSEXP02_", "Normalmente são usadas para guardar as informações de personagens, mas têm o potencial para guardar qualquer tipo de informação.");
ptbr.setLingo("_SHEETSEXP03_", "Cada ficha utiliza um \"Estilo\", que define a aparência dela e os valores que ela precisa guardar. Como alguns estilos não são criados por um administrador, tome cuidado ao abrir fichas que utilizem estilos criados por alguém em quem você não confia. Apenas os estilos criados por um administrador são considerados seguros.");
ptbr.setLingo("_SHEETSOPENSTYLEEDITOR_", "Abrir gerenciador de estilos de ficha");
ptbr.setLingo("_SHEETSDELETE_", "Deletar");
ptbr.setLingo("_SHEETSRENAMEFOLDER_", "Pasta");
ptbr.setLingo("_SHEETSCHANGEPERMISSIONS_", "Permissões");
ptbr.setLingo("_SHEETSDELETE_", "Deletar");
ptbr.setLingo("_SHEETSNOFOLDERNAME_", "Fichas sem pasta");
ptbr.setLingo("_SHEETSRENAMEFOLDERPROMPT_", "Escolha a nova pasta para \"%a\", atualmente em \"%b\":");
ptbr.setLingo("_SHEETSNEWSHEET_", "Criar nova ficha");
ptbr.setLingo("_SHEETSNOSHEETS_", "Sem fichas para exibir.");
ptbr.setLingo("_SHEETCONFIRMDELETE_", "Deletar \"%a\"? Fichas deletadas não podem ser recuperadas.");

// Jogos
ptbr.setLingo("_GAMESTITLE_", "Grupos");
ptbr.setLingo("_GAMESEXP1_", "Caso precise informar seu identificador para alguém, ele é \"%a\", sem as aspas.");
ptbr.setLingo("_GAMESEXP2_", "Aqui você pode administrar os grupos dos quais você participa. Para convidar jogadores ao seu grupo, você irá precisar do identificador deles.");
ptbr.setLingo("_GAMESEXP3_", "Um grupo nesse sistema é o lugar no qual todas as outras partes do sistema se conectam. As salas, o ambiente no qual as partidas são jogadas, ficam anexadas a um grupo. As fichas de personagens ficam anexadas a um grupo.");
ptbr.setLingo("_GAMESEXP4_", "No momento não é possível pedir uma lista de grupos de livre entrada (não implementados).");
ptbr.setLingo("_GAMESINVITES_", "Meus convites");
ptbr.setLingo("_GAMESNEWGAME_", "Criar novo grupo");
ptbr.setLingo("_GAMEINVITESERROR_", "Houve um erro no pedido.");
ptbr.setLingo("_GAMEINVITESEMPTY_", "Você não recebeu nenhum convite.");
ptbr.setLingo("_GAMEINVITESREFRESH_", "Clique aqui para atualizar essa página.");
ptbr.setLingo("_GAMEINVITESERRORTRYAGAIN_", "Tente novamente.");
ptbr.setLingo("_GAMEINVITESGAMETITLE_", "Grupo");
ptbr.setLingo("_GAMEINVITESSTORYTELLER_", "Mestre");
ptbr.setLingo("_GAMEINVITESNOMESSAGE_", "Nenhuma mensagem foi adicionada ao convite.");
ptbr.setLingo("_GAMEINVITESMESSAGE_", "Convite");
ptbr.setLingo("_GAMEINVITESACCEPT_", "Aceitar");
ptbr.setLingo("_GAMEINVITESREJECT_", "Recusar");
ptbr.setLingo("_GAMESEDIT_", "Editar");
ptbr.setLingo("_GAMESDELETE_", "Deletar");
ptbr.setLingo("_GAMESLEAVE_", "Sair");
ptbr.setLingo("_GAMESNOROOMS_", "Nenhuma sala visível.");
ptbr.setLingo("_GAMESNOGAMES_", "Você não faz parte de nenhum grupo. Você pode criar seu próprio grupo ou ser convidado a algum.");
ptbr.setLingo("_GAMECREATORTITLE_", "Criador");
ptbr.setLingo("_GAMESPERMISSIONS_", "Permissões");
ptbr.setLingo("_GAMESSENDINVITES_", "Enviar convites");
ptbr.setLingo("_GAMESCREATEROOM_", "Criar sala");
ptbr.setLingo("_GAMESROOMPERMISSIONS_", "Permissões");
ptbr.setLingo("_GAMESROOMDELETE_", "Deletar");
ptbr.setLingo("", "");

// Salas
ptbr.setLingo("_ROOMDESIGNERTITLE_", "Editor de Salas");
ptbr.setLingo("_ROOMDESIGNERERROR_", "Houve um erro no processamento. Tente novamente.");
ptbr.setLingo("_ROOMDESIGNERNAMEPLACEHOLDER_", "Nome da Sala");
ptbr.setLingo("_ROOMDESIGNERMESSAGEPLACEHOLDER_", "Descrição da sala. Será impressa no topo sempre que alguém visitá-la.");
ptbr.setLingo("_ROOMDESIGNERSUBMIT_", "Enviar");
ptbr.setLingo("_ROOMDESIGNEREXP_", "Uma sala é um lugar onde todos podem se reunir para participar de um jogo. Recomenda-se criar salas separadas por sua função, como \"Criação de Fichas\" ou \"História Principal\".");
ptbr.setLingo("", "");
ptbr.setLingo("", "");

// Jogo Formulário
ptbr.setLingo("_GAMEDESIGNERTITLE_", "Editor de Mesas");
ptbr.setLingo("_GAMEDESIGNERERROR_", "Houve um erro no processamento. Tente novamente.");
ptbr.setLingo("_GAMEDESIGNERNAMEPLACEHOLDER_", "Nome da mesa. Máximo de 30 caracteres.");
ptbr.setLingo("_GAMEDESIGNERMESSAGEPLACEHOLDER_", "Descrição para a mesa. Utilize esse espaço para definir quais os objetivos da mesa, assim como horários e qualquer informação que seus jogadores devam ter.");
ptbr.setLingo("_GAMEDESIGNERSUBMIT_", "Enviar");
ptbr.setLingo("", "");

// Jogos Invites
ptbr.setLingo("_GAMEINVITESTITLE_", "Meus Convites");
ptbr.setLingo("_GAMEINVITESEXP01_", "Enquanto você não aceitar um dos convites, você não faz parte do grupo.");
ptbr.setLingo("_GAMEINVITESEXP02_", "Caso precise informar seu identificador a alguém, ele é \"%a\".");
ptbr.setLingo("_GAMEINVITEDESIGNERTITLE_", "Enviando Convites");
ptbr.setLingo("_GAMEINVITEDESIGNEREXP01_", "Aqui você adiciona jogadores a mesa. Um jogador só pode visualizar qualquer coisa de uma mesa quando ele foi convidado e aceitou o convite. Depois de enviar o convite, você não poderá repetir o envio até o jogador aceitar ou recusar o convite. Para convidar um jogador, você precisa digitar o identificador dele no formulário abaixo. Identificadores de todos são parecidos com o seu, como \"Nome#1234\", então um nome curto, sem espaços, seguido de \"#\" e então um número com quatro dígitos.");
ptbr.setLingo("_GAMEINVITEDESIGNEREXP02_", "Você está adicionando jogadores para a mesa \"%a\".");
ptbr.setLingo("_GAMEINVITEDESIGNERERROR404_", "Nenhum jogador com esse nome foi encontrado.");
ptbr.setLingo("_GAMEINVITEDESIGNERERROR401_", "Você já enviou um convite para esse jogador.");
ptbr.setLingo("_GAMEINVITEDESIGNERSUCCESS_", "Convite enviado com sucesso!");
ptbr.setLingo("_GAMEINVITEDESIGNERSUBMIT_", "Enviar");
ptbr.setLingo("_GAMEINVITEDESIGNERNAMEPLACEHOLDER_", "Identificador#");
ptbr.setLingo("_GAMEINVITEDESIGNERMESSAGEPLACEHOLDER_", "Carta de apresentação");
ptbr.setLingo("", "");

// Chat
ptbr.setLingo("_CHATHELP01_", "Use \"/comandos\" para imprimir uma lista completa de comandos. Comandos básicos:");
ptbr.setLingo("_CHATHELP02_", "\"/me [mensagem]\": Envia a mensagem como uma ação da persona escolhida.");
ptbr.setLingo("_CHATHELP03_", "\"/off [mensagem]\": Envia a mensagem como uma mensagem fora de jogo, falando como o jogador.");
ptbr.setLingo("_CHATHELP04_", "\"/story [mensagem]\": Envia a mensagem como uma mensagem de história, disponível apenas para narradores.");
ptbr.setLingo("_CHATHELP05_", "Alternativamente, segure Alt, Control ou Shift quando for enviar a mensagem.");
ptbr.setLingo("_CHATHELP06_", "É recomendável executar \"/clear 1\" para limpar as mensagens no servidor de vez em quando, ou a sala ficará cada vez mais lenta.");
ptbr.setLingo("_CHATHELP07_", "Caso deseje usar as músicas em modo offline, mas o RedPG em modo online, clique no formulário abaixo e escolha suas músicas: você estará dando permissão temporária para o RedPG acessá-las.");
ptbr.setLingo("_CHATEMPTYNOTALLOWED_", "Mensagens vazias não são permitidas. Para limpar a tela de mensagens, digite \"/clear\".");
ptbr.setLingo("_CHATMESSAGENOTSENT_", "Houve um erro no envio da mensagem acima.");
ptbr.setLingo("_CHATMESSAGENOTSENTRESEND_", "Clique aqui para tentar novamente.");
ptbr.setLingo("_CHATHASCONNECTED_", "entrou na sala.");
ptbr.setLingo("_CHATHASDISCONNECTED_", "saiu da sala.");
ptbr.setLingo("_CHATOLDMESSAGESNOTLOADED_", "Mensagens antigas não foram impressas.");
ptbr.setLingo("_CHATOLDMESSAGESLOAD_", "Clique aqui para carregar todas as mensagens dessa sala.");
ptbr.setLingo("_CHATYOUAREDISCONNECTED_", "Você foi desconectado.");
ptbr.setLingo("_CHATDISCONNECTEDRECONNECT_", "Clique aqui para reconectar.");
ptbr.setLingo("_CHATNOTALLMESSAGES_", "Algumas mensagens não foram impressas por estarem acima do limite atual de mensagens. Você pode aumentar o limite de mensagens em Opções.");
ptbr.setLingo("_CHATRECONNECTINGEXP_", "Você foi desconectado. Tentando reconectar...");
ptbr.setLingo("_CHATDISCONNECTEDEXP_", "Você está desconectado.");
ptbr.setLingo("_CHATMESSAGEROLEPLAYTRANSLATION_", "Tradução");
ptbr.setLingo("_CHATMESSAGEUNKNOWNTYPE_", "Mensagem de tipo desconhecido \"%a\", enviada por %b.");
ptbr.setLingo("_CHATSENDER_", "Jogador");
ptbr.setLingo("_CHATSENDERSTORYTELLER_", "Mestre");
ptbr.setLingo("_CHATDICEROLLED_", "rolou");
ptbr.setLingo("_CHATDICESECRETROLLED_", "secretamente rolou");
ptbr.setLingo("_CHATDICESHOWN_", "mostrou");
ptbr.setLingo("_CHATDICESECRETSHOWN_", "secretamente mostrou");
ptbr.setLingo("_CHATMESSAGEDICEREASON_", "Motivo");
ptbr.setLingo("_CHATMESSAGEWHISPERTO_", "Mensagem enviada para");
ptbr.setLingo("_CHATMESSAGEWHISPERFROM_", "Mensagem recebida de");
ptbr.setLingo("_CHATMESSAGESHAREDBGM_", "compartilhou um som");
ptbr.setLingo("_CHATMESSAGEPLAYBGM_", "Tocar");
ptbr.setLingo("_CHATMESSAGESHAREDIMAGE_", "compartilhou uma imagem");
ptbr.setLingo("_CHATMESSAGESEEIMAGE_", "Ver");
ptbr.setLingo("_CHATMESSAGESHAREDSE_", "compartilhou um efeito sonoro");
ptbr.setLingo("_CHATMESSAGEPLAYSE_", "Ouvir");
ptbr.setLingo("_CHATMESSAGESHAREDVIDEO_", "compartilhou um video");
ptbr.setLingo("_CHATMESSAGEPLAYVIDEO_", "Assistir");
ptbr.setLingo("_CHATMESSAGEVOTECREATEDVOTE_", "criou uma votação");
ptbr.setLingo("_CHATDICEROLLEDWAITING_", "Esperando resposta do servidor...");
ptbr.setLingo("_CHATDICEAMOUNT_", "#");
ptbr.setLingo("_CHATDICEFACES_", "d#");
ptbr.setLingo("_CHATDICEMOD_", "+#");
ptbr.setLingo("_CHATDICEREASON_", "Razão");
ptbr.setLingo("_CHATWHISPERNOTARGETSFOUND_", "Nenhum jogador encontrado para \"%a\".");
ptbr.setLingo("_CHATMULTIPLETARGETSFOUND_", "Múltiplos jogadores encontrados");
ptbr.setLingo("_CHATINVALIDCOMMAND_", "Comando inválido. Digite \"/comandos\" para imprimir uma lista completa de comandos.");
ptbr.setLingo("_CHATBGMERROR_", "Erro ao tocar música.");
ptbr.setLingo("_CHATSEERROR_", "Erro ao tocar efeito sonoro.");
ptbr.setLingo("_CHATSOUNDADDMORE_", "Clique aqui para alterar músicas em uso.");
ptbr.setLingo("_CHATMESSAGEANNOUNCEMENT_", "AVISO DO SISTEMA");
ptbr.setLingo("_CHATMESSAGESFROM_", "Mensagens de %a.");
ptbr.setLingo("_CHATIMAGESNOIMAGES_", "Sem imagens recentes.");
ptbr.setLingo("_CHATIMAGESPRINTINGIMAGES_", "Imagens recentes:");
ptbr.setLingo("", "");

// Chat Persona Designer
ptbr.setLingo("_PERSONADESIGNERTITLE_", "Administrador de Personas");
ptbr.setLingo("_PERSONADESIGNERNAME_", "Nome do Personagem");
ptbr.setLingo("_PERSONADESIGNERAVATAR_", "Link para Imagem (Opcional)");
ptbr.setLingo("_PERSONADESIGNERCREATE_", "Criar");
ptbr.setLingo("_CHATPERSONADESIGNERUSE_", "Usar essa persona");
ptbr.setLingo("_CHATPERSONADESIGNERDELETE_", "Deletar essa persona");
ptbr.setLingo("", "");
ptbr.setLingo("", "");


// Config
ptbr.setLingo("_CONFIGSEVOLUME_", "Volume de Efeitos Sonoros");
ptbr.setLingo("_CONFIGSEVOLUMEEXP_", "Define o volume para efeitos sonoros reproduzidos no RedPG.");
ptbr.setLingo("_CONFIGBGMVOLUME_", "Volume de Músicas");
ptbr.setLingo("_CONFIGBGMVOLUMEEXP_", "Define o volume para músicas reproduzidas no RedPG.");
ptbr.setLingo("_CONFIGSAVE_", "Salvar Configuração");
ptbr.setLingo("_CONFIGERROR_", "Erro salvando configuração.");
ptbr.setLingo("_CONFIGSUCCESS_", "Configurações salvas com sucesso.");
ptbr.setLingo("_CONFIGRESET_", "Resetar Configurações");
ptbr.setLingo("_CONFIGTITLE_", "Configurações");
ptbr.setLingo("_CONFIGCHATFONTSIZE_", "(Chat) Tamanho da fonte:");
ptbr.setLingo("_CONFIGCHATFONTFAMILY_", "(Chat) Fonte:");
ptbr.setLingo("_CHATFONTSIZEEXP01_", "Define o tamanho da fonte utilizada no chat.");
ptbr.setLingo("_CHATFONTSIZEEXP02_", "A fonte se torna menor para a esquerda e maior para a direita.");
ptbr.setLingo("_CHATFONTFAMILEXP01_", "Define qual é a fonte utilizada no Chat. Você pode utilizar qualquer fonte disponível no seu computador.");
ptbr.setLingo("_CHATFONTFAMILEXP02_", "A fonte usada no RedPG é \"Alegreya\". A fonte utilizada no antigo chat do RedPG é \"Caudex\" e ainda está disponível.");
ptbr.setLingo("_CONFIGCHATHELP_", "(Chat) Mostrar texto de ajuda:");
ptbr.setLingo("_CONFIGCHATHELPEXP_", "O texto de ajuda é o guia rápido de utilização do Chat que é normalmente impresso no topo da sala. Essa opção pode esconder esse texto.");
ptbr.setLingo("_CONFIGCHATHELPOP01_", "Imprimir mensagens de ajuda");
ptbr.setLingo("_CONFIGCHATHELPOP02_", "Não imprimir mensagens de ajuda");
ptbr.setLingo("_CONFIGANIMATIONTIME_", "Duração de animações:");
ptbr.setLingo("_ANIMATIONTIMEEXP01_", "Todas as animações do RedPG serão proporcionais a essa configuração.");
ptbr.setLingo("_ANIMATIONTIMEEXP02_", "Abaixar essa configuração pode ajudar em dispositivos mais lentos que estejam tendo dificuldades em processar as animações do RedPG.");
ptbr.setLingo("_CONFIGCHATAUTOEXP_", "Quando recebendo compartilhamentos no Chat, essa opção define quando o compartilhamento é aceito automaticamente. Você sempre pode aceitar manualmente.");
ptbr.setLingo("_CONFIGCHATAUTONEVER_", "Nunca");
ptbr.setLingo("_CONFIGCHATAUTOSOMETIMES_", "Apenas quando enviado pelo narrador");
ptbr.setLingo("_CONFIGCHATAUTOALWAYS_", "Sempre");
ptbr.setLingo("_CONFIGCHATAUTOBGM_", "(Chat) Aceitar músicas:");
ptbr.setLingo("_CONFIGCHATAUTOSE_", "(Chat) Aceitar efeitos sonoros:");
ptbr.setLingo("_CONFIGCHATAUTOIMAGE_", "(Chat) Aceitar imagens:");
ptbr.setLingo("_CONFIGCHATAUTOVIDEO_", "(Chat) Aceitar vídeos:");
ptbr.setLingo("_CONFIGCHATMAXMESSAGESEXP01_", "Define quantas mensagens podem estar impressas no chat ao mesmo tempo. Mínimo de 60 mensagens e máximo de 10000 mensagens. Escolha de acordo com seu CPU.");
ptbr.setLingo("_CONFIGCHATMAXMESSAGESEXP02_", "Essa opção é ignorada e se torna 60 quando utilizando dispositivos móveis.");
ptbr.setLingo("_CONFIGCHATMAXMESSAGES_", "(Chat) Número de mensagens:");
ptbr.setLingo("_CONFIGCLEANPERSONAS_", "(Chat) Personas Vazias");
ptbr.setLingo("_CONFIGCLEANPERSONAS01_", "Mostrar personas padrão");
ptbr.setLingo("_CONFIGCLEANPERSONAS02_", "Mostrar personas vazias");
ptbr.setLingo("_CONFIGCLEANPERSONAS03_", "Mostrar personas vazias, sem nome");
ptbr.setLingo("_CONFIGCLEANPERSONASEXP_", "Essa opção retira o estilo padrão das personas e os deixa transparentes.");
ptbr.setLingo("", "");
ptbr.setLingo("", "");
ptbr.setLingo("", "");

// Lingolist
LingoList.storeLingo(ptbr);
delete (ptbr);