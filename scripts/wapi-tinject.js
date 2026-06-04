//Version_JS;Version_TInjectMin;Version_CEF4Min;
//3.3.0.0;1.0.0.9;78.3.0

// ╔════════════════════════════════════════════════════════════════════════╝
// ║  KOBLLUX · KOB--NODE · WAPI TInject                                      ║
// ║  ⟪ ✶ MODO ATLAS ATIVADO ✶ ⟫                                              ║
// ║  ATLAS 0x00 · 432Hz · Fundação                                            ║
// ║  Kd1 — KAEL DOMNNUS — Sorocaba, SP — Junho 2026                         ║
// ╚════════════════════════════════════════════════════════════════════════╝

// Constantes ATLAS — versões seladas no momento do pulso
const KOB_WAPI = Object.freeze({
  VERSION_JS:   '3.3.0.0',
  VERSION_TINJ: '1.0.0.9',
  VERSION_CEF4: '78.3.0',
  OPCODE:       '0x00',
  HZ:           432,
  FASE:         'FUNDACAO',
});

function getAllGroupContacts(Contacts) {
	SetConsoleMessage("GetAllGroupContacts", JSON.stringify(Contacts));	
}

function localStorageGetItem(item){
	let aJson = localStorage.getItem(item);
	SetConsoleMessage('getMyNumber', aJson.replace(/(?=:)(.*.?)(?=@)/g,''));
}

function localStorageGetItemID(item){
	let aNumberID = localStorage.getItem(item);
	return aNumberID;
}

function getMyNumber() {    
	localStorage.getItem('last-wid-md') ? 
		localStorageGetItem('last-wid-md') : 
		localStorageGetItem('last-wid')
		
	return true;
}

function getMyNumberID() {    
	let numberID =	
		localStorage.getItem('last-wid-md') ? 
		localStorageGetItemID('last-wid-md') : 
		localStorageGetItemID('last-wid')
		
	return numberID;
}


function convertImgToBase64URL(url, callback, outputFormat){
	var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
};

function SetConsoleMessage(jsName, resultValue) {
    Obj = {
        name: jsName,
        result: '{"result":' + resultValue + '}'
    }
    console.log(JSON.stringify(Obj));
	console.clear();
}

var intervalMonitor;
var isLoggedStatus = false;
var gettingUnreadMessages = false;
var WAVersion;

function startMonitor(intervalSeconds = 0) {
    if (intervalMonitor) {
        clearInterval(intervalMonitor);
    }
	
	isLoggedStatus = WAPI.isLoggedIn();

	window.WAPI.onGetUnReadMessageFromMe();
	WAVersion = WAPI.getWAVersion();
	WAVersion = WAVersion.replace(/\./g, '');
    
	if (intervalSeconds >= 1) {
        intervalMonitor = window.setInterval(monitorUnReadMessages, intervalSeconds * 1000);
    }
}

function stopMonitor() {
    window.clearInterval(intervalMonitor)
}

function removeElementsByClass(elementClass) {
    var elements = document.getElementsByClassName(elementClass);
    if (typeof elements !== 'undefined' && elements.length > 0) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }
}

function moveElementsToParentParentElement(elementClass) {
    var elements = document.getElementsByClassName(elementClass);
    if (typeof elements !== 'undefined' && elements.length > 0) {
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.parentNode.parentNode.appendChild(element);
        }
    }
}

function monitorUnReadMessages() {
    if (gettingUnreadMessages) return;
    
    gettingUnreadMessages = true;
    
    var currentStatus = WAPI.isLoggedIn();
    if (currentStatus != isLoggedStatus) {
        isLoggedStatus = WAPI.isLoggedIn();
        SetConsoleMessage("OnChangeConnect", JSON.stringify(isLoggedStatus));
    }

    if (isLoggedStatus) {
        WAPI.getUnreadMessages(includeMe = "true", includeNotifications = "true", use_unread_count = "true");
    }
    gettingUnreadMessages = false;
}

const fixObjectsStore = () => {
	try {
		console.log('fixObjectsStore start')

		if (!window.Store.Chat._find || !window.Store.Chat.findImpl) {
			window.Store.Chat._find = e => {
				const target = window.Store.Chat.get(e);
				return target ? Promise.resolve(target) : Promise.resolve({
					id: e
				});
			};
			window.Store.Chat.findImpl = window.Store.Chat._find;
		}
	} catch (error) {
		console.log('Error in function fixObjectsStore', error)
	}
}

const newMakeStore = () => {
  if (!window.Store) {
    console.log("New script", "TInject Community")
    let modules = self.require('__debug').modulesMap;
    let keys = Object.keys(modules).filter(e=>e.includes("WA"));
    let modulesFactory = {};
    for (let key of keys){
        if(!modules[key])
            continue;
        let module = modules[key];
        modulesFactory[key] = {
            default: module.defaultExport,
            factory: module.factory,
            ...module
        };
        if(Object.keys(modulesFactory[key].default).length == 0) {
            try{
                self.ErrorGuard.skipGuardGlobal(true);
                Object.assign(modulesFactory[key], self.importNamespace(key));
            }catch(e){
				//
            }
        }
    }

    function getStore(modules) {
        let foundCount = 0;
        let neededObjects = [
            { id: "Store", conditions: (module) => (module.default && module.default.Chat && module.default.Msg) ? module.default : null},
			{ id: "MediaCollection", conditions: (module) => (module.default && module.default.prototype && (module.default.prototype.processFiles !== undefined||module.default.prototype.processAttachments !== undefined)) ? module.default : null },
			{ id: "Conn", conditions: (module) => (module.default && module.default.ref && module.default.refTTL) ? module.default : (module.Conn ? module.Conn : null)},
			{ id: "MediaProcess", conditions: (module) => (module.BLOB) ? module : null },
			{ id: "Archive", conditions: (module) => (module.setArchive) ? module : null },
			{ id: "Block", conditions: (module) => (module.blockContact && module.unblockContact) ? module : null },
			{ id: "ChatUtil", conditions: (module) => (module.sendClear) ? module : null },
			{ id: "GroupInvite", conditions: (module) => (module.sendQueryGroupInviteCode ) ? module : null },
			{ id: "Wap", conditions: (module) => (module.createGroup) ? module : null },
			{ id: "ServiceWorker", conditions: (module) => (module.default && module.default.killServiceWorker) ? module : null },
			{ id: "State", conditions: (module) => (module.STATE && module.STREAM) ? module : null },
			{ id: "_Presence", conditions: (module) => (module.setPresenceAvailable && module.setPresenceUnavailable) ? module : null },
			{ id: "WapDelete", conditions: (module) => (module.sendConversationDelete && module.sendConversationDelete.length == 2) ? module : null },
			{ id: 'FindChat', conditions: (module) => (module && module.findOrCreateLatestChat) ? module : null},
			{ id: "WapQuery", conditions: (module) => (module.queryExist) ? module : ((module.default && module.default.queryExist) ? module.default : null) },
			{ id: "WapQueryMD", conditions: (module) => (module.queryExists && module.queryPhoneExists) || (module.queryWidExists && module.queryPhoneExists) ? module : null},
			{ id: 'Perfil', conditions: (module) => module.__esModule === true && module.setPushname && !module.getComposeContents ? module : null},
			{ id: "CryptoLib", conditions: (module) => (module.decryptE2EMedia) ? module : null },
			{ id: "OpenChat", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.openChat) ? module.default : null },
			{ id: "UserConstructor", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null },
			{ id: "SendTextMsgToChat", conditions: (module) => (module.sendTextMsgToChat) ? module.sendTextMsgToChat : null },
			{ id: "ReadSeen", conditions: (module) => (module.sendSeen) ? module : null },
			{ id: "sendDelete", conditions: (module) => (module.sendDelete) ? module.sendDelete : null },
			{ id: "addAndSendMsgToChat", conditions: (module) => (module.addAndSendMsgToChat) ? module.addAndSendMsgToChat : null },
			{ id: "sendMsgToChat", conditions: (module) => (module.sendMsgToChat) ? module.sendMsgToChat : null },
			{ id: "Catalog", conditions: (module) => (module.Catalog) ? module.Catalog : null },
			{ id: "bp", conditions: (module) => (module.default && module.default.toString && module.default.toString().includes('bp_unknown_version')) ? module.default : null },
			{ id: "MsgKey", conditions: (module) => (module.default && module.default.toString && module.default.toString().includes('MsgKey error: obj is null/undefined')) ? module.default : null },
			{ id: "Parser", conditions: (module) => (module.convertToTextWithoutSpecialEmojis) ? module.default : null },
			{ id: "Builders", conditions: (module) => (module.TemplateMessage && module.HydratedFourRowTemplate) ? module : null },
			{ id: "Me", conditions: (module) => (module.PLATFORMS && module.Conn) ? module.default : null },
			{ id: "CallUtils", conditions: (module) => (module.sendCallEnd && module.parseCall) ? module : null },
			{ id: "Identity", conditions: (module) => (module.queryIdentity && module.updateIdentity) ? module : null },
			{ id: "MyStatus", conditions: (module) => (module.getStatus && module.setMyStatus) ? module : null },						
			{ id: "GroupActions", conditions: (module) => (module.sendExitGroup && module.localExitGroup) ? module : null },
			{ id: "Features", conditions: (module) => (module.FEATURE_CHANGE_EVENT && module.features) ? module : null },
			{ id: "MessageUtils", conditions: (module) => (module.storeMessages && module.appendMessage) ? module : null },
			{ id: "WebMessageInfo", conditions: (module) => (module.WebMessageInfo && module.WebFeatures) ? module.WebMessageInfo : null },
			{ id: "createMessageKey", conditions: (module) => (module.createMessageKey && module.createDeviceSentMessage) ? module.createMessageKey : null },
			{ id: "Participants", conditions: (module) => (module.addParticipants && module.removeParticipants && module.promoteParticipants && module.demoteParticipants) ? module : null },
			{ id: "Base", conditions: (module) => (module.setSubProtocol && module.binSend && module.actionNode) ? module : null },
			{ id: "Versions", conditions: (module) => (module.loadProtoVersions && module.default && module.default["15"] && module.default["16"] && module.default["17"]) ? module : null },
			{ id: "Sticker", conditions: (module) => (module.default && module.default.Sticker) ? module.default.Sticker : null },
			{ id: "MediaUpload", conditions: (module) => (module.default && module.default.mediaUpload) ? module.default : null },
			{ id: "UploadUtils", conditions: (module) => (module.default && module.default.encryptAndUpload) ? module.default : null },
			{ id: "linkPreview", conditions: (module) => (module.linkPreviewFromContactModel ? module : null)},
			{ id: 'Vcard', conditions: (module) => (module.vcardFromContactModel ? module : null)},
			{ id: 'Clock', conditions: (module) => (module.Clock ? module.Clock : null)},
			{ id: 'TemplateButtonCollection', conditions: (module) => (module.TemplateButtonCollectionImpl || module.TemplateButtonCollection ? module.TemplateButtonCollection : null)},
			{ id: 'ButtonCollection', conditions: (module) => (module.ButtonCollectionImpl || module.ButtonCollection ? module.ButtonCollection : null)},
			{ id: "MdCheck",	conditions: (module) => (module && module.isLegacyWebdBackend) ? module : null},
			{ id: "FeatureChecker", conditions: (module) => (module && module.getProtobufFeatureName) ? module : null },
			{ id: "GetMaybeMeUser", conditions: (module) => (module && module.getMaybeMeUser) ? module : null },
			{ id: "QueryExist", conditions: (module) => (module.queryExist) ? module : null },
			{ id: "OpenChat", conditions: (module) => (module.OpenChatFlow) ? module.OpenChatFlow : null },
			{ id: "ChatUtilsSetArchive", conditions: (module) => (module.setArchive) ? module : null },
			{ id: "ChatState", conditions: (module) => (module.sendChatStateComposing) ? module : null },
			{ id: "WidFactory", conditions: (module) => (module.createWid) ? module : null },
			{ id: "isMDBackend", conditions: (module) => (module.isMDBackend) ? module : null },
			{ id: "PresenceUtils", conditions: (module) => (module.sendPresenceAvailable) ? module : null },
			{ id: "MediaPrep", conditions: (module) => (module && module.uploadProductImage && module.MediaPrep) ? module : null },
			{ id: "EventEmitter", conditions: (module) => (module.default && module.default.toString && module.default.toString().includes('Callback parameter passed is not a function')) ? module.default : null}, 
            { id: "MediaTypeFromProtobufModule", conditions: (module) => (module.mediaTypeFromProtobuf) ? module : null}, 
            { id: "TypeAttributeFromProtobufModule", conditions: (module) => (module.typeAttributeFromProtobuf) ? module : null},  
            { id: "ChatModel", conditions: (m) => {
                    var _a, _b, _c, _d, _e, _f;
                    const name = 'ChatModel', baseName = 'Chat', names = [baseName, baseName.replace(/^(\w)/, (l) => l.toLowerCase())]
                    if(names.includes(((_b = (_a = m.default) === null || _a === void 0 ? void 0 : _a.prototype) === null || _b === void 0 ? void 0 : _b.proxyName) ||
                        ((_d = (_c = m[name]) === null || _c === void 0 ? void 0 : _c.prototype) === null || _d === void 0 ? void 0 : _d.proxyName) ||
                        ((_f = (_e = m[baseName]) === null || _e === void 0 ? void 0 : _e.prototype) === null || _f === void 0 ? void 0 : _f.proxyName)))
                        {
                            return m.Chat;
                        }
                        return null;
            }},
            { id: "ContactModel", conditions: (m) => {
                    var _a, _b, _c, _d, _e, _f;
                    const name = 'ContactModel', baseName = 'Contact', names = [baseName, baseName.replace(/^(\w)/, (l) => l.toLowerCase())]
                    if(names.includes(((_b = (_a = m.default) === null || _a === void 0 ? void 0 : _a.prototype) === null || _b === void 0 ? void 0 : _b.proxyName) ||
                        ((_d = (_c = m[name]) === null || _c === void 0 ? void 0 : _c.prototype) === null || _d === void 0 ? void 0 : _d.proxyName) ||
                        ((_f = (_e = m[baseName]) === null || _e === void 0 ? void 0 : _e.prototype) === null || _f === void 0 ? void 0 : _f.proxyName)))
                        {
                            return m.default;
                        }
                        return null;
            }},
        ];
        
		window.findModule = function (searchMod) {
                for (let idx in modules) {
                    if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                        const keys = Object.keys(modules[idx]);
                        const src_ = keys.find(k => k.includes(searchMod));
                        if (src_) {
                            console.log(modules[idx])
                        }
                    }
                }
        }
		
		for (let idx in modules) {
            if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                neededObjects.forEach((needObj) => {
                    if (!needObj.conditions || needObj.foundedModule)
                        return;
                    let neededModule = needObj.conditions(modules[idx]);
                    if (neededModule !== null) {
                        foundCount++;
                        needObj.foundedModule = neededModule;
                    }
                });
    
                if (foundCount == neededObjects.length) {
                    break;
                }
            }
        }
    
        let neededStore = neededObjects.find((needObj) => needObj.id === "Store");
        window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
        neededObjects.splice(neededObjects.indexOf(neededStore), 1);
        neededObjects.forEach((needObj) => {
            if (needObj.foundedModule) {
                window.Store[needObj.id] = needObj.foundedModule;
            }
        });

        window.Store.Chat.modelClass.prototype.sendMessage = function (e) {
            window.Store.SendTextMsgToChat(this, ...arguments);
        }
        return window.Store;
    }

// =====================================================================================
// === INJEÇÃO DE DEPENDÊNCIAS ESSENCIAIS ===
// =====================================================================================

(function() {
    if (typeof window.Store === 'undefined' || Object.keys(window.Store).length === 0) {
        window.Store = {};
    }

    const findModule = (predicate, attempts = 10, interval = 1000) => new Promise((resolve) => {
        const check = () => {
            const modules = Object.values(window.webpackChunkwhatsapp_web_client || {}).flatMap(chunk => 
                Object.values(chunk.exports || {}).flatMap(exp => Object.values(exp)
            ));

            for (const m of modules) {
                if (m && typeof m.default === 'object' && predicate(m.default)) {
                    return resolve(m.default);
                }
                if (m && typeof m === 'object' && predicate(m)) {
                    return resolve(m);
                }
            }

            if (attempts-- > 0) {
                setTimeout(check, interval);
            } else {
                console.warn('Módulo do WhatsApp Store não encontrado após tentativas.');
                resolve(null);
            }
        };
        check();
    });

    findModule((m) => m.getMe && m.getUserWid).then(UserModule => {
        if (UserModule) {
            window.Store.User = UserModule;
        }
    });
    findModule((m) => m.createWid && m.isWid).then(WidFactoryModule => {
        if (WidFactoryModule) window.Store.WidFactory = WidFactoryModule;
    });
    findModule((m) => m.create && m.type).then(MsgModule => {
        if (MsgModule) window.Store.Msg = MsgModule;
    });
    findModule((m) => m.newId && m.fromString).then(MsgKeyModule => {
        if (MsgKeyModule) window.Store.MsgKey = MsgKeyModule;
    });
    findModule((m) => m.find && m.get).then(ChatModule => {
        if (ChatModule) window.Store.Chat = ChatModule;
    });
    findModule((m) => m.addAndSendMsgToChat).then(SendMsgModule => {
        if (SendMsgModule && SendMsgModule.addAndSendMsgToChat) {
            window.Store.addAndSendMsgToChat = SendMsgModule.addAndSendMsgToChat;
        }
    });
})();

// =====================================================================================
// === FIM DO BLOCO DE INJEÇÃO DE DEPENDÊNCIAS ===
// =====================================================================================
	
    getStore(modulesFactory);
	fixObjectsStore();
  }
}

const oldMakeStore = () => {
  console.log("Old script, TInject Community ", (Debug || {}).VERSION)
  if (!window.Store) {
    (function () {
        function getStore(modules) {
        let foundCount = 0;
        let neededObjects = [
                { id: "Store", conditions: (module) => (module.default && module.default.Chat && module.default.Msg) ? module.default : null},
				{ id: "Conn", conditions: (module) => (module.default && module.default.ref && module.default.refTTL) ? module.default : (module.Conn ? module.Conn : null)},
				{ id: "MediaCollection", conditions: (module) => (module.default && module.default.prototype && (module.default.prototype.processFiles !== undefined||module.default.prototype.processAttachments !== undefined)) ? module.default : null },
				{ id: "MediaProcess", conditions: (module) => (module.BLOB) ? module : null },
				{ id: "Archive", conditions: (module) => (module.setArchive) ? module : null },
				{ id: "Block", conditions: (module) => (module.blockContact && module.unblockContact) ? module : null },
				{ id: "ChatUtil", conditions: (module) => (module.sendClear) ? module : null },
				{ id: "GroupInvite", conditions: (module) => (module.sendQueryGroupInviteCode ) ? module : null },
				{ id: "Wap", conditions: (module) => (module.createGroup) ? module : null },
				{ id: "ServiceWorker", conditions: (module) => (module.default && module.default.killServiceWorker) ? module : null },
				{ id: "State", conditions: (module) => (module.STATE && module.STREAM) ? module : null },
				{ id: "_Presence", conditions: (module) => (module.setPresenceAvailable && module.setPresenceUnavailable) ? module : null },
				{ id: "WapDelete", conditions: (module) => (module.sendConversationDelete && module.sendConversationDelete.length == 2) ? module : null },
				{ id: 'FindChat', conditions: (module) => (module && module.findOrCreateLatestChat) ? module : null},
				{ id: "WapQuery", conditions: (module) => (module.queryExist) ? module : ((module.default && module.default.queryExist) ? module.default : null) },
				{ id: "WapQueryMD", conditions: (module) => (module.queryExists && module.queryPhoneExists) || (module.queryWidExists && module.queryPhoneExists) ? module : null},
				{ id: 'Perfil', conditions: (module) => module.__esModule === true && module.setPushname && !module.getComposeContents ? module : null},
				{ id: "CryptoLib", conditions: (module) => (module.decryptE2EMedia) ? module : null },
				{ id: "OpenChat", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.openChat) ? module.default : null },
				{ id: "UserConstructor", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null },
				{ id: "SendTextMsgToChat", conditions: (module) => (module.sendTextMsgToChat) ? module.sendTextMsgToChat : null },
				{ id: "ReadSeen", conditions: (module) => (module.sendSeen) ? module : null },
				{ id: "sendDelete", conditions: (module) => (module.sendDelete) ? module.sendDelete : null },
				{ id: "addAndSendMsgToChat", conditions: (module) => (module.addAndSendMsgToChat) ? module.addAndSendMsgToChat : null },
				{ id: "sendMsgToChat", conditions: (module) => (module.sendMsgToChat) ? module.sendMsgToChat : null },
				{ id: "Catalog", conditions: (module) => (module.Catalog) ? module.Catalog : null },
				{ id: "bp", conditions: (module) => (module.default && module.default.toString && module.default.toString().includes('bp_unknown_version')) ? module.default : null },
				{ id: "MsgKey", conditions: (module) => (module.default && module.default.toString && module.default.toString().includes('MsgKey error: obj is null/undefined')) ? module.default : null },
				{ id: "Parser", conditions: (module) => (module.convertToTextWithoutSpecialEmojis) ? module.default : null },
				{ id: "Builders", conditions: (module) => (module.TemplateMessage && module.HydratedFourRowTemplate) ? module : null },
				{ id: "Me", conditions: (module) => (module.PLATFORMS && module.Conn) ? module.default : null },
				{ id: "CallUtils", conditions: (module) => (module.sendCallEnd && module.parseCall) ? module : null },
				{ id: "Identity", conditions: (module) => (module.queryIdentity && module.updateIdentity) ? module : null },
				{ id: "MyStatus", conditions: (module) => (module.getStatus && module.setMyStatus) ? module : null },							
				{ id: "GroupActions", conditions: (module) => (module.sendExitGroup && module.localExitGroup) ? module : null },
				{ id: "Features", conditions: (module) => (module.FEATURE_CHANGE_EVENT && module.features) ? module : null },
				{ id: "MessageUtils", conditions: (module) => (module.storeMessages && module.appendMessage) ? module : null },
				{ id: "WebMessageInfo", conditions: (module) => (module.WebMessageInfo && module.WebFeatures) ? module.WebMessageInfo : null },
				{ id: "createMessageKey", conditions: (module) => (module.createMessageKey && module.createDeviceSentMessage) ? module.createMessageKey : null },
				{ id: "Participants", conditions: (module) => (module.addParticipants && module.removeParticipants && module.promoteParticipants && module.demoteParticipants) ? module : null },
				{ id: "Base", conditions: (module) => (module.setSubProtocol && module.binSend && module.actionNode) ? module : null },
				{ id: "Versions", conditions: (module) => (module.loadProtoVersions && module.default && module.default["15"] && module.default["16"] && module.default["17"]) ? module : null },
				{ id: "Sticker", conditions: (module) => (module.default && module.default.Sticker) ? module.default.Sticker : null },
				{ id: "MediaPrep", conditions: (module) => (module.default && module.default.MediaPrep) ? module.default : null },
				{ id: "UploadUtils", conditions: (module) => (module.default && module.default.encryptAndUpload) ? module.default : null },
				{ id: "linkPreview", conditions: (module) => (module.linkPreviewFromContactModel ? module : null)},
				{ id: 'Vcard', conditions: (module) => (module.vcardFromContactModel ? module : null)},
				{ id: 'Clock', conditions: (module) => (module.Clock ? module.Clock : null)},
				{ id: 'TemplateButtonCollection', conditions: (module) => (module.TemplateButtonCollectionImpl || module.TemplateButtonCollection ? module.TemplateButtonCollection : null)},
				{ id: 'ButtonCollection', conditions: (module) => (module.ButtonCollectionImpl || module.ButtonCollection ? module.ButtonCollection : null)},
				{ id: "MdCheck",	conditions: (module) => (module && module.isLegacyWebdBackend) ? module : null},
				{ id: "FeatureChecker", conditions: (module) => (module && module.getProtobufFeatureName) ? module : null },
				{ id: "GetMaybeMeUser", conditions: (module) => (module && module.getMaybeMeUser) ? module : null },
				{ id: "QueryExist", conditions: (module) => (module.queryExist) ? module : null },
				{ id: "OpenChat", conditions: (module) => (module.OpenChatFlow) ? module.OpenChatFlow : null },
				{ id: "ChatUtilsSetArchive", conditions: (module) => (module.setArchive) ? module : null },
				{ id: "ChatState", conditions: (module) => (module.sendChatStateComposing) ? module : null },
				{ id: "WidFactory", conditions: (module) => (module.createWid) ? module : null },
				{ id: "isMDBackend", conditions: (module) => (module.isMDBackend) ? module : null },
				{ id: "PresenceUtils", conditions: (module) => (module.sendPresenceAvailable) ? module : null },
				{ id: "MediaPrep", conditions: (module) => (module && module.uploadProductImage && module.MediaPrep) ? module : null },
				{ id: "EventEmitter", conditions: (module) => (module.default && module.default.toString && module.default.toString().includes('Callback parameter passed is not a function')) ? module.default : null}, 
                { id: "MediaTypeFromProtobufModule", conditions: (module) => (module.mediaTypeFromProtobuf) ? module : null}, 
                { id: "TypeAttributeFromProtobufModule", conditions: (module) => (module.typeAttributeFromProtobuf) ? module : null},  
                { id: "ChatModel", conditions: (m) => {
                    var _a, _b, _c, _d, _e, _f;
                    const name = 'ChatModel', baseName = 'Chat', names = [baseName, baseName.replace(/^(\w)/, (l) => l.toLowerCase())]
                    if(names.includes(((_b = (_a = m.default) === null || _a === void 0 ? void 0 : _a.prototype) === null || _b === void 0 ? void 0 : _b.proxyName) ||
                        ((_d = (_c = m[name]) === null || _c === void 0 ? void 0 : _c.prototype) === null || _d === void 0 ? void 0 : _d.proxyName) ||
                        ((_f = (_e = m[baseName]) === null || _e === void 0 ? void 0 : _e.prototype) === null || _f === void 0 ? void 0 : _f.proxyName)))
                        {
                            return m.Chat;
                        }
                        return null;
                }},
                { id: "ContactModel", conditions: (m) => {
                    var _a, _b, _c, _d, _e, _f;
                    const name = 'ContactModel', baseName = 'Contact', names = [baseName, baseName.replace(/^(\w)/, (l) => l.toLowerCase())]
                    if(names.includes(((_b = (_a = m.default) === null || _a === void 0 ? void 0 : _a.prototype) === null || _b === void 0 ? void 0 : _b.proxyName) ||
                        ((_d = (_c = m[name]) === null || _c === void 0 ? void 0 : _c.prototype) === null || _d === void 0 ? void 0 : _d.proxyName) ||
                        ((_f = (_e = m[baseName]) === null || _e === void 0 ? void 0 : _e.prototype) === null || _f === void 0 ? void 0 : _f.proxyName)))
                        {
                            return m.default;
                        }
                        return null;
                }},
            ];
			
		window.findModule = function (searchMod) {
                for (let idx in modules) {
                    if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                        const keys = Object.keys(modules[idx]);
                        const src_ = keys.find(k => k.includes(searchMod));
                        if (src_) {
                            console.log(modules[idx])
                        }
                    }
                }
            }
        
		for (let idx in modules) {
            if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                neededObjects.forEach((needObj) => {
                    if (!needObj.conditions || needObj.foundedModule)
                        return;
                    let neededModule = needObj.conditions(modules[idx]);
                    if (neededModule !== null) {
                        foundCount++;
                        needObj.foundedModule = neededModule;
                    }
                });

                if (foundCount == neededObjects.length) {
                    break;
                }
            }
        }

        let neededStore = neededObjects.find((needObj) => needObj.id === "Store");
        window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
        neededObjects.splice(neededObjects.indexOf(neededStore), 1);
        neededObjects.forEach((needObj) => {
            if (needObj.foundedModule) {
                window.Store[needObj.id] = needObj.foundedModule;
            }
        });
        
        window.Store.Chat.modelClass.prototype.sendMessage = function (e) {
            window.Store.SendTextMsgToChat(this, ...arguments);
        }       
        
        return window.Store;
    }

// =====================================================================================
// === INJEÇÃO DE DEPENDÊNCIAS ESSENCIAIS ===
// =====================================================================================

(function() {
    if (typeof window.Store === 'undefined' || Object.keys(window.Store).length === 0) {
        window.Store = {};
    }

    const findModule = (predicate, attempts = 10, interval = 1000) => new Promise((resolve) => {
        const check = () => {
            const modules = Object.values(window.webpackChunkwhatsapp_web_client || {}).flatMap(chunk => 
                Object.values(chunk.exports || {}).flatMap(exp => Object.values(exp)
            ));
            for (const m of modules) {
                if (m && typeof m.default === 'object' && predicate(m.default)) return resolve(m.default);
                if (m && typeof m === 'object' && predicate(m)) return resolve(m);
            }
            if (attempts-- > 0) setTimeout(check, interval);
            else { console.warn('Módulo do WhatsApp Store não encontrado.'); resolve(null); }
        };
        check();
    });

    findModule((m) => m.getMe && m.getUserWid).then(UserModule => { if (UserModule) window.Store.User = UserModule; });
    findModule((m) => m.createWid && m.isWid).then(m => { if (m) window.Store.WidFactory = m; });
    findModule((m) => m.create && m.type).then(m => { if (m) window.Store.Msg = m; });
    findModule((m) => m.newId && m.fromString).then(m => { if (m) window.Store.MsgKey = m; });
    findModule((m) => m.find && m.get).then(m => { if (m) window.Store.Chat = m; });
    findModule((m) => m.addAndSendMsgToChat).then(m => { if (m?.addAndSendMsgToChat) window.Store.addAndSendMsgToChat = m.addAndSendMsgToChat; });
})();

// =====================================================================================
// === FIM DO BLOCO DE INJEÇÃO DE DEPENDÊNCIAS ===
// =====================================================================================

        if (typeof webpackJsonp === 'function') {
            webpackJsonp([], {'parasite': (x, y, z) => getStore(z)}, ['parasite']);
        } else {
            let tag = new Date().getTime();
            webpackChunkwhatsapp_web_client.push([
                ["parasite" + tag],
                {},
                function (o, e, t) {
                    let modules = [];
                    for (let idx in o.m) {
                        let module = o(idx);
                        modules.push(module);
                    }
                    getStore(modules);
                }
            ]);
        }

    })();
  }
}


const chooseFunction = () => {
  versionString = (Debug || {}).VERSION;
  versionNumber = parseFloat(versionString);
  comparisonNumber = 2.3;
    return (versionNumber >= comparisonNumber) ? newMakeStore() : oldMakeStore()
}

chooseFunction();
 
window.WAPI = {};
window._WAPI = {};
window.WAPI.nop = () => { }

window.WAPI._serializeRawObj = (obj) => {
    if (obj && obj.toJSON) {
        return obj.toJSON();
    }
    return {}
};

window.WAPI._serializeChatObj = (obj) => {
    if (obj == undefined) return null;
    return Object.assign(window.WAPI._serializeRawObj(obj), {
        kind: obj.kind,
        isGroup: obj.isGroup,
        formattedTitle: obj.formattedTitle,
        contact: obj['contact'] ? window.WAPI._serializeContactObj(obj['contact']) : null,
        groupMetadata: obj["groupMetadata"] ? window.WAPI._serializeRawObj(obj["groupMetadata"]) : null,
        presence: obj["presence"] ? window.WAPI._serializeRawObj(obj["presence"]) : null,
        msgs: null
    });
};

window.WAPI._serializeContactObj = (obj) => {
    if (obj == undefined) return null;
	let profilePhoto = window.Store.ProfilePicThumb?._index?.[obj.__x_id?._serialized]?.__x_imgFull ?? {};
    return Object.assign(window.WAPI._serializeRawObj(obj), {
		id: obj.id._serialized,
        formattedName: obj.formattedName,
        isHighLevelVerified: obj.isHighLevelVerified,
        isMe: obj.isMe,
        isMyContact: obj.isMyContact,
        isPSA: obj.isPSA,
        isUser: obj.isUser,
        isVerified: obj.isVerified,
        isWAContact: obj.isWAContact,
        profilePicThumb: profilePhoto,
		statusMute: obj.statusMute,
        msgs: null
    });
};

window.WAPI._serializeMessageObj = (obj) => {
    if (obj == undefined) return null;
	const _chat = obj['chat'] ? WAPI._serializeChatObj(obj['chat']) : {};
    return Object.assign(window.WAPI._serializeRawObj(obj), {
        id: obj.id._serialized,
		quotedParticipant: obj.quotedParticipant?.._serialized,
        author: obj.author?._serialized,
        chatId: obj.chatId?._serialized,
        to: obj.to?._serialized,
        fromMe: obj.id.fromMe,
		sender: obj["senderObj"] ? WAPI._serializeContactObj(obj["senderObj"]) : null,
        timestamp: obj["t"],
        content: obj["body"],
        isGroupMsg: obj.isGroupMsg,
        isLink: obj.isLink,
        isMMS: obj.isMMS,
        isMedia: obj.isMedia,
        isNotification: obj.isNotification,
        isPSA: obj.isPSA,
        type: obj.type,
        chat: _chat,
        isOnline: _chat.isOnline,
        lastSeen: _chat.lastSeen,
        chatId: obj.id.remote,
        quotedMsgObj: WAPI._serializeMessageObj(obj['_quotedMsgObj']),
        mediaData: window.WAPI._serializeRawObj(obj['mediaData']),
        reply: body => window.WAPI.reply(_chat.id._serialized, body, obj)
    });
};

window.WAPI._serializeNumberStatusObj = (obj) => {
    if (obj == undefined) return null;
    return Object.assign({}, {
        id: obj.jid,
        status: obj.status,
        isBusiness: (obj.biz === true),
        canReceiveMessage: (obj.status === 200)
    });
};

window.WAPI._serializeNumberStatusObjMD = (obj) => {
    if (obj == undefined) return null;
	let awid = false;
	var _awid = "" + obj.wid + "";
	awid = _awid.length > 0;
    return Object.assign({}, { id: obj.wid, status: awid });
};

window.WAPI._serializeProfilePicThumb = (obj) => {
    if (obj == undefined) return null;
    return Object.assign({}, {
        eurl: obj.eurl, id: obj.id, img: obj.img,
		imgFull: obj.__x_imgFull, raw: obj.raw, tag: obj.tag
    });
}

function getMeWid() {
    if (Store.User && typeof Store.User.getMaybeMeUser === 'function') return Store.User.getMaybeMeUser();
    if (Store.Conn && Store.Conn.me) return Store.Conn.me;
    throw new Error('Não foi possível obter o wid do usuário logado');
}

function createWidSafe(id) {
    try {
        if (window.WidFactory?.createWid) return WidFactory.createWid(id);
        return assertWid(id);
    } catch (e) { return null; }
}

function getMeWidSilent() {
    try { return Store.User.getMeUser()?.wid || null; } catch (e) { return null; }
}

window.WAPI.createGroup = async function (groupName, participantsIds) {
    try {
        if (!groupName) return null;
        if (!Array.isArray(participantsIds)) participantsIds = [participantsIds];
        const meWid = getMeWidSilent();
        if (!meWid) return null;
        const participants = participantsIds.map(createWidSafe).filter(wid => wid && !wid.equals(meWid));
        if (!participants.length) return null;
        const result = await Store.GroupMetadata.create(groupName, participants);
        if (!result?.id) return null;
        const gid = result.id.toString();
        const users = {};
        (result.participants || []).forEach(p => {
            const wid = p.id?.toString?.();
            if (!wid) return;
            users[wid] = { wid, code: p.error ? Number(p.error) : 200, invite_code: p.invite_code || null, invite_code_exp: Number(p.invite_code_exp) || null };
        });
        return { gid, participants: users };
    } catch (e) { return null; }
};

window.WAPI.leaveGroup = function(groupId) {
    groupId = typeof groupId == "string" ? groupId : groupId._serialized;
    var group = WAPI.getChat(groupId);
    return Store.GroupActions.sendExitGroup(group);
};

window.WAPI.getAllContacts = function(done) {
    const contacts = window.Store.Contact.map((contact) => WAPI._serializeContactObj(contact));
    if (done !== undefined) done(contacts);
    SetConsoleMessage("getAllContacts", JSON.stringify(contacts));
    return contacts;
};

window.WAPI.getMyContacts = function(done) {
    const contacts = window.Store.Contact.filter((contact) => contact.isMyContact === true).map((contact) => WAPI._serializeContactObj(contact));
    if (done !== undefined) done(contacts);
    return contacts;
};

window.WAPI.getContact = function(id, done) {
    const found = window.Store.Contact.get(id);
    if (done !== undefined) done(window.WAPI._serializeContactObj(found));
    return window.WAPI._serializeContactObj(found);
};

window.WAPI.getAllChats = function(done) {
    const chats = window.Store.Chat.map((chat) => WAPI._serializeChatObj(chat));
    if (done !== undefined) done(chats);
    SetConsoleMessage("getAllChats", JSON.stringify(chats));
    return chats;
};

window.WAPI.haveNewMsg = function(chat) { return chat.unreadCount > 0; };

window.WAPI.getAllChatsWithNewMsg = function(done) {
    const chats = window.Store.Chat.filter(window.WAPI.haveNewMsg).map((chat) => WAPI._serializeChatObj(chat));
    if (done !== undefined) done(chats);
    return chats;
};

window.WAPI.getAllChatIds = function(done) {
    const chatIds = window.Store.Chat.map((chat) => chat.id._serialized || chat.id);
    if (done !== undefined) done(chatIds);
    return chatIds;
};

window.WAPI.getAllNewMessages = async function () {
    return JSON.stringify(WAPI.getAllChatsWithNewMsg().map(c => WAPI.getChat(c.id._serialized)).map(c => c.msgs._models.filter(x => x.isNewMsg)) || [])
}

window.WAPI.getAllGroups = function(done) {
    try {
			if (!window.Store || !window.Store.GroupMetadata) { console.error("Store.GroupMetadata não disponível."); return; }
			let groups = window.Store.GroupMetadata || [];
			if (groups.length === 0) { console.warn("Nenhum grupo encontrado."); return; }
			const listGroups = groups.map(group => ({ id: group.id || "ID não disponível", subject: group.subject || "Sem título" }));
			if (done !== undefined) done(listGroups);
			SetConsoleMessage("getAllGroups", JSON.stringify(listGroups));
	} catch(e) { console.log(e); }
};

window.WAPI.getAllGroupsList = function(done) {
    const contacts = window.Store.Contact.map((contact) => WAPI._serializeContactObj(contact));
    if (done !== undefined) done(contacts);
    SetConsoleMessage("getAllGroups", JSON.stringify(contacts));
    return contacts;
};

window.WAPI.sendChatstate = async function (state, chatId) {
   switch(state) {
		case 0: await window.Store.ChatStates.sendChatStateComposing(chatId); break;
		case 1: await window.Store.ChatStates.sendChatStateRecording(chatId); break;
		case 2: await window.Store.ChatStates.sendChatStatePaused(chatId); break;
		default: return false;
    }
    return true;
};

window.WAPI.getChat = function (id) {
    id = typeof id == "string" ? id : id._serialized;
    const found = window.Store.Chat.get(id);
    if (found) found.sendMessage = (found.sendMessage) ? found.sendMessage : function () { return window.Store.sendMessage.apply(this, arguments); };
    return found;
}

window.WAPI.getChatByName = function(name, done) {
    const found = window.Store.FindChat.findOrCreateLatestChat((chat) => chat.name === name);
    if (done !== undefined) done(found);
    return found;
};

window.WAPI.getGeneratedUserAgent = function (useragent) {
    if (!useragent.includes('WhatsApp')) return 'WhatsApp/0.4.315 ' + useragent;
    return useragent.replace(useragent.match(/WhatsApp\/([.\d])*/g)[0].match(/[.\d]*/g).find(x => x), window.Debug.VERSION);
}

window.WAPI.getWAVersion = function () { return window.Debug.VERSION; }

window.WAPI.getNewId = function() {
    var text = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

window.WAPI.getChatById = function(id, done) {
    let found = WAPI.getChat(id);
    if (found) found = WAPI._serializeChatObj(found); else found = false;
    if (done !== undefined) done(found);
    return found;
};

window.WAPI.getUnreadMessagesInChat = function(id, includeMe, includeNotifications, done) {
    let chat = WAPI.getChat(id);
    let messages = chat.msgs._models;
    let output = [];
    for (let i = messages.length - 1; i >= 0; i--) {
        if (i === "remove") continue;
        let messageObj = messages[i];
        if (typeof(messageObj.isNewMsg) !== "boolean" || messageObj.isNewMsg === false) continue;
        messageObj.isNewMsg = false;
        let message = WAPI.processMessageObj(messageObj, includeMe, includeNotifications);
        if (message) output.push(message);
    }
    if (done !== undefined) done(output);
    return output;
};

window.WAPI.loadEarlierMessages = function(id, done) {
    const found = WAPI.getChat(id);
    if (done !== undefined) found.loadEarlierMsgs().then(function() { done() });
    else found.loadEarlierMsgs();
};

window.WAPI.loadAllEarlierMessages = function(id, done) {
    const found = WAPI.getChat(id);
    x = function() {
        if (!found.msgs.msgLoadState.noEarlierMsgs) found.loadEarlierMsgs().then(x);
        else if (done) done();
    };
    x();
};

window.WAPI.asyncLoadAllEarlierMessages = function(id, done) { done(); window.WAPI.loadAllEarlierMessages(id); };

window.WAPI.areAllMessagesLoaded = function(id, done) {
    const found = WAPI.getChat(id);
    if (!found.msgs.msgLoadState.noEarlierMsgs) { if (done) done(false); return false; }
    if (done) done(true);
    return true;
};

window.WAPI.loadEarlierMessagesTillDate = function(id, lastMessage, done) {
    const found = WAPI.getChat(id);
    x = function() {
        if (found.msgs.models[0].t > lastMessage) found.loadEarlierMsgs().then(x);
        else done();
    };
    x();
};

window.WAPI.getAllGroupMetadata = function(done) {
    const groupData = window.Store.GroupMetadata.map((groupData) => groupData.all);
    if (done !== undefined) done(groupData);
    return groupData;
};

window.WAPI.getGroupMetadata = async function (id) { return window.Store.GroupMetadata.find(id); };

window.WAPI._getGroupParticipants = async function(id) {
    const metadata = await WAPI.getGroupMetadata(id);
    return metadata.participants;
};

window.WAPI.getGroupParticipantIDs = async function(id, done) {
    const output = (await WAPI._getGroupParticipants(id)).map((participant) => participant.id);
    if (done !== undefined) done(output);
	getAllGroupContacts(JSON.stringify(output));
    return output;
};

window.WAPI.getGroupAdmins = async function(id, done) {
    const output = (await WAPI._getGroupParticipants(id)).filter((participant) => participant.isAdmin).map((admin) => admin.id);
    if (done !== undefined) done(output);
	let arrGroupAdm = [];
	output.forEach((v, i) => arrGroupAdm.push(output[i]['_serialized']));
	SetConsoleMessage("getAllGroupAdmins", JSON.stringify(arrGroupAdm));
    return output;
};

window.WAPI.getMe = function(done) {
    const rawMe = window.Store.Contact.get(window.Store.Conn.me);
    if (done !== undefined) done(rawMe.all);
    return rawMe.all;
};

window.WAPI.isLoggedIn = function(done) {
	const isLogged = window.Store.Contact || window.Store.Contact._contactHashes !== undefined;
    if (done !== undefined) done(isLogged);
    return isLogged;
};

window.WAPI.isConnected = function (done) {
    const isConnected = document.querySelector('*[data-icon="alert-phone"]') !== null ? false : true;
    if (done !== undefined) done(isConnected);
	SetConsoleMessage("GetCheckIsConnected", JSON.stringify(isConnected));
    return isConnected;
};

window.WAPI.getProfilePicFromServer = function (id) {
	return Store.WapQuery.profilePicFind(id).then(x => console.log(x.eurl));
}

window.WAPI.getProfilePicSmallFromId = async function (id) {
    return await window.Store.ProfilePicThumb.find(id).then(async d=> {
        if (d.img !== undefined) return await window.WAPI.downloadFileWithCredentials(d.img);
        else return false;
    }, function (e) { return false; });
};

window.WAPI.extractRealNumberFromContact = function (info) {
    let contact = Store.Contact.get(info.id);
	if (!contact) return null;
    if (contact.__x_phoneNumber && contact.__x_phoneNumber._serialized) return contact.__x_phoneNumber;
    if (contact.phoneNumber && contact.phoneNumber._serialized) return contact.phoneNumber;
    if (contact.id && contact.id._serialized && contact.id._serialized.endsWith("@c.us")) return contact.id;
    return null;
};

window.WAPI.processMessageObj = function(messageObj, includeMe, includeNotifications) {
    if (messageObj.isNotification) {
        if (includeNotifications) return WAPI._serializeMessageObj(messageObj);
        else return;
    } else if (messageObj.id.fromMe === false || includeMe) {
        return WAPI._serializeMessageObj(messageObj);
    }
    return;
};

window.WAPI.getAllMessagesInChat = function(id, includeMe, includeNotifications, done) {
    const chat = WAPI.getChat(id);
    let output = [];
    const messages = chat.msgs._models;
    for (const i in messages) {
        if (i === "remove") continue;
        let message = WAPI.processMessageObj(messages[i], includeMe, false);
        if (message) output.push(message);
    }
    if (done !== undefined) done(output);
    return output;
};

window.WAPI.getAllMessageIdsInChat = function(id, includeMe, includeNotifications, done) {
    const chat = WAPI.getChat(id);
    let output = [];
    const messages = chat.msgs._models;
    for (const i in messages) {
        if ((i === "remove") || (!includeMe && messages[i].isMe) || (!includeNotifications && messages[i].isNotification)) continue;
        output.push(messages[i].id._serialized);
    }
    if (done !== undefined) done(output);
    return output;
};

window.WAPI.getMessageById = function(id, done) {
    let result = false;
    try {
        let msg = window.Store.Msg.get(id);
        if (msg) result = WAPI.processMessageObj(msg, true, true);
    } catch (err) {}
    if (done !== undefined) done(result);
    else return result;
};

window.WAPI.sendSeen = async function (chatId) {
    try {
        if (!chatId) return false;
        let normalizedChatId = chatId;
        if (chatId.includes('@lid')) {
            const lidMatch = chatId.match(/^(\d+)@lid/);
            if (lidMatch?.[1]) normalizedChatId = lidMatch[1] + '@c.us';
        }
        if (!normalizedChatId.includes('@c.us') && !normalizedChatId.includes('@g.us')) {
            if (/^\d+$/.test(normalizedChatId)) normalizedChatId = normalizedChatId + '@c.us';
        }

        let chat = null;
        const searchPaths = [
            () => window.Store.Chat.get(normalizedChatId),
            () => window.Store.Chat.get(chatId),
            () => { try { const wid = window.Store.WidFactory?.createWid?.(normalizedChatId); return wid ? window.Store.Chat.get(wid) : null; } catch { return null; } },
            () => {
                try {
                    const wid = window.Store.WidFactory?.createWid?.(normalizedChatId);
                    if (!wid) return null;
                    return new Promise(resolve => {
                        window.Store.FindChat.findOrCreateLatestChat(wid)
                            .then(result => resolve(result.chat || result))
                            .catch(() => resolve(null));
                    });
                } catch { return null; }
            },
            () => (window.Store.Chat.models || []).find(c => {
                const cid = c.id?._serialized || c.id || '';
                return cid === normalizedChatId || cid === chatId || cid.includes(chatId.replace('@lid', ''));
            }),
        ];

        for (const tryFind of searchPaths) {
            try {
                const r = tryFind();
                const result = (r && typeof r === 'object' && 'then' in r) ? await r : r;
                if (result) { chat = result; break; }
            } catch (e) {}
        }

        if (!chat) return false;

        chat.unreadCount = 0;
        if (chat.msgs?._models) chat.msgs._models.forEach(msg => { if (msg) { msg.isNewMsg = false; msg.__x_isNewMsg = false; msg._isNewMsg = false; } });

        let serverMarked = false;
        if (window.Store.ReadSeen?.sendSeen) { try { await window.Store.ReadSeen.sendSeen(chat, true); serverMarked = true; } catch (e) {} }
        if (!serverMarked && window.Store.SendSeen?.sendSeen) { try { await window.Store.SendSeen.sendSeen(chat); serverMarked = true; } catch (e) {} }
        if (!serverMarked && typeof chat.sendSeen === 'function') { try { await chat.sendSeen(); serverMarked = true; } catch (e) {} }

        setTimeout(() => { try { if (chat.trigger) { chat.trigger('change:unreadCount', 0); chat.trigger('change'); } } catch (e) {} }, 100);

        return { success: true, serverMarked, chatId: chat.id?._serialized || chat.id, originalChatId: chatId };
    } catch (error) {
        return { success: false, serverMarked: false, error: error.message, originalChatId: chatId };
    }
};

window.WAPI.normalizeChatId = function(chatId) {
    if (!chatId) return null;
    if (chatId.includes('@c.us') || chatId.includes('@g.us')) return chatId;
    if (chatId.includes('@lid')) return chatId.split('@')[0] + '@c.us';
    if (/^\d+$/.test(chatId)) return chatId + '@c.us';
    return chatId;
};

window.WAPI.markUnRead = async function (id) {
    if (!id) return false;
    var chat = window.WAPI.getChat(id);
    if (chat !== undefined) { await Store.ReadSeen.markUnread(chat, true); return true; }
    return false;
};

window.WAPI.getUnreadMessages = function(includeMe, includeNotifications, use_unread_count, done) {
    const chats = window.Store.Chat._models;
    let output = [];
    for (let chat in chats) {
        if (isNaN(chat)) continue;
        let messageGroupObj = chats[chat];
        let messageGroup = WAPI._serializeChatObj(messageGroupObj);
        messageGroup.messages = [];
		if (messageGroup.id._serialized.includes('@lid')) {
			messageGroup.id = WAPI.extractRealNumberFromContact(messageGroup.contact);
		}
        const messages = messageGroupObj.msgs._models;
        for (let i = messages.length - 1; i >= 0; i--) {
            let messageObj = messages[i];
            if (typeof(messageObj.isNewMsg) != "boolean" || messageObj.isNewMsg === false) continue;
            messageObj.isNewMsg = false;
            let message = WAPI.processMessageObj(messageObj, includeMe, false);
            if (message) {
				message.chatId = messageGroup.id;
				message.from   = messageGroup.id;
				message.sender.id = messageGroup.id;
                messageGroup.messages.push(message);
            }
        }
        if (messageGroup.messages.length > 0) {
            output.push(messageGroup);
        } else {
            if (use_unread_count) {
                let n = messageGroupObj.unreadCount;
                for (let i = messages.length - 1; i >= 0; i--) {
                    let messageObj = messages[i];
                    if (n > 0) {
                        if (!messageObj.fromMe) {
                            let message = WAPI.processMessageObj(messageObj, includeMe, includeNotifications);
                            messageGroup.messages.unshift(message);
                            n -= 1;
                        }
                    } else if (n === -1) {
                        if (!messageObj.fromMe) {
                            let message = WAPI.processMessageObj(messageObj, includeMe, includeNotifications);
                            messageGroup.messages.unshift(message);
                            break;
                        }
                    } else { break; }
                }
                if (messageGroup.messages.length > 0) {
                    messageGroupObj.unreadCount = 0;
                    output.push(messageGroup);
                }
            }
        }
    }
    if (done !== undefined) done(output);
    SetConsoleMessage("getUnreadMessages", JSON.stringify(output));
    return output;
};

window.WAPI.getGroupOwnerID = async function(id, done) {
    const output = (await WAPI.getGroupMetadata(id)).owner.id;
    if (done !== undefined) done(output);
    SetConsoleMessage("getGroupOwnerID", JSON.stringify(output));
    return output;
};

window.WAPI.getProfilePicSmallFromId = function(id, done) {
    window.Store.ProfilePicThumb.find(id).then(function(d) {
        if (d.img !== undefined) window.WAPI.downloadFileWithCredentials(d.img, done);
        else done(false);
    }, function(e) { done(false); });
};

window.WAPI.getProfilePicFromId = function(id, done) {
    window.Store.ProfilePicThumb.find(id).then(function(d) {
        if (d.imgFull !== undefined) window.WAPI.downloadFileWithCredentials(d.imgFull, done);
        else done(false);
    }, function(e) { done(false); });
};

window.WAPI.downloadFileWithCredentials = function(url, done) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                let reader = new FileReader();
                reader.readAsDataURL(xhr.response);
                reader.onload = function(e) { done(reader.result.substr(reader.result.indexOf(',') + 1)); };
            } else { console.error(xhr.statusText); }
        }
    };
    xhr.open("GET", url, true);
    xhr.withCredentials = true;
    xhr.responseType = 'blob';
    xhr.send(null);
};

window.WAPI.downloadFile = function(url, done) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                let reader = new FileReader();
                reader.readAsDataURL(xhr.response);
                reader.onload = function(e) { done(reader.result.substr(reader.result.indexOf(',') + 1)); };
            } else { console.error(xhr.statusText); }
        }
    };
    xhr.open("GET", url, true);
    xhr.responseType = 'blob';
    xhr.send(null);
};

window.WAPI.getBatteryLevel = function(done) {
    if (window.Store.Conn.plugged) {
        if (done !== undefined) done(100);
        return SetConsoleMessage("getBatteryLevel", JSON.stringify(100));
    }
    let output = window.Store.Conn.battery;
    if (done !== undefined) done(output);
    SetConsoleMessage("getBatteryLevel", JSON.stringify(output));
    return output;
};

window.WAPI.deleteMessage = function(chatId, messageArray, revoke = false, done) {
    let userId = new window.Store.UserConstructor(chatId, { intentionallyUsePrivateConstructor: true });
    let conversation = WAPI.getChat(userId);
    if (!conversation) { if (done !== undefined) done(false); return false; }
    if (!Array.isArray(messageArray)) messageArray = [messageArray];
    if (revoke) conversation.sendRevokeMsgs(messageArray, conversation);
    else conversation.sendDeleteMsgs(messageArray, conversation);
    if (done !== undefined) done(true);
    return true;
};

window.WAPI.base64ImageToFile = function(b64Data, filename) {
    var arr = b64Data.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
};

window.WAPI.getNewMessageId = function(chatId) {
    var newMsgId = Store.Msg._models[0].__x_id.clone();
    newMsgId.fromMe = true;
    newMsgId.id = WAPI.getNewId().toUpperCase();
    newMsgId.remote = chatId;
    newMsgId._serialized = `${newMsgId.fromMe}_${newMsgId.remote}_${newMsgId.id}`;
    return newMsgId;
};

window.WAPI.sendMessage = function(id, message, done) {
    var chat = WAPI.getChat(id);
    if (chat !== undefined) {
        if (done !== undefined) {
            chat.sendMessage(message).then(function() {
                var trials = 0;
                function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
                function check() {
                    for (let i = chat.msgs.models.length - 1; i >= 0; i--) {
                        let msg = chat.msgs.models[i];
                        if (!msg.senderObj.isMe || msg.body != message) continue;
                        done(WAPI._serializeMessageObj(msg));
                        return true;
                    }
                    trials += 1;
                    if (trials > 30) { done(true); return; }
                    sleep(500).then(check);
                }
                check();
            });
            return true;
        } else {
            chat.sendMessage(message);
            return true;
        }
    } else {
        if (done !== undefined) done(false);
        return false;
    }
};

window.WAPI.setMyName = async function (newName) { return await window.Store.Perfil.setPushname(newName); }
window.WAPI.clearChat = async function (id) { return await Store.ChatUtil.sendClear(Store.Chat.get(id), true); }
window.WAPI.setMyStatus = function (newStatus) { return Store.MyStatus.setMyStatus(newStatus); }

window.WAPI.revokeGroupInviteLink = async function (chatId) {
    var chat = Store.Chat.get(chatId);
    if (!chat.isGroup) return false;
    await Store.GroupInvite.revokeGroupInvite(chat);
    return true;
};

function SetConsoleMessageString(jsName, StringValue) {
    Obj = { name: jsName, result: StringValue };
    console.log(JSON.stringify(Obj));
}

window.WAPI.getGroupInviteLink = async function (chatId) {
    let chat = Store.Chat.get(chatId);
	let code = chat.groupMetadata?.inviteCode || await Store.GroupInvite.sendQueryGroupInviteCode(chat.id);
    SetConsoleMessageString("GetGroupInviteLink", `https://chat.whatsapp.com/${code}`);
	return `https://chat.whatsapp.com/${code}`;
};

window.WAPI.getMe = function(){
	vMe = {...WAPI.quickClean({ ...Store.Contact.get(Store.Me.wid).attributes, ...Store.Me.attributes }), me: Store.Me.me};
  SetConsoleMessage("GetMe", JSON.stringify(vMe)); 
  return vMe;
}

window.WAPI.getStatus = async (id) => {
	SetConsoleMessage("GetStatusMessage", JSON.stringify(await Store.MyStatus.getStatus(id)));	  
}

window.WAPI.checkNumberStatus = async function (id) {
    try {
        let isMd = true, result;
		try { result = await window.Store.WapQueryMD.queryPhoneExists(id); } catch(e) { isMd = false; }
		result = isMd ? result : await window.Store.WapQuery.queryPhoneExists(id);
		let data = isMd ? window.WAPI._serializeNumberStatusObjMD(result) : window.WAPI._serializeNumberStatusObj(result);
		if (isMd) SetConsoleMessage("NewCheckIsValidNumber", JSON.stringify({ id: data.id, valid: data.status }));
		else SetConsoleMessage("NewCheckIsValidNumber", JSON.stringify({ id: id, valid: data.canReceiveMessage }));
	    return data;
    } catch (e) {
		SetConsoleMessage("NewCheckIsValidNumber", JSON.stringify({ id: id, valid: false }));
		return window.WAPI._serializeNumberStatusObj({ status: e, jid: id });
    }
};

window.WAPI.checkNumberStatusIsolate = async function (id) {
    try {
        let isMd = true, result;
		try { result = await window.Store.WapQueryMD.queryPhoneExists(id); } catch(e) { isMd = false; }
		result = isMd ? result : await window.Store.WapQuery.queryPhoneExists(id);
		return isMd ? window.WAPI._serializeNumberStatusObjMD(result) : window.WAPI._serializeNumberStatusObj(result);
    } catch (e) {
		return window.WAPI._serializeNumberStatusObj({ status: e, jid: id });
    }
};

window.WAPI.joinGroupViaLink = async function(link) {
    let code = link;
    if (link.includes('chat.whatsapp.com')) {
        if (!link.match(/chat.whatsapp.com\/([\w\d]*)/g)?.length) return false;
        code = link.match(/chat.whatsapp.com\/([\w\d]*)/g)[0].replace('chat.whatsapp.com\/', '');
    }
	const group = await Store.GroupInvite.sendJoinGroupViaInvite(code);
    if (!group.id) return false;
    return group.id._serialized;
};

window.WAPI.addParticipant = async function (idGroup, idParticipant) {
    const chat = Store.Chat.get(idGroup);
    const add = Store.Contact.get(idParticipant);
    await window.Store.Participants.addParticipants(chat, [add]);
    return true;
};

window.WAPI.removeParticipant = async function(idGroup, idParticipant) {
	const chat = Store.Chat.get(idGroup);
    const rm = chat.groupMetadata.participants.get(idParticipant);
    await window.Store.Participants.removeParticipants(chat, [rm]);
    return true;
};

window.WAPI.demoteParticipant = async function (idGroup, idParticipant) {
    await window.Store.WapQuery.demoteParticipants(idGroup, [idParticipant]);
    const chat = Store.Chat.get(idGroup);
    const demote = chat.groupMetadata.participants.get(idParticipant);
    await window.Store.Participants.demoteParticipants(chat, [demote]);
    return true;
};

window.WAPI.quickClean = function (ob) { return JSON.parse(JSON.stringify(ob)); };

// ── Observador de novas mensagens ────────────────────────────────────────────

window.WAPI._newMessagesQueue = [];
window.WAPI._newMessagesBuffer = (sessionStorage.getItem('saved_msgs') != null) ? JSON.parse(sessionStorage.getItem('saved_msgs')) : [];
window.WAPI._newMessagesDebouncer = null;
window.WAPI._newMessagesCallbacks = [];

window.Store.Msg.off('add');
sessionStorage.removeItem('saved_msgs');

window.WAPI._newMessagesListener = window.Store.Msg.on('add', (newMessage) => {
    if (newMessage && newMessage.isNewMsg && !newMessage.isSentByMe) {
        let message = window.WAPI.processMessageObj(newMessage, false, false);
        if (message) {
            window.WAPI._newMessagesQueue.push(message);
            window.WAPI._newMessagesBuffer.push(message);
        }
        if (!window.WAPI._newMessagesDebouncer && window.WAPI._newMessagesQueue.length > 0) {
            window.WAPI._newMessagesDebouncer = setTimeout(() => {
                let queuedMessages = window.WAPI._newMessagesQueue;
                window.WAPI._newMessagesDebouncer = null;
                window.WAPI._newMessagesQueue = [];
                let removeCallbacks = [];
                window.WAPI._newMessagesCallbacks.forEach(function(callbackObj) {
                    if (callbackObj.callback !== undefined) callbackObj.callback(queuedMessages);
                    if (callbackObj.rmAfterUse === true) removeCallbacks.push(callbackObj);
                });
                removeCallbacks.forEach(function(rmCallbackObj) {
                    let callbackIndex = window.WAPI._newMessagesCallbacks.indexOf(rmCallbackObj);
                    window.WAPI._newMessagesCallbacks.splice(callbackIndex, 1);
                });
            }, 1000);
        }
    }
});

window.WAPI._unloadInform = (event) => {
    window.WAPI._newMessagesBuffer.forEach((message) => {
        Object.keys(message).forEach(key => message[key] === undefined ? delete message[key] : '');
    });
    sessionStorage.setItem("saved_msgs", JSON.stringify(window.WAPI._newMessagesBuffer));
    window.WAPI._newMessagesCallbacks.forEach(function(callbackObj) {
        if (callbackObj.callback !== undefined) {
            callbackObj.callback({ status: -1, message: 'page will be reloaded, wait and register callback again.' });
        }
    });
};

window.addEventListener("unload", window.WAPI._unloadInform, false);
window.addEventListener("beforeunload", window.WAPI._unloadInform, false);
window.addEventListener("pageunload", window.WAPI._unloadInform, false);

window.WAPI.waitNewMessages = function(rmCallbackAfterUse = true, done) {
    window.WAPI._newMessagesCallbacks.push({ callback: done, rmAfterUse: rmCallbackAfterUse });
    return true;
};

window.WAPI.getBufferedNewMessages = function(done) {
    let bufferedMessages = window.WAPI._newMessagesBuffer;
    window.WAPI._newMessagesBuffer = [];
    if (done !== undefined) done(bufferedMessages);
    return bufferedMessages;
};

window.WAPI.onGetUnReadMessageFromMe = function () {
	Store.Chat.on("change:hasUnread", (jsonMsg) => {
		SetConsoleMessage("getUnreadMessagesFromMe", JSON.stringify(jsonMsg));
	});
};

window.WAPI.onIncomingCall = function (onIncomingCallCallback) {
	window.Store.Call.on('add', WAPI.onIncomingCallCallback);		
    return true;	
};

window.WAPI.onIncomingCallCallback = async function() {
	const call = window.Store.Call?._models?.[0];
    if (!call) return;
    let contact = call.contact || call.__x_contact || null;
    if (!contact) {
        const wid = call.peerWid || call.__x_peerJid || call.peerJid;
        if (wid && window.Store.Contact) {
            contact = window.Store.Contact.get(wid) || window.Store.Contact.get(wid.toString());
        }
    }
    let real = window.WAPI.extractRealNumberFromContact(contact)?._serialized;
    if (real?.endsWith('@c.us')) real = real.split('@')[0];
    SetConsoleMessage('getIncomingCall', real || '');
    window.Store.Call._models = [];
};

window.Store.MediaTypeFromProtobufModule.mediaTypeFromProtobufOriginal = window.Store.MediaTypeFromProtobufModule.mediaTypeFromProtobuf;
window.Store.MediaTypeFromProtobufModule.mediaTypeFromProtobuf = function(...args) {
    const [proto] = args;
    if (proto.locationMessage) return null;
    return window.Store.MediaTypeFromProtobufModule.mediaTypeFromProtobufOriginal(...args);
};
window.Store.TypeAttributeFromProtobufModule.typeAttributeFromProtobufOriginal = window.Store.TypeAttributeFromProtobufModule.typeAttributeFromProtobuf;
window.Store.TypeAttributeFromProtobufModule.typeAttributeFromProtobuf = function(...args) {
    const [proto] = args;
    if (proto.locationMessage) return 'text';
    return window.Store.TypeAttributeFromProtobufModule.typeAttributeFromProtobufOriginal(...args);
};

// ── Exposição ATLAS ────────────────────────────────────────────────────────────
if (typeof window.KOB === 'object' && window.KOB) {
    window.KOB.WAPI = KOB_WAPI;
} else {
    window.KOB_WAPI = KOB_WAPI;
}

console.log(
    `⟪ ✶ WAPI TINJECT ATIVO ✶ ⟫\n` +
    `  JS=${KOB_WAPI.VERSION_JS} · TInject=${KOB_WAPI.VERSION_TINJ} · CEF4=${KOB_WAPI.VERSION_CEF4}\n` +
    `  ATLAS 0x00 · 432Hz · Kd1 — KAEL DOMNNUS`
);
