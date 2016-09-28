/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/jqueryui/jqueryui.d.ts" />
/// <reference path="typings/NonLatin.d.ts" />
declare function startDebugging(): void;
declare function stopDebugging(): void;
declare var onReady: Array<Listener>;
declare function addOnReady(caller: string, reason: string, listener: Listener): void;
declare function allReady(): void;
interface Listener {
    handleEvent: Function;
}
interface PageManagerPage {
    $element: JQuery;
    leftSided: boolean;
}
interface PersonaInfo {
    afk: Boolean;
    focused: Boolean;
    typing: Boolean;
    persona: String;
    avatar: String;
}
interface PersonaLocalInfo {
    name: String;
    avatar: String;
}
interface ChatController {
    start(): void;
    enterRoom(id: number): void;
    sendStatus(info: PersonaInfo): void;
    sendPersona(info: PersonaInfo): void;
    sendMessage(message: Message): void;
    addCloseListener(obj: Listener): void;
    addOpenListener(obj: Listener): void;
    addMessageListener(type: string, obj: Listener): void;
    isReady(): boolean;
    onReady: Listener;
    end(): void;
}
interface ImageInt {
    getName(): string;
    getLink(): string;
    getId(): string;
}
declare class ImageRed implements ImageInt {
    private name;
    private uploader;
    private uuid;
    getLink(): string;
    getName(): string;
    getId(): string;
}
declare class ImageLink {
    private name;
    private url;
    private folder;
    getFolder(): string;
    getLink(): string;
    getName(): string;
    constructor(name: string, url: string, folder: string);
}
declare class User {
    nickname: string;
    nicknamesufix: string;
    id: number;
    level: number;
    gameContexts: {
        [id: number]: UserGameContext;
    };
    roomContexts: {
        [id: number]: UserRoomContext;
    };
    private changedTrigger;
    isMe(): boolean;
    getGameContext(id: number): UserGameContext;
    releaseGameContext(id: number): void;
    getRoomContext(id: number): UserRoomContext;
    releaseRoomContext(id: number): void;
    getFullNickname(): string;
    getShortNickname(): string;
    updateFromObject(user: Object): void;
}
declare class UserGameContext {
    private user;
    private gameid;
    constructor(user: User);
    createRoom: boolean;
    createSheet: boolean;
    editSheet: boolean;
    viewSheet: boolean;
    deleteSheet: boolean;
    invite: boolean;
    promote: boolean;
    getUser(): User;
    updateFromObject(obj: {
        [id: string]: any;
    }): void;
}
declare class UserRoomContext {
    private user;
    roomid: number;
    private logger;
    private cleaner;
    private storyteller;
    constructor(user: User);
    getRoom(): Room;
    getUser(): User;
    isStoryteller(): boolean;
    isCleaner(): boolean;
    updateFromObject(user: Object): void;
    getUniqueNickname(): string;
}
declare class Room {
    gameid: number;
    id: number;
    description: string;
    name: string;
    playByPost: boolean;
    privateRoom: boolean;
    private users;
    private messages;
    getOrderedMessages(): Array<Message>;
    getOrderedUsers(): Array<User>;
    getStorytellers(): Array<UserRoomContext>;
    getMe(): UserRoomContext;
    getUser(id: number): UserRoomContext;
    getUsersByName(str: string): Array<UserRoomContext>;
    getGame(): Game;
    updateFromObject(room: Object, cleanup: boolean): void;
}
declare class Game {
    private users;
    private rooms;
    private sheets;
    description: string;
    name: string;
    id: number;
    freejoin: boolean;
    creatorid: number;
    creatornick: string;
    creatorsufix: string;
    getCreatorFullNickname(): string;
    isMyCreation(): boolean;
    getMe(): UserGameContext;
    getUser(id: number): UserGameContext;
    getRoom(id: number): Room;
    getSheet(id: number): SheetInstance;
    getOrderedRoomList(): Array<Room>;
    getOrderedSheetList(): Array<SheetInstance>;
    updateFromObject(game: Object, cleanup: boolean): void;
}
declare class SheetInstance {
    id: number;
    gameid: number;
    folder: string;
    name: string;
    values: Object;
    lastValues: string;
    creator: number;
    creatorNickname: string;
    styleId: number;
    styleName: string;
    styleCreator: number;
    styleCreatorNickname: string;
    styleSafe: boolean;
    view: boolean;
    edit: boolean;
    delete: boolean;
    promote: boolean;
    isPublic: boolean;
    changed: boolean;
    private changeTrigger;
    addChangeListener(list: Listener | Function): void;
    triggerChanged(): void;
    getMemoryId(): string;
    setSaved(): void;
    setName(name: string): void;
    setValues(values: Object, local: boolean): void;
    updateFromObject(obj: Object): void;
}
declare class Trigger {
    private functions;
    private objects;
    removeListener(f: Function | Listener): void;
    addListener(f: Function | Listener): void;
    trigger(...args: any[]): void;
}
declare class AJAXConfig {
    private _target;
    private _url;
    private _timeout;
    private _responseType;
    private _data;
    static TARGET_NONE: number;
    static TARGET_GLOBAL: number;
    static TARGET_LEFT: number;
    static TARGET_RIGHT: number;
    static CONDITIONAL_LOADING_TIMEOUT: number;
    private loadingTimeout;
    private instantLoading;
    constructor(url: string);
    forceLoading(): void;
    startConditionalLoading(): void;
    finishConditionalLoading(): void;
    target: number;
    url: string;
    timeout: number;
    responseType: string;
    data: Object;
    setData(id: string, value: any): void;
    setResponseTypeJSON(): void;
    setResponseTypeText(): void;
    setTargetNone(): void;
    setTargetGlobal(): void;
    setTargetLeftWindow(): void;
    setTargetRightWindow(): void;
}
declare class WebsocketController {
    private url;
    private socket;
    private keepAlive;
    private keepAliveTime;
    private keepAliveInterval;
    private static READYSTATE_CONNECTING;
    private static READYSTATE_OPEN;
    private static READYSTATE_CLOSING;
    private static READYSTATE_CLOSED;
    private onOpen;
    private onClose;
    private onMessage;
    private onError;
    constructor(url: string);
    connect(): void;
    isReady(): boolean;
    resetInterval(): void;
    disableInterval(): void;
    doKeepAlive(): void;
    send(action: string, obj: any): void;
    close(): void;
    addCloseListener(obj: Listener): void;
    addOpenListener(obj: Listener): void;
    addMessageListener(type: string, obj: Listener): void;
    triggerOpen(): void;
    triggerClose(): void;
    triggerMessage(e: MessageEvent): void;
}
declare class ChatWsController implements ChatController {
    private socket;
    private currentRoom;
    onReady: Listener;
    constructor();
    isReady(): boolean;
    start(): void;
    end(): void;
    enterRoom(id: number): void;
    sendStatus(info: PersonaInfo): void;
    sendPersona(info: PersonaInfo): void;
    sendMessage(message: Message): void;
    addCloseListener(obj: Listener): void;
    addOpenListener(obj: Listener): void;
    addMessageListener(type: string, obj: Listener): void;
}
declare class Configuration {
    private changeTrigger;
    protected value: any;
    defValue: any;
    setFunction: Function;
    getFunction: Function;
    constructor(defV: any);
    getDefault(): any;
    reset(): void;
    addChangeListener(listener: Listener | Function): void;
    storeValue(value: any): boolean;
    getValue(): any;
}
declare class NumberConfiguration extends Configuration {
    private min;
    private max;
    constructor(defValue: any, min: number, max: number);
    setFunction: (value: number) => void;
    getFunction: () => any;
}
declare class WsportConfiguration extends Configuration {
    setFunction: (value: number) => void;
}
declare class LanguageConfiguration extends Configuration {
    constructor();
    setFunction: (value: string) => void;
}
declare class BooleanConfiguration extends Configuration {
    constructor(bool: boolean);
    setFunction: (value: string) => void;
    getFunction: () => boolean;
}
declare abstract class TrackerMemory {
    private changeTrigger;
    abstract reset(): void;
    abstract storeValue(value: any): any;
    abstract getValue(): any;
    abstract exportAsObject(): any;
    addChangeListener(listener: Listener | Function): void;
    protected triggerChange(): void;
}
declare class MemoryCombat extends TrackerMemory {
    private combatants;
    private round;
    private turn;
    reset(): void;
    exportAsObject(): void;
    storeValue(obj: Object): void;
    getValue(): any;
}
declare class MemoryVersion extends TrackerMemory {
    private importVersion;
    reset(): void;
    storeValue(v: number): void;
    getValue(): number;
    exportAsObject(): number;
}
declare class CombatEffect {
    name: string;
    origin: number;
    customString: String;
    reset(): void;
    exportAsObject(): (string | number)[];
    storeValue(array: Array<any>): void;
}
declare class CombatParticipant {
    id: number;
    name: string;
    initiative: number;
    effects: Array<CombatEffect>;
    private combatMemory;
    constructor(memo: MemoryCombat);
    setSheet(sheet: SheetInstance): void;
    exportAsObject(): any[];
}
declare class ChatInfo {
    private floater;
    private textNode;
    private senderBold;
    private senderTextNode;
    private storyteller;
    constructor(floater: HTMLElement);
    showFor($element: JQuery, message?: Message): void;
    hide(): void;
    bindMessage(message: Message, element: HTMLElement): void;
}
declare class ChatAvatar {
    private element;
    private img;
    private typing;
    private afk;
    private name;
    private user;
    private persona;
    online: boolean;
    private changedOnline;
    constructor();
    getHTML(): HTMLElement;
    getUser(): User;
    setOnline(online: boolean): void;
    reset(): void;
    isChangedOnline(): boolean;
    setImg(img: String): void;
    setName(name: string): void;
    setFocus(focus: boolean): void;
    setTyping(typing: boolean): void;
    setAfk(afk: boolean): void;
    updateName(): void;
    updateFromObject(obj: Object): void;
}
declare class ChatNotificationIcon {
    private element;
    private hoverInfo;
    private language;
    constructor(icon: string, hasLanguage?: boolean);
    addText(text: string): void;
    getElement(): HTMLElement;
    show(): boolean;
    hide(): boolean;
}
declare class ChatFormState {
    private element;
    private state;
    static STATE_NORMAL: number;
    static STATE_ACTION: number;
    static STATE_STORY: number;
    static STATE_OFF: number;
    constructor(element: HTMLElement);
    getState(): number;
    isNormal(): boolean;
    isAction(): boolean;
    isStory(): boolean;
    isOff(): boolean;
    setState(state: number): void;
}
declare class ChatAvatarChoice {
    id: string;
    private avatar;
    private box;
    private useButton;
    private deleteButton;
    nameStr: String;
    avatarStr: String;
    constructor(name: String, avatar: String);
    getHTML(): HTMLElement;
}
declare class ChatSystemMessage {
    private element;
    private hasLanguage;
    constructor(hasLanguage: boolean);
    addLangVar(id: string, value: string): void;
    addTextLink(text: string, hasLanguage: boolean, click: Listener | Function): void;
    addText(text: string): void;
    addElement(ele: HTMLElement): void;
    getElement(): HTMLElement;
}
declare class SheetStyle {
    private css;
    private visible;
    private $visible;
    protected styleInstance: StyleInstance;
    protected sheet: Sheet;
    protected sheetInstance: SheetInstance;
    protected multipleChanges: boolean;
    protected pendingChanges: Array<SheetVariable>;
    protected changeCounter: number;
    protected idCounter: number;
    protected after: Function;
    constructor();
    getUniqueID(): string;
    simplifyName(str: String): string;
    addStyle(style: StyleInstance): void;
    triggerVariableChange(variable: SheetVariable): void;
    triggerAll(): void;
    getStyle(): HTMLStyleElement;
    getElement(): HTMLElement;
    get$Element(): JQuery;
}
declare module StyleFactory {
    function getCreator(): typeof SheetStyle;
}
declare class Sheet {
    protected elements: Array<Node>;
    style: SheetStyle;
    protected variables: {
        [id: string]: SheetVariable;
    };
    protected lists: {
        [id: string]: SheetList;
    };
    protected variableShortcuts: {
        [id: string]: SheetVariable | SheetList;
    };
    protected buttons: {
        [id: string]: SheetButton;
    };
    constructor(style: SheetStyle, eles: NodeList);
    protected processElement(element: HTMLElement): void;
    getValueFor(id: string): any;
    getValueForSimpleId(id: string): any;
    getVariable(id: string): SheetList | SheetVariable;
    getVariableBySimpleId(simpleid: string): SheetVariable | SheetList;
    getButton(id: string): SheetButton;
    protected createVariable(element: HTMLElement): void;
    protected createButton(element: HTMLElement): void;
    protected createList(element: HTMLElement): void;
}
declare class SheetList {
    id: string;
    protected sheet: Sheet;
    protected style: SheetStyle;
    protected visible: HTMLElement;
    protected rows: Array<Sheet>;
    protected detachedRows: Array<Sheet>;
    protected rowElements: Array<Node>;
    protected keyIndex: String;
    protected keyValue: String;
    constructor(sheet: Sheet, style: SheetStyle, element: HTMLElement);
    getValueFor(id: string): any;
    getValue(): any[];
}
declare class SheetVariable {
    id: string;
    parent: Sheet;
    style: SheetStyle;
    protected visible: HTMLElement;
    protected value: any;
    protected editable: boolean;
    protected changeTrigger: Trigger;
    constructor(parent: Sheet, style: SheetStyle, ele: HTMLElement);
    protected cleanChildren(): void;
    updateVisible(): void;
    triggerInput(e: Event): void;
    triggerBlur(): void;
    storeValue(val: any): void;
    triggerChange(counter: number): void;
    getValue(): any;
    exportObject(): any;
    addOnChange(f: Function | Listener): void;
}
declare class SheetButton {
    id: string;
    protected visible: HTMLElement;
    protected click: Function;
    protected sheet: Sheet;
    protected style: SheetStyle;
    constructor(sheet: Sheet, style: SheetStyle, ele: HTMLElement);
}
declare class SheetButtonaddrow extends SheetButton {
    click: () => void;
}
declare class StyleInstance {
    mainCode: string;
    publicCode: string;
    name: string;
    html: string;
    css: string;
}
declare module MessageFactory {
    var messageClasses: {
        [id: string]: typeof Message;
    };
    function registerMessage(msg: typeof Message, id: string, slashCommands: Array<string>): void;
    function registerSlashCommand(slash: typeof SlashCommand, slashCommands: Array<string>): void;
    function createMessageFromType(id: string): Message;
    function createTestingMessages(): Array<Message>;
    function getConstructorFromText(form: string): typeof SlashCommand;
    function createFromText(form: string): Message;
}
declare class SlashCommand {
    receiveCommand(slashCommand: string, message: string): boolean;
    isMessage(): boolean;
    getInvalidHTML(slashCommand: string, msg: string): HTMLElement;
}
declare class SlashClear extends SlashCommand {
}
declare class SlashReply extends SlashCommand {
}
declare class Message extends SlashCommand {
    id: number;
    localid: number;
    roomid: number;
    date: string;
    module: string;
    msg: string;
    special: {
        [id: string]: any;
    } | string;
    private sending;
    origin: number;
    destination: Number | Array<number>;
    private updatedTrigger;
    protected html: HTMLElement;
    clone: boolean;
    getDate(): string;
    onPrint(): void;
    setPersona(name: string): void;
    getPersona(): string;
    findPersona(): void;
    getLocalId(): void;
    getUser(): UserRoomContext;
    addDestinationStorytellers(room: Room): void;
    addDestination(user: User): void;
    getDestinations(): Array<UserRoomContext>;
    makeMockUp(): Array<Message>;
    isWhisper(): boolean;
    isMine(): boolean;
    createHTML(): HTMLElement;
    getHTML(): HTMLElement;
    prepareSending(): void;
    getSpecial(id: string, defaultValue?: any): any;
    setSpecial(id: string, value: any): void;
    updateFromObject(obj: Object): void;
    exportAsObject(): Object;
    receiveCommand(slashCommand: string, msg: string): boolean;
    setMsg(str: string): void;
    getMsg(): string;
    unsetSpecial(id: string): void;
    addUpdatedListener(list: Listener | Function): void;
    triggerUpdated(): void;
    doNotPrint(): boolean;
}
declare class MessageSystem extends Message {
    module: string;
    createHTML(): HTMLParagraphElement;
}
declare class MessageCountdown extends Message {
    private counter;
    module: string;
    static timeout: Number;
    static lastTimeout: MessageCountdown;
    constructor();
    createHTML(): HTMLParagraphElement;
    receiveCommand(slash: string, msg: string): boolean;
    getTarget(): any;
    setTarget(id: number): void;
    setCounter(e: number): void;
    getCounter(): number;
    updateCounter(e: number): void;
}
declare class MessageVote extends Message {
    module: string;
    private voters;
    private voteAmountText;
    private votersText;
    constructor();
    setVoteTarget(id: number): void;
    getVoteTarget(): any;
    createHTML(): HTMLParagraphElement;
    updateVoters(): void;
    addVote(user: UserRoomContext): void;
    removeVote(user: UserRoomContext): void;
}
declare class MessageWebm extends Message {
    module: string;
    createHTML(): HTMLParagraphElement;
    getName(): any;
    setName(name: string): void;
}
declare class MessageVideo extends Message {
    module: string;
    createHTML(): HTMLParagraphElement;
    getName(): any;
    setName(name: string): void;
}
declare class MessageSE extends Message {
    module: string;
    private playedBefore;
    onPrint(): void;
    createHTML(): HTMLParagraphElement;
    getName(): any;
    setName(name: string): void;
}
declare class MessageImage extends Message {
    module: string;
    createHTML(): HTMLParagraphElement;
    getName(): any;
    setName(name: string): void;
}
declare class MessageBGM extends Message {
    module: string;
    private playedBefore;
    onPrint(): void;
    createHTML(): HTMLParagraphElement;
    getName(): any;
    setName(name: string): void;
}
declare class MessageStream extends Message {
    module: string;
    createHTML(): any;
}
declare class MessageSheetcommand extends Message {
    module: string;
    createHTML(): any;
}
declare class MessageWhisper extends Message {
    module: string;
    constructor();
    onPrint(): void;
    createHTML(): HTMLElement;
    receiveCommand(slashCommand: string, msg: string): boolean;
    getInvalidHTML(slashCommand: string, msg: string): HTMLElement;
}
declare class MessageSheetdamage extends Message {
    module: string;
    createHTML(): HTMLParagraphElement;
    getType(): string;
    setTypeHP(): void;
    setTypeMP(): void;
    setTypeExp(): void;
    setLog(log: string): void;
    getLog(): String;
    setSheetName(name: string): void;
    getSheetName(): string;
    setAmount(amount: number): void;
    getAmount(): string;
}
declare class MessageSheetturn extends Message {
    module: string;
    createHTML(): HTMLParagraphElement;
    setSheetName(name: string): void;
    getSheetName(): string;
    setPlayer(id: number): void;
    getPlayer(): number;
}
declare class MessageDice extends Message {
    module: string;
    constructor();
    findPersona(): void;
    makeMockUp(): MessageDice[];
    createHTML(): HTMLElement;
    getInitialRoll(): string;
    getRolls(): Array<number>;
    getMod(): number;
    setMod(mod: number): void;
    getDice(): Array<number>;
    setDice(dice: Array<number>): void;
    addMod(mod: number): void;
    addDice(amount: number, faces: number): void;
    getResult(): number;
}
declare class MessageStory extends Message {
    module: string;
    makeMockUp(): Array<Message>;
    createHTML(): HTMLElement;
}
declare class MessageAction extends Message {
    module: string;
    findPersona(): void;
    createHTML(): HTMLElement;
}
declare class MessageOff extends Message {
    module: string;
    createHTML(): HTMLElement;
}
declare class MessageRoleplay extends Message {
    module: string;
    findPersona(): void;
    constructor();
    makeMockUp(): Array<Message>;
    createHTML(): HTMLElement;
    isIgnored(): boolean;
    getLanguage(): string;
    setLanguage(lang: string): void;
    setTranslation(message: string): void;
    getTranslation(): String;
}
declare class MessageUnknown extends Message {
    module: string;
    createHTML(): HTMLElement;
}
declare module DB {
}
declare module DB.UserDB {
    function hasUser(id: number): boolean;
    function getUser(id: number): User;
    function getAUser(id: number): User;
    function updateFromObject(obj: Array<Object>): void;
}
declare module DB.GameDB {
    function hasGame(id: number): boolean;
    function getGame(id: number): Game;
    function getOrderedGameList(): Array<Game>;
    function updateFromObject(obj: Array<Object>, cleanup: boolean): void;
}
declare module DB.RoomDB {
    var rooms: {
        [id: number]: Room;
    };
    function hasRoom(id: number): boolean;
    function getRoom(id: number): Room;
    function releaseRoom(id: number): boolean;
    function updateFromObject(obj: Array<Object>, cleanup: boolean): void;
}
declare module DB.MessageDB {
    var messageById: {
        [id: number]: Message;
    };
    function releaseMessage(id: number): boolean;
    function releaseLocalMessage(id: number | string): boolean;
    function releaseAllLocalMessages(): void;
    function hasMessage(id: number): boolean;
    function hasLocalMessage(id: number | string): boolean;
    function getMessage(id: number): Message;
    function getLocalMessage(id: number): Message;
    function registerLocally(msg: Message): void;
    function updateFromObject(obj: Array<Object>): void;
}
declare module DB.SheetDB {
    var sheets: {
        [id: number]: SheetInstance;
    };
    function addChangeListener(list: Listener | Function): void;
    function removeChangeListener(list: Listener | Function): void;
    function triggerChanged(sheet: SheetInstance): void;
    function hasSheet(id: number): boolean;
    function getSheet(id: number): SheetInstance;
    function releaseSheet(id: number): void;
    function updateFromObject(obj: Array<Object>): void;
}
declare module DB.ImageDB {
    function getImages(): ImageLink[];
    function getImageByName(name: string): ImageLink;
    function getImageByLink(url: string): ImageLink;
    function hasImageByName(name: string): boolean;
    function hasImageByLink(url: string): boolean;
    function getImagesByFolder(): ImageLink[][];
    function updateFromObject(obj: Array<Object>): void;
    function addImage(img: ImageLink): void;
    function addImages(imgs: Array<ImageLink>): void;
    function triggerChange(image: ImageLink): void;
    function addChangeListener(f: Listener | Function): void;
    function removeChangeListener(f: Listener | Function): void;
}
declare module Application {
    function getMe(): User;
    function isMe(id: number): boolean;
    function getMyId(): number;
}
declare module Application.Config {
    function getConfig(id: string): Configuration;
    function registerChangeListener(id: string, listener: Listener | Function): void;
    function registerConfiguration(id: string, config: Configuration): void;
    function exportAsObject(): {
        [id: string]: any;
    };
    function reset(): void;
    function updateFromObject(obj: {
        [id: string]: any;
    }): void;
    function saveConfig(cbs?: Listener | Function, cbe?: Listener | Function): void;
}
declare module Application.LocalMemory {
    function getMemory(id: string, defaultValue: any): any;
    function setMemory(id: string, value: any): void;
    function unsetMemory(id: string): void;
}
declare module Application.Login {
    function searchLogin(): void;
    function hasLastEmail(): boolean;
    function getLastEmail(): string;
    function isLogged(): boolean;
    function hasSession(): boolean;
    function getSession(): String;
    function logout(): void;
    function attemptLogin(email: string, password: string, cbs: Listener, cbe: Listener): void;
    function receiveLogin(userJson: Object, sessionid: string): void;
    function updateSessionLife(): void;
    function updateLocalStorage(): void;
    function keepAlive(): void;
    function setSession(a: string): void;
    function addListener(listener: Listener | Function): void;
    function getUser(): User;
}
declare class Lingo {
    ids: Array<string>;
    name: string;
    shortname: string;
    flagIcon: string;
    unknownLingo: string;
    langValues: {
        [id: string]: string;
    };
    setLingo(id: string, value: string): void;
    getLingo(id: string, dataset?: {
        [id: string]: string;
    }): string;
}
declare module LingoList {
    function getLingos(): Array<Lingo>;
    function getLingo(id: string): Lingo;
    function storeLingo(lingo: Lingo): void;
}
declare var ptbr: Lingo;
declare var en: Lingo;
declare module UI {
    var idChangelog: string;
    var idGames: string;
    var idChat: string;
    var idConfig: string;
    var idGameInvites: string;
    var idHome: string;
    var idSheets: string;
    var idImages: string;
}
declare module UI.WindowManager {
    var currentLeftSize: number;
    var currentRightSize: number;
    function callWindow(id: string): void;
    function updateWindowSizes(): void;
}
declare module UI.Config {
    function bindInput(configName: string, input: HTMLInputElement): void;
    function saveConfig(): void;
    function setUniqueTimeout(f: Function, t: number): void;
}
declare module UI.PageManager {
    var $pages: {
        [id: string]: JQuery;
    };
    function getAnimationTime(): number;
    function callPage(id: string): void;
    function closeLeftPage(): void;
    function closeRightPage(): void;
    function readWindows(): void;
    function getCurrentLeft(): String;
}
declare module Dropbox {
    function choose(options: any): any;
}
declare module UI.Images {
    function callSelf(): void;
    function printImages(): void;
    function printError(data: any, onLoad: boolean): void;
    function callDropbox(): void;
    function addDropbox(files: any): void;
}
declare module UI.Loading {
    var $leftLoader: JQuery;
    function stopLoading(): void;
    function startLoading(): void;
    function blockLeft(): void;
    function blockRight(): void;
    function unblockLeft(): void;
    function unblockRight(): void;
}
declare module UI.Login {
    function resetState(): void;
    function resetFocus(): void;
    function assumeEmail(email: string): void;
    function submitLogin(e: Event): void;
    function exposeLoginFailure(e: Event, statusCode: number): void;
}
declare module UI.Handles {
    function isAlwaysUp(): boolean;
    function mouseIn(handle: HTMLElement): void;
    function mouseOut(handle: HTMLElement): void;
    function setAlwaysUp(keepUp: boolean): void;
}
declare module UI.Language {
    function getLanguage(): Lingo;
    function searchLanguage(): void;
    function updateScreen(target?: HTMLElement | Document): void;
    function updateElement(element: HTMLElement): void;
    function updateText(element: HTMLElement): void;
    function addLanguageVariable(element: HTMLElement, id: string, value: string): void;
    function addLanguageValue(element: HTMLElement, value: string): void;
    function addLanguagePlaceholder(element: HTMLElement, value: string): void;
    function addLanguageTitle(element: HTMLElement, value: string): void;
    function markLanguage(...elements: HTMLElement[]): void;
}
declare module UI.Sheets {
    function callSelf(ready?: boolean): void;
}
declare module UI.Rooms {
}
declare module UI.Rooms.Designer {
    function fromRoom(room?: Room): void;
    function toRoom(): Room;
}
declare module UI.Games {
    function callSelf(ready?: boolean): void;
    function updateNick(isLogged: boolean): void;
}
declare module UI.Games.Invites {
    function callSelf(): void;
    function printInfo(data: any): void;
    function accept(id: any): void;
    function reject(id: any): void;
    function printError(): void;
}
declare module UI.Games.Designer {
    function fromGame(game?: Game): void;
    function toGame(): Game;
}
declare module UI.SoundController {
    function updateSEVolume(newVolume: number): void;
    function updateBGMVolume(newVolume: number): void;
    function getSoundList(): HTMLInputElement;
    function getBGM(): HTMLAudioElement;
    function playDice(): void;
    function playAlert(): void;
    function isAutoPlay(): boolean;
    function playBGM(url: string): void;
    function playSE(url: string): void;
}
declare module UI.SoundController.MusicPlayer {
    function showContainer(): void;
    function hideContainer(): void;
    function showButton(): void;
    function hideButton(): void;
    function updateSeeker(perc: number): void;
    function stopPlaying(): void;
}
declare module UI.Chat {
    var messageCounter: number;
    function doAutomation(): boolean;
    function callSelf(roomid: number): void;
    function addRoomChangedListener(listener: Listener | Function): void;
    function getRoom(): Room;
    function clearRoom(): void;
    function printElement(element: HTMLElement, doScroll?: boolean): void;
    function printMessage(message: Message, doScroll?: boolean): void;
    function printMessages(messages: Array<Message>, ignoreLowIds: boolean): void;
    function updateScrollPosition(instant?: boolean): void;
    function setScrolledDown(state: boolean): void;
    function sendMessage(message: Message): void;
    function getGetAllButton(): HTMLElement;
    function leave(): void;
    function printGetAllButtonAtStart(): void;
    function printNotallAtStart(): void;
    function printGetAllButton(): void;
}
declare module UI.Chat.Avatar {
    function getMe(): ChatAvatar;
    function resetForConnect(): void;
    function moveScroll(direction: number): void;
    function updatePosition(): void;
    function updateFromObject(obj: Array<Object>, cleanup: boolean): void;
}
declare module UI.Chat.Forms {
    function addOlderText(): void;
    function moveOlderText(direction: number): void;
    function updateFormState(hasPersona: any): void;
    function handleInputKeyboard(e: KeyboardEvent): void;
    function handleInputKeypress(e: KeyboardEvent): void;
    function sendMessage(): void;
    function isTyping(): boolean;
    function isFocused(): boolean;
    function isAfk(): boolean;
    function setTyping(newTyping: boolean): void;
    function setFocused(newFocused: boolean): void;
    function setAfk(newAfk: boolean): void;
    function considerRedirecting(event: KeyboardEvent): void;
    function rollDice(faces?: number): void;
    function setInput(str: string): void;
    function setLastWhisperFrom(user: UserRoomContext): void;
}
declare module UI.Chat.Notification {
    function showReconnecting(): void;
    function hideReconnecting(): void;
    function hideDisconnected(): void;
    function showDisconnected(): void;
}
declare module UI.Chat.PersonaManager {
    function setRoom(room: Room): void;
    function clearPersona(name: String, avatar: String): void;
    function getRoom(): Room;
    function createAndUsePersona(name: string, avatar: String): void;
    function addListener(listener: Listener): void;
    function setPersona(name: String, avatar: String, element: HTMLElement): void;
    function getPersonaName(): String;
    function getPersonaAvatar(): String;
    function unsetPersona(): void;
}
declare module UI.Chat.PersonaDesigner {
    function callSelf(): void;
    function close(): void;
    function setRoom(room: Room): void;
    function fillOut(): void;
    function emptyOut(): void;
    function createPersona(name?: string, avatar?: String): void;
    function removeChoice(choice: ChatAvatarChoice): void;
    function usePersona(name: string, avatar: String): void;
}
declare module Server {
    var IMAGE_URL: string;
    var APPLICATION_URL: string;
    var WEBSOCKET_SERVERURL: string;
    var WEBSOCKET_CONTEXT: string;
    var WEBSOCKET_PORTS: Array<number>;
    function getWebsocketURL(): string;
}
declare module Server.AJAX {
    function requestPage(ajax: AJAXConfig, success: Listener | Function, error: Listener | Function): void;
}
declare module Server.Config {
    function saveConfig(config: Object, cbs?: Listener | Function, cbe?: Listener | Function): void;
}
declare module Server.Login {
    function requestSession(silent: boolean, cbs?: Listener, cbe?: Listener): void;
    function doLogin(email: string, password: string, cbs?: Listener, cbe?: Listener): void;
    function doLogout(cbs?: Listener, cbe?: Listener): void;
}
declare module Server.Images {
    function getImages(cbs?: Listener, cbe?: Listener): void;
}
declare module Server.Games {
    function updateLists(cbs?: Listener, cbe?: Listener): void;
    function getInviteList(cbs?: Listener, cbe?: Listener): void;
    function acceptInvite(gameid: number, cbs?: Listener, cbe?: Listener): void;
    function rejectInvite(gameid: number, cbs?: Listener, cbe?: Listener): void;
}
declare module Server.URL {
    function fixURL(url: string): string;
}
declare module Server.Chat {
    var CHAT_URL: string;
    var currentController: ChatController;
    function isReconnecting(): boolean;
    function setConnected(): void;
    function giveUpReconnect(): void;
    function reconnect(): void;
    function leaveRoom(): void;
    function enterRoom(roomid: number): void;
    function sendStatus(info: PersonaInfo): void;
    function sendPersona(info: PersonaInfo): void;
    function isConnected(): boolean;
    function sendMessage(message: Message): void;
    function hasRoom(): boolean;
    function getRoom(): Room;
    function getAllMessages(roomid: number, cbs?: Listener, cbe?: Listener): void;
    function end(): void;
    function addStatusListener(f: Function | Listener): void;
    function triggerStatus(info: Object): void;
    function addPersonaListener(f: Function | Listener): void;
    function triggerPersona(f: Object): void;
    function addMessageListener(f: Function | Listener): void;
    function triggerMessage(f: Message): void;
}
declare module Server.Chat.Memory {
    var version: number;
    function addChangeListener(f: Function | Listener): void;
    function getConfig(id: string): TrackerMemory;
    function registerChangeListener(id: string, listener: Listener): void;
    function registerConfiguration(id: string, config: TrackerMemory): void;
    function exportAsObject(): {
        [id: string]: any;
    };
    function updateFromObject(obj: {
        [id: string]: any;
    }): void;
    function saveMemory(): void;
}
declare module Server.Storage {
    function requestImages(cbs?: Listener, cbe?: Listener): void;
}
declare module Server.Sheets {
    function updateLists(cbs?: Listener, cbe?: Listener): void;
}
