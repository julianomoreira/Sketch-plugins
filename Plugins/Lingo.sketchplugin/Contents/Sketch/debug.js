@import '~/Library/Application Support/com.bohemiancoding.sketch3/Plugins/Lingo.sketchplugin/Contents/Sketch/script.js'



// onCopy(context);
// onPaste(context);
// printSelection(context);



// Testing
/*-------------------------------------------------------------------------------*/
function log(message) {
    print(message);
}


function loadManager(context) {


    if  (NSClassFromString('SKLPluginManager') == null) {
        var basePath = NSString.stringWithFormat_(context.scriptPath)
        .stringByDeletingLastPathComponent();
        var path = basePath + "/Lingo.sketchplugin/Contents/Sketch/Resources/";


        var mocha = [Mocha sharedRuntime];
        if ([mocha loadFrameworkWithName: "SKLingoPlugin" inDirectory: path] != true) {
            print("Unable to load Lingo plugin framework at path: " + path);
            exit(1);
        }
    }
    return SKLPluginManager.shared();
}





function hashForObject(object) {

    loadManager(context)
    if (object == nil) {
        return "Nothing to hash"
    }

    if (object.isKindOfClass(MSSharedStyle)) {
        log(hashForSharedStyle(object))
    }
    else if (object.isKindOfClass(MSLayer)) {
        log("Hash" + hashForLayer(object))
    }
    else {
        log("Unhashable object " + object)
    }
}


function hashForSharedStyle(sharedStyle) {
    var archive = [NSMutableDictionary new];
    let immStyle = sharedStyle.immutableModelObject()

    log("Archive: " + immStyle)
    var archiver = [MSJSONDataArchiver new];
    var aPtr = MOPointer.alloc().init();
    archiver.archiveObjectIDs = false;
    [archiver archivedDataWithRootObject: immStyle error: aPtr];
    if (aPtr.value()) {
        error("Comparison archive error: " + aPtr.value())
        return nil;
    }

    var comparisonData =  archiver.archivedData()

    log([[NSString alloc] initWithData: comparisonData encoding: NSUTF8StringEncoding])

    return [SKLUtils sha1: comparisonData]
}


function hashForLayer(layer) {

        if (layer.isKindOfClass(MSSymbolInstance)) {
            layer = layer.symbolMaster();
        }

        // Create the archivable dictionary
        var archive = [NSMutableDictionary new];
        archive["layer"] = layer.immutableModelObject()

        let writer = MSPasteboardLayersReaderWriter.alloc().init();
        let symbolMasters = [writer usedSymbolsInContainer: layer document: layer.documentData()).allValues()];

        var symbolArr = [NSMutableArray new];
        var symbolIDs = [NSMutableArray new];
        for (var i = 0; i < symbolMasters.count(); i++ ) {
            var s = symbolMasters[i]
            symbolIDs.addObject(s.symbolID());
            symbolArr.addObject(s.immutableModelObject())
        }

        var styleArr = [NSMutableArray new];
        // var sharedStyles = [writer usedSharedObjectsInDocument:context.document.documentData() layers: selectedLayers];
        // log("Found " + sharedStyles.count() + " shared styles")
        // log(sharedStyles)
        // for (var i = 0; i < sharedStyles.count(); i++ ) {
        //     var s = sharedStyles[i]
        //     log(s)
        //     styleArr.addObject(archiveLayer(s))
        // }

        // var archiver = [MSJSONDataArchiver new];

        archive["symbols"] = symbolArr;
        archive["styles"] = styleArr;

        const archiver = [MSJSONDataArchiver new];
        var aPtr = MOPointer.alloc().init();
        [archiver archivedDataWithRootObject: archive error: aPtr];
        if (aPtr.value()) {
            error("Comparison archive error: " + aPtr.value())
            return nil;
        }
        var comparisonData =  archiver.archivedData()
        return [SKLUtils sha1: comparisonData]
}


function archiveSelection(context, url) {

    var selectedLayers = context.document.selectedLayers().layers();
    if (selectedLayers.count() == 0) {
        showAlert("Select a layer")
        return
    }

    var comparisons = NSMutableArray.new()
    var bundles = NSMutableDictionary.new()

    for (var i = 0; i < selectedLayers.count(); i++) {
        var layer = selectedLayers[i];
        log(layer)

        var prepared = nil
        if (layer.isKindOfClass(MSSymbolInstance)) { prepared = prepareBundle(layer.symbolMaster()) }
        else { prepared = prepareBundle(layer) }

        var comparison = prepared["comparisonData"]
        var archive = prepared["archive"]
        [bundles setObject: archive forKey: comparison["id"]]
        comparisons.addObject(comparison)
        log(comparison)
    }


    // Move this to another step in final implementation
    // [archive writeToFile:url atomically:true];
}

function prepareBundle(layer) {

    var bundle = [NSMutableDictionary new];

    bundle["layer"] = layer.immutableModelObject()

    let writer = MSPasteboardLayersReaderWriter.alloc().init();
    let symbolMasters = [writer usedSymbolsInContainer: layer document: layer.documentData()).allValues();
    log("Found " + symbolMasters.count() + " embedded symbols")

    var symbolArr = [NSMutableArray new];
    var symbolIDs = [NSMutableArray new];
    for (var i = 0; i < symbolMasters.count(); i++ ) {
        var s = symbolMasters[i]
        symbolIDs.addObject(s.symbolID());
        symbolArr.addObject(s.immutableModelObject())
    }

    log("-------------")

    var styleArr = [NSMutableArray new];
    // var sharedStyles = [writer usedSharedObjectsInDocument:context.document.documentData() layers: selectedLayers];
    // log("Found " + sharedStyles.count() + " shared styles")
    // log(sharedStyles)
    // for (var i = 0; i < sharedStyles.count(); i++ ) {
    //     var s = sharedStyles[i]
    //     log(s)
    //     styleArr.addObject(archiveLayer(s))
    // }

    // var archiver = [MSJSONDataArchiver new];

    bundle["symbols"] = symbolArr;
    bundle["styles"] = styleArr;
    log(bundle)

    var archiver = [MSJSONDataArchiver new];
    var aPtr = MOPointer.alloc().init();
    [archiver archivedDataWithRootObject: bundle error: aPtr];
    log("Comparison archive error: " + aPtr.value())
    var comparisonData =  archiver.archivedData()
    var hash = [LingoHelpers sha1: comparisonData]
    log("Comparison hash: " + hash);


    var json = [NSMutableDictionary new];

    json["hash"] = hash
    json["name"] = layer.name()
    json["symbols"] = symbolIDs
    json["version_metadata"] = [MSArchiveHeader metadataForNewHeader];

    if (layer.isKindOfClass([MSSymbolMaster class])) {
        json["type"] = LingoAssetTypeSymbol;
        json["id"] = layer.symbolID();
    }
    else {
        json["type"] = LingoAssetTypeLayer;
        json["id"] = layer.objectID();
    }

    var archivedData = [MSJSONDataArchiver archivedDataWithHeaderAndRootObject: bundle]
    return {
        "comparisonData" : json,
        "archive" : archivedData
    }
}

function unarchive(context, url) {

    var archive = [[NSData alloc] initWithContentsOfFile:url];

    var header = [MSJSONDataUnarchiver unarchiveObjectWithData: archive];
    // var unarchiver = [[MSJSONDataUnarchiver alloc] initForReadingWithData: archive];
    // log("Archiver version: " + unarchiver.archiveVersion() + " current: " + unarchiver.currentVersion());
    // var data = [unarchiver decodeRoot];
    log("Unarchived root: " + header)
    var data = header.root();
    log(data)

    if (data == null) {
        showAlert("Error adding Lingo asset",
        "There was a problem adding your Lingo asset(s) to this document")
        return
    }

    var documentData = context.document.documentData()

    var layer = data["layer"]
    var styles = data["styles"]
    var symbols = data["symbols"]

    // Add nested symbols
    for (var i = 0; i < symbols.count(); i++) {
        var s = symbols[i]; // The immutable symbol
        documentData.addCopyOfMasterToDocumentIfNecessary(s.newMutableCounterpart());
    }

    if (layer.isKindOfClass(MSImmutableSymbolMaster)) {
        log("Found symbol")
        let s = layer.newMutableCounterpart()
        let existing = documentData.symbolWithID(s.symbolID())
        if (existing) {
            existing.syncPropertiesFromObject(s)
            context.document.showMessage("Updated Symbol")
        }
        else {
            documentData.addCopyOfMasterToDocumentIfNecessary(s);
            context.document.showMessage("Added Symbol")
        }
    }
    else if (layer.isKindOfClass(MSImmutableArtboardGroup)) {
        var l = layer.newMutableCounterpart()
        context.document.currentPage().addLayers([l])
        context.document.showMessage("Added layer")
    }
    else {
        context.document.showMessage("Unknown layer")
    }
}


function debug(context) {

  // print(context.plugin);

  // let menu = NSApplication.sharedApplication().mainMenu().itemWithTitle("Plugins").submenu().itemWithTitle("Lingo (Alpha)").submenu();
  // print(menu)
  // let sep = NSMenuItem.separatorItem();
  // print(sep)
  // menu.insertItem_atIndex(sep, 2);

  var win = [[NSPanel alloc] init];

  win.isFloatingPanel = true
  win.isReleasedWhenClosed = true
  win.hidesOnDeactivate = false
  win.titlebarAppearsTransparent = true
  win.hasShadow = false
  win.styleMask = NSWindowStyleMaskClosable | NSWindowStyleMaskResizable | NSWindowStyleMaskUnifiedTitleAndToolbar | NSWindowStyleMaskTitled

  let parent = context.document.documentWindow()
  let f = parent.frame().origin
  [win setFrame:NSMakeRect(f.x, f.y, 320, 100) display:false]

  let webView = [[WebView alloc] init];

  webView.mainFrame().loadHTMLString_baseURL("<html style='background-color: #FAFAFA;'>Hello World</html>", nil);
  webView.frame = NSMakeRect(0,0,200,200)

  // let inspector = context.document.inspectorController()
  // var vc = context.document.currentContentViewController()
  // inspector.view().addSubview(webView)

// let view = vc.view()
// view.addSubview(webView)
  // print(inspector.subviews())

  // for view in parent.contentView().subviews()[0].subviews() {
  //  if [win.contentView isKindOfClass:NSView] {
  //
  //   }
  // }


  win.contentView = webView;

  parent.addChildWindow_ordered(win, 1);
  win.makeKeyAndOrderFront(nil);

  // NSApplication.sharedApplication().runModalForWindow_(win)
  // [win setBackgroundColor:[NSColor colorWithPatternImage:[NSImage imageNamed:@"background.png"]]];

}



function printSelection(context) {

  function printSymbolMaster(s) {
    print("🔄 " + s.name() + ": " + s.symbolID());
    let instances = s.allInstances();
    for (var p = 0; p < instances.count(); p++) {
      let i = instances[p]
      print("\t✳️" + i.name() + ": " + i.objectID() + "  symbolID: " + i.symbolID());
    }
  }

  function printSymbolInstance(inst) {
    print("\t✳️" + inst.name() + ": " + inst.objectID() + "  symbolID: " + inst.symbolID());
    let master = inst.symbolMaster()
    print(master);
    if (master) {
      print("\t\t 🔄 " + master.name() + ": " + master.symbolID());
    }
    if (inst.overrides()) {
      print("\t\t" + inst.overrides().objectForKey(0));
    }
  }

  function printLayer(layer) {
    print(" ---- " + layer.class());
    let instances = layer.allSymbolInstancesInChildren().allObjects()
    for (var i = 0; i < instances.count(); i++) {
      printSymbolInstance(instances[i])
    }
  }

  var selectedLayers = context.selection;
  var selectionCount = selectedLayers.count();

  let docSymbols = context.document.documentData().allSymbols();
  let docStyles = context.document.documentData().layerStylesGeneric;
  let textStyles = context.document.documentData().layerTextStylesGeneric;

  print(docStyles)

  var docInstances = NSMutableArray.new()

  print("---- " + docSymbols.count() + " DOCUMENT SYMBOLS ------\n")
  for (var i = 0; i < docSymbols.count(); i++) {
    printSymbolMaster(docSymbols[i])
  }
  print("\n---- END DOCUMENT SYMBOLS------\n")

  if (selectionCount == 0) {
    print("⚠️ No selection. Select a symbol or artboard");
    return;
  }
  else if (selectionCount > 1) {
    print("2+ layers selected")
    return
  }

  var symbols = []
  var artboards = []
    let layer = selectedLayers[0]

    if (layer.isMemberOfClass([MSArtboardGroup class])) {
        print("🎨 1 Artboard selected: " + layer.objectID())
        printLayer(layer)
        print("\n")

        let writer = MSPasteboardLayersReaderWriter.alloc().init()
        let used = writer.usedSymbolsInContainer_document(layer, context.document.documentData());
        print(used);

        // let _immutableLayer = layer.immutableModelObject();
        // var layer2 = MSArtboardGroup.alloc().initWithImmutableModelObject(_immutableLayer)

        // let _archive = archiveLayer(layer);
        // let _unarchive = unarchiveLayer(_archive);
        // printLayer(_unarchive);

        let bundle = createBundle(layer);
        let _newLayer = unarchiveLayer(bundle["layer"]);
        // let _newLayer = MSArtboardGroup.alloc().initWithImmutableModelObject(_immutableLayer);
        let _newSymbols = bundle["symbols"];

        print("New layer is: " + _newLayer.class());
        print(_newSymbols.count() + " Symbols found in bundle");
        // print(_newLayer);
        printLayer(_newLayer);

/*
        let _instances = _newLayer.allSymbolInstancesInChildren().allObjects();
        print(_instances.count() + " INstnaces")
        for (var i = 0; i < _instances.count(); i++) {
          let _inst = _instances[i]
          // printSymbolInstance(_inst);
          let overrides = _inst.overrides();
          if (overrides) {
            print("Applying overrides");
            _inst.applyOverrides_allSymbols(overrides, true);
          }
        }
*/

        let _newSymbolKeys = _newSymbols.allKeys();
        for (var i = 0; i < _newSymbols.count(); i++) {
          let _key = _newSymbolKeys[i];
          let s = _newSymbols[_key];
          printSymbolMaster(unarchiveLayer(s));
        }
    }
    else if (layer.isKindOfClass([MSSymbolMaster class])) {
      print("🔄 1 Symbol selected: " + layer.symbolID());
      createBundle(layer);

    }
    else {
      print("Unsupported layer type: " + layer.className());
      return
    }
    // createBundle(layer);
}
