/*
* A plugin to get Sketch layers and previews in and out of Lingo
*/

// Required to use COSTarget
coscript.shouldKeepAround = true;


// Logging
/*-------------------------------------------------------------------------------*/

function info(data) {
    print("LingoSketch ℹ️: " + data);
}
function log(data) {
    print("LingoSketch 🐛: " + data);
}
function verbose(data) {
    print("LingoSketch 📢: " + data);
}
function error(data) {
    print("LingoSketch ⚠️: " + data);
}


// Plugin Manager
/*-------------------------------------------------------------------------------*/

// var sketchVersion = 0;
// const pluginVersion = 65;

function loadManager(context) {
    if  (NSClassFromString('SKLManager') == null) {
        var basePath = NSString.stringWithFormat_(context.scriptPath).stringByDeletingLastPathComponent();
        var path = basePath + "/Resources/";
        var mocha = Mocha.sharedRuntime();
        if (mocha.loadFrameworkWithName_inDirectory("SKLingoPlugin", path) != true) {
            log("Unable to load Lingo plugin framework");
            exit(1);
        }
        var manager = SKLManager.shared();
        // this.sketchVersion = manager.sketchVersion();
        // log('VERSION:' + sketchVersion)
        manager.checkManifestVersion(basePath);
    }
    return SKLManager.shared();
}

function sketchVersion() {
    return SKLManager.shared().sketchVersion()
}





// Utilities
/*-------------------------------------------------------------------------------*/

function target(f) {
    return COSTarget.targetWithJSFunction(f);
}
function runMainAndWait(f) {
    var handler = target(function(sender) {
        f();
    });
    SKLUtils.runMainAndWait(handler);
}

function replaceLayer(existing, newLayer) {
    // Remove existing layers in group.
    while (existing.layers().count() > 0) {
        existing.removeLayer(existing.lastLayer());
    }
    existing.addLayers(newLayer.layers());
}



// Manifest handlers
/*-------------------------------------------------------------------------------*/

// Called when the plugin is loaded
function lingo_onLaunch(context) {
    log("LAUNCHED");
    if  (NSClassFromString('SKLManager') != nil) {

        var manager = SKLManager.shared();
        // log("Plugin loaded: " + pluginVersion + "   version: " + manager.pluginVersion());
        // if (pluginVersion != manager.pluginVersion()) {
        //     manager.pluginDidReload();
        // }
        var basePath = NSString.stringWithFormat_(context.scriptPath).stringByDeletingLastPathComponent();
        SKLManager.shared().checkManifestVersion(basePath);
        return;
    }
    loadManager(context)

}

function lingo_push(context) {
    var toolbar = toolbarForContext(context);
    toolbar.pushAll();
}

function lingo_pull(context) {
    var toolbar = toolbarForContext(context);
    toolbar.pullAll();
}

function lingo_willPaste(context) {
    var doc = context.actionContext.document;
    var toolbar = toolbarForContext(context);
    toolbar.pasteInDocument();
}

function lingo_didCopy(context) {
    var doc = context.actionContext.document;
    var toolbar = toolbarForContext(context);

    var selectedLayers = doc.selectedLayers().layers();
    var layers = NSMutableArray.new();
    var symbols = NSMutableArray.new();

    for (var i = 0; i < selectedLayers.count(); i++) {
        var l = selectedLayers[i];
        if (l.isKindOfClass(MSSymbolInstance) || l.isKindOfClass(MSSymbolMaster)) {
            symbols.addObject(l.symbolID());
        }
        else if (l.isKindOfClass(MSLayer)) {
            layers.addObject(l.objectID());
        }
    }
    SKLUtils.addSymbolsToPasteboard_layers(symbols, layers);
    toolbar.didCopy();
}

function lingo_selectionChanged(context) {
    var doc = context.actionContext.document;
    var selectedLayers = doc.selectedLayers().layers();
    var toolbar = toolbarForContext(context);

    if (toolbar) {
        var selections = selectedLayers.length;
        toolbar.setSelectionCount(selections);
    }
}

function lingo_openToolbarForCurrentDocument(context) {
    toolbarForContext(context).show()
}


/*

"CreateSymbol.finish" : "lingo_createdSymbol",
"CreateSharedStyle.finish" : "lingo_createdSharedStyle",
"SyncSharedStyle.finish" : "lingo_sharedStyleDidSync",
"DocumentSaved" : "lingo_documentSaved",
"CloseDocument.finish" : "lingo_documentClosed"

function lingo_createdSymbol(context) {
    // var doc = context.actionContext.document;
    // var toolbar = toolbarForContext(context)
    // if (toolbar.currentUpdateType() > 0) {
    //     toolbar.setSyncStatus(2);
    // }
}
function lingo_createdSharedStyle(context) {
    // var doc = context.actionContext.document;
    // var toolbar = toolbarForContext(context)
    // if (toolbar.currentUpdateType() > 0) {
    //     toolbar.setSyncStatus(2);
    // }
}
function lingo_sharedStyleDidSync(context) {
    // var doc = context.actionContext.document;
    // var toolbar = toolbarForContext(context)
    // toolbar.setSyncStatus(2);
}
function lingo_documentSaved(context) {
    // log("Document saved")
    // var doc = context.actionContext.document;
    // toolbarForContext(context).checkSyncStatusIfNeeded();
}

*/

function existingToolbarForContext(context) {

    var doc = context.document || context.actionContext.document;
    if (doc == nil) { return; }
    var manager = loadManager(context)

    return manager.existingToolbarForDocument(doc);
}

function toolbarForContext(context) {
    var doc = context.document || context.actionContext.document;
    if (doc == nil) { return; }
    var manager = loadManager(context)

    var toolbar = manager.toolbarForDocument(doc)

    if (toolbar == nil) { return nil; }
    if (toolbar.isSetup() == false) {
        log("Setting up new window...");

        var handler = target(function(action) {

            var name = action.name();
            log("Action called: " + name);
            switch (name) {

                // Push
                case SKLAction.PreparePushSessionName():
                action_addAllToSession(action);
                break;

                case SKLAction.ProcessPushDuplicatesName():
                action_processPushDuplicates(action);
                break;

                // Pull
                case SKLAction.PopulatePullSessionName():
                action_populateSessionObjects(action);
                break;

                case SKLAction.CreateSharedObjectInstanceName():
                action_createSharedObjectInstance(action);
                break;

                case SKLAction.BundleForSyncObjectName():
                action_bundleForSyncObject(action);
                break;

                case SKLAction.GeneratePreviewName():
                action_previewForObject(action);
                break;

                case SKLAction.AddToDocumentName():
                action_addSessionObjectsToDocument(action);
                break;

                case SKLAction.RemoveSelectionName():
                action_removeSelection(action);
                break;

                case SKLAction.CheckSyncStatusName():
                action_checkSyncStatus(action);
                break;

                case SKLAction.PreparePasteboardName():
                action_addToSession(action);
                break;

                default:
                log("Unknown action name: " + name);
                action.errorWithTitle_message("Error",
                "Something went wrong. Make sure you have the latest version of Lingo installed.");
            }
        });

        toolbar.setHandler(handler);

        if (toolbar.isValid()) {
            if (toolbar.storage().lastVersion() < 64) {
                migrateHashes(toolbar)
            }
            toolbar.didVersionMigrations();

            var selectedLayers = doc.selectedLayers().layers();
            var selections = selectedLayers.length;
            toolbar.setSelectionCount(selections);
        }
        // if (toolbar.shouldAutoShow()) {
        //     toolbar.show();
        // }
    }


    return toolbar;
}


function migrateHashes(toolbar) {

    var storage = toolbar.storage();
    var docData = toolbar.documentData();

    var symbols = docData.allSymbols();
    var layerStyles = docData.layerStyles().objects();
    var textStyles = docData.layerTextStyles().objects();
    var layers = NSMutableArray.new();

    var layerIDs = storage.layerIDs();
    if (layerIDs.count() > 0) {
        for (var i = 0; i < layerIDs.count(); i++) {
            var layer = docData.layerWithID(layerIDs[i]);
            if (layer) {
                layers.addObject(layer);
            }
        }
    }

    function processObjects(objects, key) {
        if (objects.count() == 0) { return; }
        for (var i = 0; i < objects.count(); i++) {
            var obj = objects[i];
            var hash = obj.metadataForKey("com.lingoapp.hash")
            if (hash) {
                storage.storeHash_forObject_ofType(hash, obj, key);
                obj.storeMetadata_forKey(nil, "com.lingoapp.hash");
            }
        }
    }

    processObjects(symbols, StorageKeySymbols);
    processObjects(textStyles, StorageKeyTextStyles);
    processObjects(layerStyles, StorageKeyLayerStyles);
    processObjects(layers, StorageKeyLayers);

    log("Migrating hashes : " + storage);
    storage.commitChanges();
}


// Constant Types
/*-------------------------------------------------------------------------------*/
const ResolveNone = 0;
const ResolveInsert = 1;
const ResolveKeepBoth = 2;

const TypeLayer = "SKETCH_LAYER";
const TypeSymbol = "SKETCH_SYMBOL";
const TypeLayerStyle = "SKETCH_LAYER_STYLE";
const TypeTextStyle = "SKETCH_TEXT_STYLE";
const TypeColor = "COLOR";

// Sync Map Keys
/*-------------------------------------------------------------------------------*/
const StorageKeySymbols = "symbols";
const StorageKeyLayerStyles = "layerStyles";
const StorageKeyTextStyles = "textStyles";
const StorageKeyLayers = "layers";
const StorageKeyColors = "colors";

const SKLStatusProcessing = 0;
const StatusPrepSymbols = 1;
const StatusPrepTextStyles = 2;
const StatusPrepLayerStyles = 3;
const StatusPrepColors = 4;

const StatusSending = 5;
const StatusFetching = 6;
const StatusComparing = 7;


// Checking Status
/*-------------------------------------------------------------------------------*/

function action_checkSyncStatus(action) {
    var doc = action.document();
    var docData = doc.documentData();
    var storage = action.storage();

    // var syncAll = action.toolbar().currentUpdateType() > 0

    var needPush = 0
    var needPull = 0
    var conflicts = 0

    function checkObjects(objects, type, key) {
        var inLingo = action.object().objectForKey(type)
        if (inLingo == nil) {
            needPush += objects.count();
            return
        }

        var matched = 0;
        var count = objects.count();

        for (var i = 0; i < count; i++) {
            var obj = objects[i];
            var sID = type == TypeSymbol ? obj.symbolID() : storage.existingSyncIDForDocumentID_ofType(obj.objectID(), key);

            var lgData = inLingo.objectForKey(sID);

            // Object hasn't been synced or not to this kit
            if (sID == nil || !lgData) {
                log("Object does not exist in Lingo syncID: " + obj);
                needPush++;
                continue;
            }

            matched++;

            var diff = 0
            if (type == TypeSymbol) {
                var hash = hashForLayer(obj, storage);
                var pHash = storage.storedHashForObject_ofType(obj, key);
                var name = obj.name();
                diff = SKLUtils.pushStatusForLingoObject_sketchName_sketchHash_previousHash(lgData, name, hash, pHash);
            }
            else if (type == TypeLayerStyle || type == TypeTextStyle) {
                var hash = hashForSharedStyle(obj);
                var pHash = storage.storedHashForObject_ofType(obj, key);
                var name = obj.name()
                diff = SKLUtils.pushStatusForLingoObject_sketchName_sketchHash_previousHash(lgData, name, hash, pHash);
            }
            else if (type == TypeColor) {

            }

            if (diff == 1) { needPush++; }
            else if (diff == -1) { needPull++; }
            else if (diff == 2) { conflicts++; }
        }

        needPull += inLingo.count() - matched;
    }

    checkObjects(docData.allSymbols(), TypeSymbol, StorageKeySymbols);
    checkObjects(docData.layerStyles().objects(), TypeLayerStyle, StorageKeyLayerStyles);
    checkObjects(docData.layerTextStyles().objects(), TypeTextStyle, StorageKeyTextStyles);

    var result = {
        "push" : needPush,
        "pull" : needPull,
        "conflict" : conflicts,
    };

    action.success(result);
}


// Creating Archives
/*-------------------------------------------------------------------------------*/
function archiveForLayer(layer, storage) {

    var docData = layer.documentData()
    if (layer.isKindOfClass(MSSymbolInstance)) {
        layer = layer.symbolMaster();
    }

    // We just need this for skipping nested symbols
    var syncID  = layer.isKindOfClass(MSSymbolMaster.class()) ? layer.symbolID() : "";

    var symbolMasters = NSMutableArray.new();
    if (NSClassFromString("MSPasteboardLayersBase")) {
        usedSymbols = MSPasteboardLayersBase.usedSymbolsInContainer_document(layer, docData)
        if (sketchVersion() < 48) {
            symbolMasters = usedSymbols.allValues();
        }
        else {
            arr = usedSymbols.allObjects()
            for (var i = 0; i < arr.count(); i++) {
                var usedSym = docData.symbolWithID(arr[i])
                if (usedSym) {
                    symbolMasters.addObject(usedSym)
                }
            }
        }
    }
    else {
        var writer = MSPasteboardLayersReaderWriter.alloc().init();
        symbolMasters = writer.usedSymbolsInContainer_document(layer, docData).allValues();
    }
    log(symbolMasters)
    // Create the archivable dictionary
    var symbols = NSMutableArray.new();
    var embeddedSymbols = NSMutableArray.new();
    for (var j = 0; j < symbolMasters.count(); j++ ) {
        var symbol = symbolMasters[j];
        var sID = symbol.symbolID()
        log('Symbol:' + sID + ' obj: ' + symbol)
        if (sID != syncID) {
            embeddedSymbols.addObject(sID);
            symbols.addObject(symbol.immutableModelObject());
        }
    }

    var styleDict = NSMutableDictionary.new();
    var embeddedStyles = NSMutableArray.new();



    if (sketchVersion() >= 48) {
        function addStyles(idList, container) {
            for (var i = 0; i < idList.count(); i++) {
                var styleID = idList[i]
                var sharedStyle = container.sharedObjectWithID(styleID)
                log('style: ' + sharedStyle)
                if (sharedStyle) {
                    var storageKey = sharedStyle.style().hasTextStyle() ? StorageKeyTextStyles : StorageKeyLayerStyles;
                    var styleSyncID = storage.syncIDForDocumentID_ofType(styleID, storageKey);
                    embeddedStyles.addObject(styleSyncID);
                    styleDict.setObject_forKey(sharedStyle.immutableModelObject(), styleSyncID);
                }
            }
        }

        styleIDs = MSPasteboardLayersBase.usedSharedObjectsInDocument_layers(docData, layer)
        log(styleIDs.allKeys())
        addStyles(styleIDs[1].allKeys(), docData.layerStyles())
        addStyles(styleIDs[2].allKeys(), docData.layerTextStyles())
    }
    else {
        function addSharedStyles(sharedStyles) {
            for (var j = 0; j < sharedStyles.count(); j++) {
                var s = sharedStyles[j];
                var storageKey = s.style().hasTextStyle() ? StorageKeyTextStyles : StorageKeyLayerStyles;
                var styleSyncID = storage.syncIDForDocumentID_ofType(s.objectID(), storageKey);
                embeddedStyles.addObject(styleSyncID);
                styleDict.setObject_forKey(s.immutableModelObject(), styleSyncID);
            }
        }
        addSharedStyles(docData.layerStyles().sharedObjectsInLayer(layer).allObjects());
        addSharedStyles(docData.layerTextStyles().sharedObjectsInLayer(layer).allObjects());
    }

    log(styleDict)
    log(embeddedStyles)

    var archive = NSMutableDictionary.new();
    archive["layer"] = layer.immutableModelObject();
    archive["symbols"] = symbols;
    archive["styles"] = styleDict;

    return {
        "archive" : archive,
        "embeddedSymbols" : embeddedSymbols,
        "embeddedStyles" : embeddedStyles
    }
}

// Quick hash creation
/*-------------------------------------------------------------------------------*/
function hashForLayer(layer, storage) {
    var archive = archiveForLayer(layer, storage)["archive"];

    log("Archive: " + archive);
    var data = dataForArchive(archive)
    var hash = SKLUtils.hashForLayerArchive(data);

    return hash;
}

function hashForSharedStyle(sharedStyle) {
    var archive = NSMutableDictionary.new();
    archive["style"] = sharedStyle.immutableModelObject();
    return SKLUtils.hashForStyleArchive(dataForArchive(archive));
}

function dataForArchive(archive) {
    var archiver = MSJSONDataArchiver.new();
    var aPtr = MOPointer.alloc().init();
    archiver.archiveObjectIDs = false;
    archiver.archivedDataWithRootObject_error(archive, aPtr);
    if (aPtr.value()) {
        error("Comparison archive error: " + aPtr.value());
    }
    return archiver.archivedData()
}




// Updating document
/*-------------------------------------------------------------------------------*/

function positionNewArtboard(a) {
    // Position the new symbol on the page
    a.frame().setX(-9999);
    a.frame().setY(-9999);
    size = (a.frame().size)
    page = a.parentPage()
    rect = CGRectMake(0, 0, 1000, 1000)
    position = CGPointMake(0,0)
    if (sketchVersion() >= 48) {
        position = MSLayerPaster.alloc().initWithPasteboardLayers(NSArray.alloc().init()).findFirstAvailablePositionForSize_nextToArtboardsOnPage_inAllowedRect(size, page, rect);
    }
    else {
        position = MSLayerPaster.findFirstAvailablePositionForSize_nextToArtboardsOnPage_inAllowedRect(size, page, rect)
    }
    a.frame().setX(position.x);
    a.frame().setY(position.y);
}

function replaceColor(color, syncObj) {
    var data = syncObj.lingoJSON()
    var cData = data["color"];
    var h = cData["hue"];
    var s = cData["saturation"];
    var b = cData["brightness"];
    var a = cData["alpha"];

    var c = MSColor.colorWithHue_saturation_brightness_alpha(h/360.0, s/100.0, b/100.0, a/100.0);
    color.setRed(c.red())
    color.setGreen(c.green())
    color.setBlue(c.blue())
    color.setAlpha(c.alpha())
    return color;
}


var removedObjectCenter = nil;
var removedObjectParent = nil;

function action_removeSelection(action) {
    var doc = action.document();
    var selectedLayers = doc.selectedLayers().layers();
    doc.documentData().selectedLayers = MSLayerArray.emptyArray() // .deselectAllLayers();

    for (var i = 0; i < selectedLayers.count(); i++) {
        var l = selectedLayers[i];
        var org = l.frame().origin();
        var siz = l.frame().size();

        var x = org.x + (siz.width/2);
        var y = org.y + (siz.height/2);

        removedObjectCenter = CGPointMake(x, y);
        removedObjectParent = l.parentForInsertingLayers();
        l.removeFromParent();
    }
}

function action_addSessionObjectsToDocument(action) {

    var doc = action.document();
    var docData = doc.documentData();
    var storage = action.storage();

    var session = action.object();
    var objects = session.objectsToAdd();

    // Only call this if we cannot proceed
    function cancelImport() {
        action.errorWithTitle_message("Error", "There was a problem loading some assets from Lingo");
    }

    // Add the symbol to the symbols page
    function addSymbol(s) {
        const symbolsPage = docData.symbolsPageOrCreateIfNecessary();
        symbolsPage.addLayers([s]);
        positionNewArtboard(s)
    }

    var count = objects.count();
    var colorsToAdd = NSMutableDictionary.new();

    for (var i = 0; i < count; i++) {

        var syncObj = objects[i];
        var syncID = syncObj.syncID();
        var resolve = syncObj.resolutionType();
        var type = syncObj.type();
        var lingoJSON = syncObj.lingoJSON();

        if (resolve == ResolveNone) {
            continue;
        }

        // If the data didn't change, just update the name
        if (resolve == ResolveInsert && syncObj.isDataChanged() == false)  {
            if (syncObj.object != nil && (type == TypeSymbol || type == TypeLayer || type == TypeLayerStyle || type == TypeTextStyle)) {
                if (lingoJSON["name"]) {
                    syncObj.object().setName(lingoJSON["name"]);
                    storage.storeName_forObject_ofType(lingoJSON["name"], syncObj.object(), syncObj.storageKey());
                }
            }
            continue;
        }

        // First pass on colors
        if (type == TypeColor) {
            if (syncObj.object()) {
                var c = replaceColor(syncObj.object(), syncObj);
                storage.addSyncID_forDocumentID_ofType(syncObj.syncID(), c.immutableModelObject().hexValue(), StorageKeyColors);
            }
            else {
                // var data = syncObj.lingoJSON()
                var cData = lingoJSON["color"];
                var h = cData["hue"];
                var s = cData["saturation"];
                var b = cData["brightness"];
                var a = cData["alpha"];
                var c = MSColor.colorWithHue_saturation_brightness_alpha(h/360.0, s/100.0, b/100.0, a/100.0);
                docData.assets().addColor(c)
                if (syncID) {
                    storage.addSyncID_forDocumentID_ofType(syncID, c.immutableModelObject().hexValue(), StorageKeyColors);
                }
            }
            continue;
        }

        if (syncObj.lingoArchiveData() == nil) {
            error("Unable to load lingo archive for sync object");
            continue;
        }

        var archiveVersion = syncObj.unarchiveVersion();

        var data = nil;
        if (archiveVersion && archiveVersion > 0) {
            data = MSJSONDataUnarchiver.unarchiveObjectWithString_asVersion_corruptionDetected_error(syncObj.lingoArchiveString(), archiveVersion, nil, nil);
        }
        else {
            error("No archive version: " + archiveVersion);
            data = MSJSONDataUnarchiver.unarchiveObjectWithData(syncObj.lingoArchiveData());
        }


        if (data == nil) {
            error("Unable to unarchive lingo data for sync object");
            continue;
        }

        // Supports a previous plugin versions where the archive what wrapped in a header
        if (data.isKindOfClass(MSArchiveHeader)) {
            data = data.root();
        }

        var immutableLayer = data["layer"];
        var immutableStyle = data["style"];

        if (immutableLayer) {

            var layer = immutableLayer.newMutableCounterpart();

            // Add missing embedded symbols
            var symbols = data["symbols"];
            var sCount = symbols.count();
            var addedSymbols = NSMutableArray.new()
            for (var j = 0; j < sCount; j++) {
                var immSym = symbols[j];
                if (docData.symbolWithID(immSym.symbolID()) == nil) {
                    addedSymbols.addObject(immSym.symbolID())
                    var nSym = immSym.newMutableCounterpart()
                    addSymbol(nSym);
                }
            }
            // This needs to happen after to make sure all the symbols have been added to the document
            for (var j = 0; j < addedSymbols.count(); j++) {
                var sym = docData.symbolWithID(addedSymbols[j])
                var nHash = hashForLayer(nSym, storage)
                storage.storeName_hash_forObject_ofType(nSym.name(), nHash, nSym, StorageKeySymbols);
            }
            // Add embedded styles if not existing
            var styles = data["styles"];
            if (styles.isKindOfClass(NSDictionary)) {
                var styleKeys = styles.allKeys();
                var styleCount = styleKeys.count();
                for (var j = 0; j < styleCount; j++) {
                    var sharedStyleSyncID = styleKeys[j];
                    var immStyle = styles[sharedStyleSyncID];
                    var embeddedStyle = immStyle.newMutableCounterpart();
                    var style = embeddedStyle.style();
                    var container = nil;
                    var storageKey = nil; // We need this to store it below
                    if (style.hasTextStyle()) {
                        container = docData.layerTextStyles();
                        storageKey = StorageKeyTextStyles;
                    }
                    else {
                        container = docData.layerStyles();
                        storageKey = StorageKeyLayerStyles;
                    }
                    var styleID = storage.documentIDForSyncID_ofType(sharedStyleSyncID, storageKey);
                    if (styleID == nil || container.sharedObjectWithID(styleID) == nil) {
                        container.addSharedObject(embeddedStyle);
                        storage.addSyncID_forDocumentID_ofType(sharedStyleSyncID, embeddedStyle.objectID(), storageKey);
                        var nHash = hashForSharedStyle(embeddedStyle)
                        // [storage storeHash: nHash forObject: embeddedStyle  ofType: storageKey];
                        storage.storeName_hash_forObject_ofType(embeddedStyle.name(), nHash, embeddedStyle, storageKey);
                    }
                }
            }

            // Add symbol layer
            if (type == TypeSymbol) {
                var existing = syncObj.object() || docData.symbolWithID(syncID);
                if (existing) {

                    if (resolve == ResolveKeepBoth) {
                        // Duplicate the symbol
                        var frame = existing.frame();
                        var parent = existing.parentPage()
                        var dup =  existing.duplicate(); // This will create duplcate in the same location and we move the update one below

                        // Update instances to use the new duplicate
                        var instances = existing.allInstances();
                        var instCount = instances.count();
                        for (var instIdx = 0; instIdx < instCount; instIdx++) {
                            var inst = instances[instIdx];
                            var instParent = inst.parentForInsertingLayers()
                            var instFrame = inst.frame()
                            var instIndex = parent.indexOfLayer(inst);

                            inst.removeFromParent();

                            var newInst = dup.newSymbolInstance();
                            switch (sketchVersion()) {
                                case 44:
                                    instParent.insertLayers_atIndex([newInst], instIndex);
                                default:
                                    instParent.insertLayer_atIndex(newInst, instIndex);
                            }

                            newInst.frame().setX(instFrame.x())
                            newInst.frame().setY(instFrame.y())
                        }
                    }
                    // Replace the contents of the existing layer
                    replaceLayer(existing, layer);

                    // Copy properties from saved master.
                    existing.setHasBackgroundColor(layer.hasBackgroundColor());
                    existing.setBackgroundColor(layer.backgroundColor());
                    existing.setIncludeBackgroundColorInInstance(layer.includeBackgroundColorInInstance());

                    existing.frame().setWidth(layer.frame().width());
                    existing.frame().setHeight(layer.frame().height());

                    if (resolve == ResolveKeepBoth) {
                        positionNewArtboard(existing);
                    }

                    // Update the name from Lingo
                    if (lingoJSON["name"]) {
                        existing.setName(lingoJSON.name);
                    }

                    var hash = lingoJSON.objectForKey("hash");
                    storage.storeName_hash_forObject_ofType(existing.name(), hash, existing, StorageKeySymbols);
                }
                else {
                    addSymbol(layer)
                    if (lingoJSON["name"]) {
                        layer.setName(lingoJSON["name"]);
                    }
                    syncObj.object = layer;
                    var hash = lingoJSON.objectForKey("hash");
                    storage.storeName_hash_forObject_ofType(layer.name(), hash, layer, StorageKeySymbols);
                }

            }

            // Add Non-symbol layer
            else {
                var layerID = storage.documentIDForSyncID_ofType(syncID, StorageKeyLayers);
                if (layerID) {
                    var existing = syncObj.object() || docData.layerWithID(layerID);
                    if (existing) {
                        var hash = lingoJSON.objectForKey("hash");

                        if (resolve == ResolveKeepBoth) {
                            var page = existing.parentPage();

                            layer = layer.duplicate();

                            (removedObjectParent || doc.currentPage()).addLayers([layer]);
                            storage.storeName_hash_forObject_ofType(layer.name(),  hash, layer, StorageKeyLayers);

                            if (removedObjectCenter) {
                                var size = layer.frame().size();
                                var x = removedObjectCenter.x - (size.width/2);
                                var y = removedObjectCenter.y - (size.height/2);
                                layer.frame().setX(x);
                                layer.frame().setY(y);
                            }
                            else if (layer.isKindOfClass(MSArtboardGroup.class())) {
                                positionNewArtboard(layer);
                            }
                        }
                        else {
                            var frame = existing.frame();
                            var parent = existing.isKindOfClass(MSArtboardGroup) ? existing.parentPage() : existing.parentForInsertingLayers();
                            var index = parent.indexOfLayer(existing);

                            existing.removeFromParent();
                            switch (sketchVersion()) {
                                case 44:
                                    parent.insertLayers_atIndex([layer], index);
                                default:
                                    parent.insertLayer_atIndex(layer, index);
                            }

                            layer.frame().setX(frame.x())
                            layer.frame().setY(frame.y())

                            if (lingoJSON["name"]) {
                                layer.setName(lingoJSON["name"]);
                            }

                            storage.storeName_hash_forObject_ofType(layer.name(), hash, layer, StorageKeyLayers);
                            storage.addSyncID_forDocumentID_ofType(syncID, layer.objectID(), StorageKeyLayers);
                        }
                        continue;
                    }
                }

                let page = doc.currentPage();
                (page.currentArtboard() || page).addLayers([layer]);

                if (removedObjectCenter) {
                    var size = layer.frame().size();
                    var x = removedObjectCenter.x - (size.width/2);
                    var y = removedObjectCenter.y - (size.height/2);
                    layer.frame().origin = CGPointMake(x, y);
                }
                else if (layer.isKindOfClass(MSArtboardGroup.class())) {
                    positionNewArtboard(layer);
                }

                if (lingoJSON["name"]) {
                    layer.setName(lingoJSON["name"]);
                }

                syncObj.object = layer;
                var hash = lingoJSON.objectForKey("hash")

                storage.storeName_hash_forObject_ofType(layer.name(), hash, layer,  StorageKeyLayers);
                storage.addSyncID_forDocumentID_ofType(syncID, layer.objectID(), StorageKeyLayers);


            }
        }

        else if (immutableStyle) {
            var sharedStyle = immutableStyle.newMutableCounterpart();
            var style = sharedStyle.style();

            var container = nil;
            var storageKey = nil; // We need this to store it below
            if (style.hasTextStyle()) {
                container = docData.layerTextStyles();
                storageKey = StorageKeyTextStyles;
            }
            else {
                container = docData.layerStyles();
                storageKey = StorageKeyLayerStyles;
            }

            var styleID = storage.documentIDForSyncID_ofType(syncID, storageKey);
            if (styleID) {
                var existing = syncObj.object() ||  container.sharedObjectWithID(styleID);
                if (existing) {
                    // Found existing style, replace it
                    var selection = doc.selectedLayers();

                    // We can probably create the duplicate from the temp layer here
                    if (resolve == ResolveKeepBoth) {
                        // Duplicate the style
                        var newLayer = type == TypeTextStyle ? MSTextLayer.new() : MSShapeGroup.shapeWithRect(CGRectMake(0,0,100,100));
                        existing.style().copyPropertiesToObject_options(newLayer.style(), null);
                        doc.currentPage().addLayers([newLayer]);
                        container.addSharedStyleWithName_firstInstance(existing.name(), newLayer.style());
                        newLayer.removeFromParent();
                    }

                    // This seems to be the best way to update a shared style
                    // Essentially add the new style to a temp layer then sync that layer style back to our existing SharedStyle
                    var tempLayer = type == TypeTextStyle ? MSTextLayer.new() : MSShapeGroup.shapeWithRect(CGRectMake(0,0,100,100));

                    sharedStyle.style().copyPropertiesToObject_options(tempLayer.style(), null);
                    tempLayer.style().setSharedObjectID(existing.objectID());
                    doc.currentPage().addLayers([tempLayer]);

                    // Select temp and sync the shared style from it
                    tempLayer.select_byExpandingSelection(true, false);
                    const syncAction = MSSyncSharedStyleAction.alloc().initWithDocument(doc);
                    syncAction.doPerformAction(null);

                    // cleanup
                    doc.currentPage().removeLayer(tempLayer);
                    doc.setSelectedLayers(selection);

                    if (lingoJSON["name"]) {
                        existing.setName(lingoJSON.name);
                    }
                    // Set the new hash
                    var hash = lingoJSON.objectForKey("hash");
                    storage.storeName_hash_forObject_ofType(existing.name(), hash, existing, storageKey);
                    continue; // Important to not fall through and create a new style
                }
            }

            // Didn't exist, add it
            container.addSharedObject(sharedStyle);
            if (lingoJSON["name"]) {
                sharedStyle.setName(lingoJSON.name);
            }
            syncObj.object = sharedStyle;
            var hash = lingoJSON.objectForKey("hash");
            // [sharedStyle storeMetadata: hash forKey: "com.lingoapp.hash"];
            storage.storeName_hash_forObject_ofType(sharedStyle.name(), hash, sharedStyle, storageKey);
            storage.addSyncID_forDocumentID_ofType(syncID, sharedStyle.objectID(), storageKey);
        }
        else {
            error("Opened a lingo archive but there was no layer or style in it.");
        }
    }

    if (session.sharedObjectToAdd() != nil) {
        createSharedObjectInstance(session.sharedObjectToAdd(), doc);
    }

    doc.sidebarController().pageListViewController().refresh()

    storage.commitChanges();
    action.success(session);

    removedObjectCenter = nil;
}


function action_createSharedObjectInstance(action) {

    var syncObject = action.object();
    var doc = action.document();

    if (syncObject == nil) { return; }

    createSharedObjectInstance(syncObject, doc);
    removedObjectCenter = nil;

}

function createSharedObjectInstance(syncObject, doc) {

    var type = syncObject.type();
    if (syncObject.object() == nil) { return; }

    if (type == TypeSymbol) {
        var newInst = syncObject.object().newSymbolInstance();
        if (removedObjectCenter) {
            var size = newInst.frame().size();
            var x = removedObjectCenter.x - (size.width/2);
            var y = removedObjectCenter.y - (size.height/2);
            newInst.frame().origin = CGPointMake(x, y);
            // newInst.frame().origin = removedObjectCenter;
        }
        (removedObjectParent || doc.currentPage()).addLayers([newInst]);
        doc.setSelectedLayers(MSLayerArray.arrayWithLayers([newInst]));
    }
    else if (type == TypeTextStyle) {
        var sharedStyle = syncObject.object();

        log("Adding shared layer style instance");

        if (sharedStyle) {
            var tempLayer = MSTextLayer.new();
            tempLayer.stringValue = "Type something";
            let style = sharedStyle.newInstance()
            tempLayer.setStyle(style);
            tempLayer.syncTextStyleAttributes()
            var f = style.enabledFills().firstObject();
            if (f) {
                tempLayer.textColor = f.color();
            }
            tempLayer.adjustFrameToFit();
            if (removedObjectCenter) {
                var size = tempLayer.frame().size()
                var x = removedObjectCenter.x - (size.width/2)
                var y = removedObjectCenter.y - (size.height/2)
                tempLayer.frame().origin = CGPointMake(x, y);
                // tempLayer.frame().origin = removedObjectCenter;
            }
            (removedObjectParent || doc.currentPage()).addLayers([tempLayer]);
            doc.setSelectedLayers(MSLayerArray.arrayWithLayers([tempLayer]));
        }
    }
    else if (type == TypeLayerStyle) {
        var sharedStyle = syncObject.object();
        if (sharedStyle) {
            tempLayer = MSShapeGroup.shapeWithRect(CGRectMake(0,0,100,100)); ; //MSShapeGroup.new();

            var style = sharedStyle.newInstance();
            tempLayer.setStyle(style)
            if (removedObjectCenter) {
                var size = tempLayer.frame().size()
                var x = removedObjectCenter.x - (size.width/2)
                var y = removedObjectCenter.y - (size.height/2)
                tempLayer.frame().origin = CGPointMake(x, y);
                // tempLayer.frame().origin = removedObjectCenter;
            }
            (removedObjectParent || doc.currentPage()).addLayers([tempLayer]);
            doc.setSelectedLayers(MSLayerArray.arrayWithLayers([tempLayer]));
        }
    }

}




// Pulling
/*-------------------------------------------------------------------------------*/

// Populates a session created with lingo data with it's sketch data counterparts
function action_populateSessionObjects(action) {

    var doc = action.document();
    var docData = doc.documentData();
    var storage = action.storage();

    var session = action.object();

    var objects = session.allObjects();
    var count = objects.count();

    var colors = NSMutableArray.new();
    var layers = NSMutableArray.new();
    var textStyles = NSMutableArray.new();
    var layerStyles = NSMutableArray.new();

    var colorMap = nil;
    function documentColorForSyncID(syncID) {
        if (colorMap == nil) {
            colorMap = NSMutableDictionary.new();
            var allColors = docData.assets().colors();
            var colorCount = allColors.count();
            for (var i = 0; i < colorCount; i++) {
                var c = allColors[i];
                colorMap[c.immutableModelObject().hexValue()] = c;
            }
        }
        var colorID = storage.documentIDForSyncID_ofType(syncID, StorageKeyColors);
        if (colorID != nil) {
            return colorMap[colorID];
        }
    }

    for (var i = 0; i < count; i++) {

        var syncObj = objects[i];

        // already populated
        if (syncObj.object() != nil) { continue; }

        var type = syncObj.type();
        var syncID = syncObj.syncID();

        if (type == TypeTextStyle) {
            var styleID = storage.documentIDForSyncID_ofType(syncID, StorageKeyTextStyles);
            var sharedObj = docData.layerTextStyles().sharedObjectWithID(styleID);
            if (sharedObj) {
                textStyles.addObject(sharedObj);
            }
        }
        else if (type == TypeLayerStyle) {
            var styleID = storage.documentIDForSyncID_ofType(syncID, StorageKeyLayerStyles);
            var sharedObj = docData.layerStyles().sharedObjectWithID(styleID);
            if (sharedObj) {
                layerStyles.addObject(sharedObj);
            }
        }
        else if (type == TypeLayer) {
            var layerID = storage.documentIDForSyncID_ofType(syncID, StorageKeyLayers);
            var layer = docData.layerWithID(layerID);
            if (layer) {
                layers.addObject(layer);
            }
        }
        else if (type == TypeColor) {
            var c = documentColorForSyncID(syncID);
            if (c) {
                colors.addObject(c);
            }
        }
        else {
            var layer = docData.symbolWithID(syncID);
            if (layer) {
                layers.addObject(layer);
            }
        }
    }

    addColorsToSession(action, colors);
    addLayersToSession(action, layers);
    addSharedStylesToSession(action, layerStyles, StorageKeyLayerStyles);
    addSharedStylesToSession(action, textStyles, StorageKeyTextStyles);

    // Save any changes made to the storage while adding objects
    storage.commitChanges();
    action.success(session);
}



// Pushing
/*-------------------------------------------------------------------------------*/

function action_addToSession(action) {
    var doc = action.document();
    var docData = doc.documentData();
    var session = action.object();

    var layers = action.info()["layers"];
    var symbols = action.info()["symbols"];

    var foundLayers = NSMutableArray.new();

    for (var i = 0; i < symbols.count(); i++) {
        var objID = symbols[i];
        var sym = docData.symbolWithID(objID);
        if (sym) {
            foundLayers.addObject(sym);
        }
    }
    for (var i = 0; i < layers.count(); i++) {
        var objID = layers[i];
        var obj = docData.layerWithID(objID);
        if (obj) {
            foundLayers.addObject(obj);
        }
    }

    addLayersToSession(action, foundLayers);

    // Save any changes made to the storage while adding objects
    action.storage().commitChanges();
    action.success(session);
}

function action_addAllToSession(action) {

    var doc = action.document();
    var docData = doc.documentData();

    var session = action.object();
    var method = session.method();

    var selectedLayers = doc.selectedLayers().layers();

    if (selectedLayers.count() > 0) {
        addLayersToSession(action, selectedLayers);
        action.storage().commitChanges();
        action.success(session);
    }
    else {
        var symbols = docData.allSymbols();
        var layerStyles = docData.layerStyles().objectsSortedByName();
        var textStyles = docData.layerTextStyles().objectsSortedByName();
        var colors = docData.assets().colors();

        action.status(StatusPrepSymbols);
        addLayersToSession(action, symbols);

        action.status(StatusPrepLayerStyles);
        addSharedStylesToSession(action, layerStyles, StorageKeyLayerStyles);

        action.status(StatusPrepTextStyles);
        addSharedStylesToSession(action, textStyles, StorageKeyTextStyles);

        action.status(StatusPrepColors);
        addColorsToSession(action, colors);

        action.storage().commitChanges();
        action.success(session);
    }
}

function action_processPushDuplicates(action) {

    var docData = action.document().documentData();
    var session = action.object();
    var objects = action.info()["objects"];
    var storage = action.storage();

    var symbolMap = NSMutableDictionary.new()
    var styleMap = NSMutableDictionary.new()

    var needsRearchive = false

    var iCount = objects.count();
    for (var i = 0; i < iCount; i++) {

        var syncObj = objects[i];
        var resolve = syncObj.resolutionType();

        if (resolve != ResolveKeepBoth) {
            continue;
        }

        var type = syncObj.type();
        var original = syncObj.object();

        if (type == TypeSymbol) {
            needsRearchive = true;

            log("processing keep both: " + syncObj.syncID())

            var frame = original.frame();
            var parent = original.parentPage()
            var dup =  original.duplicate(); // This will create duplcate in the same location and we move the update one below

            // Update instances to use the new duplicate
            var instances = original.allInstances();

            for (var instIdx = 0, instCount = instances.count(); instIdx < instCount; instIdx++) {
                var inst = instances[instIdx];
                var instParent = inst.parentForInsertingLayers()
                var instFrame = inst.frame()
                var instIndex = parent.indexOfLayer(inst);
                inst.removeFromParent();
                var newInst = dup.newSymbolInstance();
                switch (sketchVersion()) {
                    case 44:
                        instParent.insertLayers_atIndex([newInst], instIndex);
                    default:
                        instParent.insertLayer_atIndex(newInst, instIndex);
                }

                newInst.frame().setX(instFrame.x())
                newInst.frame().setY(instFrame.y())
            }

            original.removeFromParent();
            syncObj.object = dup;
            session.didUpdateSyncID_forObject(dup.symbolID(), syncObj);

            log("created duplicate: " + syncObj.syncID())
        }
        else if (type == TypeLayer) {
            needsRearchive = true;
            // remove the old syncID
            storage.removeSyncID_ofType(syncObj.syncID(), StorageKeyLayers);

            // Generate a new objectID
            original.generateObjectID()
            var newSyncID = storage.syncIDForDocumentID_ofType(original.objectID(), StorageKeyLayers);
            session.didUpdateSyncID_forObject(newSyncID, syncObj);
        }
        else if (type == TypeLayerStyle || type == TypeTextStyle) {

            var storeKey = s.hasTextStyle() ? StorageKeyTextStyles : StorageKeyLayerStyles;
            storage.removeSyncID_ofType(syncObj.syncID(), storeKey);

            var s = original;
            var styles = s.parentObject();

            if (styles == nil) {
                syncObj.resolutionType = ResolveNone;
                log("ERROR: UNable to file style container")
                continue;
            }

            var instances = styles.instancesOf_inContainer(s, s.documentData())

            if (instances.count() > 0) {
                needsRearchive = true;
            }

            var idx = styles.indexOfSharedStyle(s);
            styles.removeSharedObject(s)
            s.generateObjectID()
            var newID = s.objectID()
            s.style().setSharedObjectID(newID)

            styles.insertSharedObject_atIndex(s, idx)

            for (var j = 0; j < instances.count(); j++) {
                var instance = instances[j];
                styles.unregisterInstance(instance)
                styles.registerInstance_withSharedStyle(instance, s)
            }

            var newSyncID = storage.syncIDForDocumentID_ofType(s.objectID(), storeKey);

            styleMap.setObject_forKey(newSyncID, syncObj.syncID());
            session.didUpdateSyncID_forObject(newSyncID, syncObj);

            // Update the sync object archive
            var archive = NSMutableDictionary.new();
            archive["style"] = sharedStyle.immutableModelObject();
            syncObj.didRebuildStyleArchive(archive);
        }
        else if (type == TypeColor) {
            storage.removeSyncID_ofType(syncObj.syncID(), StorageKeyColors);
            original.generateObjectID()
            var newSyncID = storage.syncIDForDocumentID_ofType(original.objectID(), StorageKeyColors);
            session.didUpdateSyncID_forObject(newSyncID, syncObj);
        }
        else {
            syncObj.resolutionType = ResolveNone;
            // Unexpected object type
        }
    }

    if (needsRearchive) {
        for (var i = 0; i < iCount; i++) {

            var syncObj = objects[i];
            var resolve = syncObj.resolutionType();

            if (resolve == ResolveNone) {
                continue;
            }
            var type = syncObj.type();

            if (type == TypeSymbol || type == TypeLayer) {

                var original = syncObj.object();
                // We could check if it needs to be rearchived but it may be
                // just as expensive as just generating the archive again (it's just a dictionary still)
                var archiveResult = archiveForLayer(original, storage);

                var archive = archiveResult["archive"]
                var symbolIDs = archiveResult["embeddedSymbols"];
                var styleIDs = archiveResult["embeddedStyles"];

                syncObj.didRebuildArchive_symbols_styles(archive, symbolIDs, styleIDs)
            }
        }
    }

    action.success(session);
}


// Adding objects to a session
/*-------------------------------------------------------------------------------*/

function saveDebugHash(hash, type, data, directory, path) {

    var hashDebug = NSMutableDictionary.new();
    hashDebug.setObject_forKey(hash, "Hash");

    if (type == TypeLayerStyle || type == TypeTextStyle) {
        hashDebug.setObject_forKey(SKLUtils.modifiedStyleArchive(data), "source");
    }
    else {
        hashDebug.setObject_forKey(SKLUtils.modifiedLayerArchive(data), "source");
    }

    var hashData = NSJSONSerialization.dataWithJSONObject_options_error(hashDebug, NSJSONWritingPrettyPrinted, nil);
    var url = SKLUtils.debugLogPath();
    var fm = NSFileManager.defaultManager();
    fm.createDirectoryAtPath_withIntermediateDirectories_attributes_error(directory, true, nil, nil);
    if (hashData.writeToFile_atomically(path, true) != true) {
        error("Error writing svg file");
    }
}

function addColorsToSession(action, colors) {

    if (colors == nil || colors.count() == 0) { return; }

    var documentData = action.document().documentData();
    var storage = action.storage();
    var session = action.object();

    var metadata = MSArchiveHeader.metadataForNewHeader()
    let version = "" + metadata["version"] + "_" + action.hashingVersion();

    for (var i = 0; i  < colors.count(); i++) {
        var color = colors[i];
        var syncID = storage.syncIDForDocumentID_ofType(color.immutableModelObject().hexValue(), StorageKeyColors);

        var json = NSMutableDictionary.new();
        json["sync_id"] = syncID;
        json["color"] = {
            "hue" : color.hue(),
            "saturation" : color.saturation(),
            "brightness" : color.brightness(),
            "alpha" : color.alpha()
        },
        json["type"] = TypeColor;
        json["hashing_version"] = version;

        session.addSketchObject_data_archive(color, json, nil);
    }
}

function addSharedStylesToSession(action, styles, storageKey) {

    if (styles == nil || styles.count() == 0) { return; }

    var documentData = action.document().documentData();
    var storage = action.storage();
    var session = action.object();

    var metadata = MSArchiveHeader.metadataForNewHeader();
    let version = "" + metadata["version"] + "_" + action.hashingVersion();

    for (var i = 0; i  < styles.count(); i++) {
        var sharedStyle = styles[i];

        var syncID = storage.syncIDForDocumentID_ofType(sharedStyle.objectID(), storageKey); // syncIDForStyle(sharedStyle)
        var archive = NSMutableDictionary.new();
        archive["style"] = sharedStyle.immutableModelObject();

        var archiver = MSJSONDataArchiver.new();
        var aPtr = MOPointer.alloc().init();
        archiver.archiveObjectIDs = false;
        archiver.archivedDataWithRootObject_error(archive, aPtr);
        if (aPtr.value()) {
            error("Comparison archive error: " + aPtr.value());
        }
        var hash = SKLUtils.hashForStyleArchive(archiver.archivedData());

        if (action.debugMode()) {
            var dir = SKLUtils.debugLogPath() + "/" + syncID + "/";
            var path = dir + (documentData.objectID() + "_" + NSDate.new().timeIntervalSince1970() + ".json")
            saveDebugHash(hash, TypeLayerStyle, archiver.archivedData(), dir, path)
        }

        var backingStyle = sharedStyle.style();
        var type = backingStyle.hasTextStyle() ? TypeTextStyle : TypeLayerStyle;

        var json = NSMutableDictionary.new();
        json["sync_id"] = syncID;
        json["type"] = type
        json["name"] = SKLUtils.trimString(sharedStyle.name());
        json["hash"] = hash;
        json["previous_hash"] = storage.storedHashForObject_ofType(sharedStyle, storageKey) || "";
        json["previous_name"] = storage.storedNameForObject_ofType(sharedStyle, storageKey);
        json["hashing_version"] = version;

        var attributes = NSMutableDictionary.new();
        if (type == TypeTextStyle) {
            var prim = backingStyle.primitiveTextStyle()
            var attrs = prim.attributes();

            // Font
            var font = attrs["NSFont"]
            attributes["font_display_name"] = font.displayName()
            attributes["font_family"] = font.familyName()
            attributes["font_name"] = font.fontName()
            attributes["font_size"] = font.pointSize()
            attributes["font_weight"] = NSFontManager.sharedFontManager().weightOfFont(font);

            // Letter Spacing
            var spacing = attrs["NSKern"]
            attributes["letter_spacing"] = Math.round(spacing * 100) / 100

            // Paragrph Style
            var pStyle = attrs["NSParagraphStyle"]
            attributes["line_height"] = pStyle.minimumLineHeight()

            // Decoration
            if (attrs["NSUnderline"]) {
                attributes["text_decoration"] = "underline"
            }
            else if (attrs["NSStrikethrough"]) {
                attributes["text_decoration"] = "strikethrough"
            }

            // Transform
            var transform = attrs["MSAttributedStringTextTransformAttribute"];
            if (transform == 1) {
                attributes["text-transform"] = "uppercase"
            }
            else if (transform == 2) {
                attributes["text-transform"] = "lowercase";
            }

            // Set the test color as a backup, if we have a style color it will overwrite it below
            var color = attrs["NSColor"]
            if (color) {
                attributes["color"] = SKLUtils.rgbaFromNSString(color)
            }
        }

        // Color
        var fills = backingStyle.enabledFills();
        if (fills.count() > 0) {
            var fillArr = NSMutableArray.new();
            for (var j = 0; j < fills.count(); j++) {
                var fill = fills[j];
                var color = fill.color();
                var r = color.red();
                var g = color.green();
                var b = color.blue();
                var a = color.alpha();
                var str = [r,g,b,a].join(",");
                fillArr.addObject(str);
            }
            attributes["fills"] = fillArr;
        }

        // Border
        var borders = backingStyle.enabledBorders();
        if (borders.count() > 0) {
            var borderArr = NSMutableArray.new();
            for (var j = 0; j < borders.count(); j++) {
                var border = borders[j];
                var color = border.color()
                var r = color.red()
                var g = color.green()
                var b = color.blue()
                var a = color.alpha()
                var w = border.thickness()
                var s = "solid"
                var str = [r,g,b,a,s,w].join(",")
                borderArr.addObject(str)
            }
            attributes["borders"] = borderArr;
        }

        function addShadows(shadows, name) {
            if (shadows.count() == 0) { return; }
            var shadowArr = NSMutableArray.new();
            for (var j = 0; j < shadows.count(); j++ ) {
                var shadow = shadows[j];
                var color = shadow.color();
                var r = color.red();
                var g = color.green();
                var b = color.blue();
                var a = color.alpha();
                var x = shadow.offsetX();
                var y = shadow.offsetY();
                var blur = shadow.blurRadius();
                var spread = shadow.spread();
                var str = [r,g,b,a,x,y,blur,spread].join(",");
                shadowArr.addObject(str);
            }
            attributes[name] = shadowArr;
        }
        var enabledShadows = backingStyle.enabledShadows()
        addShadows(enabledShadows, "shadows")

        var innerShadows = backingStyle.enabledInnerShadows()
        addShadows(innerShadows, "inner_shadows")

        json["style_attributes"] = attributes;

        session.addSketchObject_data_archive(sharedStyle, json, archive);
    }
}

function addLayersToSession(action, layers) {

    if (layers == nil || layers.count() == 0) { return; }

    log("Adding layers to session")
    var documentData = action.document().documentData();
    var session = action.object();
    var storage = action.storage();

    var metadata = MSArchiveHeader.metadataForNewHeader();

    let version = "" + metadata["version"] + "_" + action.hashingVersion();

    for (var i = 0; i  < layers.count(); i++) {

        var layer = layers[i];
        if (layer.isKindOfClass(MSSymbolInstance)) {
            layer = layer.symbolMaster();
        }
        var isSymbol = layer.isKindOfClass(MSSymbolMaster.class());
        var syncID  = isSymbol ? layer.symbolID() : storage.syncIDForDocumentID_ofType(layer.objectID(), StorageKeyLayers);

        var storageKey = isSymbol ? StorageKeySymbols : StorageKeyLayers;

        var archiveResult = archiveForLayer(layer, storage);
        var archive = archiveResult["archive"]
        var compData = dataForArchive(archive);
        var hash = SKLUtils.hashForLayerArchive(compData);

        // TODO: Remove this
        if (action.debugMode()) {
            var dir = SKLUtils.debugLogPath() + "/" + syncID + "/";
            var path = dir + (documentData.objectID() + "_" + NSDate.new().timeIntervalSince1970() + ".json")
            saveDebugHash(hash, TypeLayer, compData, dir, path)
        }

        // Create the JSON
        var json = NSMutableDictionary.new();
        json["sync_id"] = syncID;
        json["type"] = isSymbol ? TypeSymbol : TypeLayer;
        json["name"] = SKLUtils.trimString(layer.name());
        json["hash"] = hash;
        json["previous_hash"] = storage.storedHashForObject_ofType(layer, storageKey) || "";
        json["previous_name"] = storage.storedNameForObject_ofType(layer, storageKey);
        json["symbols"] = archiveResult["embeddedSymbols"];
        json["styles"] = archiveResult["embeddedStyles"];;
        json["hashing_version"] = version;

        session.addSketchObject_data_archive(layer, json, archive);
    }
}


// Bundles & Previews
/*-------------------------------------------------------------------------------*/
function action_bundleForSyncObject(action) {

    var syncObject = action.object()

    var object = syncObject.object(); // Layer or Style
    var rawArchive = syncObject.sketchArchive(); // NSDictionary
    var json = syncObject.sketchJSON(); // NSMutableDictionary of internal data

    var syncID = syncObject.syncID();
    var type = syncObject.type();

    // Not sure we need this but it's there if we need it in the future
    rawArchive["header"] = MSArchiveHeader.metadataForNewHeader();

    var archiver = MSJSONDataArchiver.new();
    archiver.archiveObjectIDs = true;

    log("Creating archive")
    var aPtr = MOPointer.alloc().init();
    archiver.archivedDataWithRootObject_error(rawArchive, aPtr);
    if (aPtr.value()) {
        error("Comparison archive error: " + aPtr.value());
        action.errorWithTitle_message("Error", "There was a problem sending some assets to Lingo");
        return;
    }
    log("Created archive")
    // Prepare preview & file cuts
    var archive = archiver.archivedData(); //[MSJSONDataArchiver archivedDataWithHeaderAndRootObject: rawArchive];
    var pngData = nil; // preview.png
    var pdfData = nil; // filecut-pdf.pdf
    var svgData = nil; // filecut-svg.svg

    if (object.isKindOfClass(MSLayer)) {
        pngData = pngPreviewData(object); // preview.png
        pdfData = pdfPreviewData(object); // filecut-pdf.pdf
        svgData = svgPreviewData(object); // filecut-svg.svg
    }
    else if (type == TypeLayerStyle) {
        runMainAndWait(function() {
                var container = MSShapeGroup.alloc().initWithFrame(NSMakeRect(0,0,80,80));
                var layer = MSRectangleShape.alloc().initWithFrame(NSMakeRect(0,0,80,80));
                container.setStyle(object.style());
                // VERSION SUPPORT
                switch (sketchVersion()) {
                    case 44:
                        container.insertLayers_atIndex([layer], 0);
                    default:
                        container.insertLayer_atIndex(layer, 0);
                }

                // Seems that we need to add it a page or the pngs don't work
                var page = MSPage.page();
                page.addLayers([container]);

                pngData = pngPreviewData(container, 1);
                pdfData = pdfPreviewData(container);
                svgData = svgPreviewData(container);

                container.removeFromParent();
        });
    }
    else {
        runMainAndWait(function() {
                var tLayer = MSTextLayer.alloc().initWithFrame(NSMakeRect(0,0,200,200));

                tLayer.stringValue = "Aa";
                tLayer.setStyle(object.style());
                tLayer.syncTextStyleAttributes()
                var f = object.style().enabledFills().firstObject();
                if (f) {
                    tLayer.textColor = f.color();
                }
                tLayer.adjustFrameToFit();
                var container = tLayer.layersByConvertingToOutlines()[0];

                // Seems that we need to add it to a page or the pngs don't work
                var page = MSPage.page();
                page.addLayers([container]);

                pngData = pngPreviewData(container, 1); // preview.png
                pdfData = pdfPreviewData(container); // filecut-pdf.pdf
                svgData =  svgPreviewData(container); // filecut-svg.svg

                container.removeFromParent();
        })
    }
    log("Created bundle")
    var bundle = SKLObjectBundle.alloc().initWithArchive_png_pdf_svg(archive, pngData, pdfData, svgData);
    log("Creat bundle success")
    action.success(bundle);
}

function action_previewForObject(action) {

    var object = action.object();

    if (object.isKindOfClass(MSLayer)) {
        pngData = pngPreviewData(object); // preview.png
        var img = NSImage.alloc().initWithData(pngData);
        action.success(img);
    }
    else if (object.isKindOfClass(MSSharedStyle)) {
        var style = object.style();
        if (style.hasTextStyle()) {
                var tLayer = MSTextLayer.alloc().initWithFrame(NSMakeRect(0,0,200,200));
                tLayer.stringValue = "Aa";
                tLayer.setStyle(object.style());
                tLayer.syncTextStyleAttributes()
                var f = object.style().enabledFills().firstObject();
                if (f) {
                    tLayer.textColor = f.color();
                }
                tLayer.adjustFrameToFit();
                var container = tLayer.layersByConvertingToOutlines()[0];
                // Seems that we need to add it to a page or the pngs don't work
                var page = MSPage.page();
                page.addLayers([container]);
                var pngData = pngPreviewData(container, 1); // preview.png
                container.removeFromParent();
                var img = NSImage.alloc().initWithData(pngData);
                action.success(img);
        }
        else {
                var container = MSShapeGroup.alloc().initWithFrame(NSMakeRect(0,0,80,80));
                var layer = MSRectangleShape.alloc().initWithFrame(NSMakeRect(0,0,80,80));
                container.setStyle(object.style());

                // VERSION SUPPORT
                switch (sketchVersion()) {
                    case 44:
                        container.insertLayers_atIndex([layer], 0);
                    default:
                        container.insertLayer_atIndex(layer, 0);
                }

                // Seems that we need to add it a page or the pngs don't work
                var page = MSPage.page();
                page.addLayers([container]);
                var pngData = pngPreviewData(container, 1);
                container.removeFromParent();

                var img = NSImage.alloc().initWithData(pngData);
                action.success(img);
        }
    }
    else {
        action.errorWithTitle_message("", "");
    }
}

function pngPreviewData(layer, scale) {
    var exportRequest = MSExportRequest.exportRequestsFromExportableLayer(layer).firstObject();
    exportRequest.format = "png";
    exportRequest.scale = scale || 1.0;
    var res = MSExportManager.alloc().init().exportedDataForRequest(exportRequest);
    return res;
}

function pdfPreviewData(layer) {
    var exportRequest = MSExportRequest.exportRequestsFromExportableLayer(layer).firstObject();
    exportRequest.format = "pdf";
    exportRequest.scale = 1.0
    var res = MSExportManager.alloc().init().exportedDataForRequest(exportRequest);
    return res;
}

function svgPreviewData(layer) {
    var exportRequest = MSExportRequest.exportRequestsFromExportableLayer(layer).firstObject();
    exportRequest.format = "svg";
    exportRequest.scale = 1.0
    var res = MSExportManager.alloc().init().exportedDataForRequest(exportRequest);
    return res;
}
