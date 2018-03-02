var that = this;
function run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomFromSeed = __webpack_require__(13);

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

module.exports = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
var config = {
  pluginId: 'jaerpollux.symbolsManager',
  previewsFolder: 'tmp',
  previewImageSize: {
    width: 200,
    height: 200
  }
};

exports['default'] = config;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomByte = __webpack_require__(14);

function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByte() );
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = encode;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = function (context) {
  var defaultPreferences = {
    licenseKey: ''
  };

  var symbolsList = (0, _createSymbolsList2['default'])(context);
  var webUI = new _sketchModuleWebView2['default'](context, 'index.html', {
    identifier: _config2['default'].pluginId,
    width: 900,
    height: 450,
    title: 'Symbols Manager',
    hideTitleBar: false,
    onlyShowCloseButton: true,
    shouldKeepAround: true,
    resizable: true,
    background: (0, _hexToNSColor2['default'])('F5F5F5'),
    onPanelClose: function () {
      function onPanelClose() {
        return (0, _cleanCacheFolder2['default'])();
      }

      return onPanelClose;
    }(),
    handlers: {
      onClickSave: function () {
        function onClickSave(symbols) {
          (0, _saveSymbolsList2['default'])(JSON.parse(symbols), context);
          (0, _cleanCacheFolder2['default'])();
          webUI.close();
        }

        return onClickSave;
      }(),
      onClickCancel: function () {
        function onClickCancel() {
          (0, _cleanCacheFolder2['default'])();
          webUI.close();
        }

        return onClickCancel;
      }(),
      loadSymbols: function () {
        function loadSymbols() {
          webUI.eval('window.symbolsList=' + JSON.stringify(symbolsList));
        }

        return loadSymbols;
      }(),
      openWeb: function () {
        function openWeb(url) {
          NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
        }

        return openWeb;
      }(),
      loadPreferences: function () {
        function loadPreferences() {
          var preferences = _sketchModuleUserPreferences2['default'].getUserPreferences(_config2['default'].pluginId, defaultPreferences);
          webUI.eval('window.preferences=' + JSON.stringify(preferences));
        }

        return loadPreferences;
      }(),
      saveLicense: function () {
        function saveLicense(licenseKey) {
          _sketchModuleUserPreferences2['default'].setUserPreferences(_config2['default'].pluginId, { licenseKey: licenseKey });
          var preferences = _sketchModuleUserPreferences2['default'].getUserPreferences(_config2['default'].pluginId, defaultPreferences);
          webUI.eval('window.preferences=' + JSON.stringify(preferences));
        }

        return saveLicense;
      }(),
      getPreviewImage: function () {
        function getPreviewImage(symbolId) {
          (0, _symbolPreviewImage2['default'])(context, symbolId);
        }

        return getPreviewImage;
      }()
    }
  });
  webUI.panel.setTitlebarAppearsTransparent(true);
  var minSize = { width: 700, height: 350 };
  webUI.panel.setContentMinSize(minSize);
};

var _sketchModuleWebView = __webpack_require__(4);

var _sketchModuleWebView2 = _interopRequireDefault(_sketchModuleWebView);

var _sketchModuleUserPreferences = __webpack_require__(7);

var _sketchModuleUserPreferences2 = _interopRequireDefault(_sketchModuleUserPreferences);

var _config = __webpack_require__(1);

var _config2 = _interopRequireDefault(_config);

var _createSymbolsList = __webpack_require__(8);

var _createSymbolsList2 = _interopRequireDefault(_createSymbolsList);

var _saveSymbolsList = __webpack_require__(19);

var _saveSymbolsList2 = _interopRequireDefault(_saveSymbolsList);

var _hexToNSColor = __webpack_require__(21);

var _hexToNSColor2 = _interopRequireDefault(_hexToNSColor);

var _symbolPreviewImage = __webpack_require__(22);

var _symbolPreviewImage2 = _interopRequireDefault(_symbolPreviewImage);

var _cleanCacheFolder = __webpack_require__(23);

var _cleanCacheFolder2 = _interopRequireDefault(_cleanCacheFolder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* globals NSUUID NSThread NSPanel NSMakeRect NSTexturedBackgroundWindowMask NSTitledWindowMask NSWindowTitleHidden NSClosableWindowMask NSColor NSWindowMiniaturizeButton NSWindowZoomButton NSFloatingWindowLevel WebView COScript NSWindowCloseButton NSFullSizeContentViewWindowMask NSVisualEffectView NSAppearance NSAppearanceNameVibrantLight NSVisualEffectBlendingModeBehindWindow NSLayoutConstraint NSLayoutRelationEqual NSLayoutAttributeLeft NSLayoutAttributeTop NSLayoutAttributeRight NSLayoutAttributeBottom NSResizableWindowMask */
var MochaJSDelegate = __webpack_require__(5)
var parseQuery = __webpack_require__(6)

var coScript = COScript.currentCOScript()

var LOCATION_CHANGED = 'webView:didChangeLocationWithinPageForFrame:'

function addEdgeConstraint (edge, subview, view, constant) {
  view.addConstraint(NSLayoutConstraint.constraintWithItem_attribute_relatedBy_toItem_attribute_multiplier_constant(
    subview,
    edge,
    NSLayoutRelationEqual,
    view,
    edge,
    1,
    constant
  ))
}
function fitSubviewToView (subview, view, constants) {
  subview.setTranslatesAutoresizingMaskIntoConstraints(false)

  addEdgeConstraint(NSLayoutAttributeLeft, subview, view, constants[0])
  addEdgeConstraint(NSLayoutAttributeTop, subview, view, constants[1])
  addEdgeConstraint(NSLayoutAttributeRight, subview, view, constants[2])
  addEdgeConstraint(NSLayoutAttributeBottom, subview, view, constants[3])
}

function WebUI (context, frameLocation, options) {
  options = options || {}
  var identifier = options.identifier || NSUUID.UUID().UUIDString()
  var threadDictionary = NSThread.mainThread().threadDictionary()

  var panel
  var webView

  // if we already have a panel opened, reuse it
  if (threadDictionary[identifier]) {
    panel = threadDictionary[identifier]
    panel.makeKeyAndOrderFront(null)

    var subviews = panel.contentView().subviews()
    for (var i = 0; i < subviews.length; i++) {
      if (subviews[i].isKindOfClass(WebView.class())) {
        webView = subviews[i]
      }
    }

    if (!webView) {
      throw new Error('Tried to reuse panel but couldn\'t find the webview inside')
    }

    return {
      panel: panel,
      eval: webView.stringByEvaluatingJavaScriptFromString,
      webView: webView
    }
  }

  panel = NSPanel.alloc().init()

  // Window size
  var panelWidth = options.width || 240
  var panelHeight = options.height || 180
  panel.setFrame_display(NSMakeRect(
    options.x || 0,
    options.y || 0,
    panelWidth,
    panelHeight
  ), true)

  // Titlebar
  panel.setTitle(options.title || context.plugin.name())
  if (options.hideTitleBar) {
    panel.setTitlebarAppearsTransparent(true)
    panel.setTitleVisibility(NSWindowTitleHidden)
  }

  // Hide minize and zoom buttons
  if (options.onlyShowCloseButton) {
    panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true)
    panel.standardWindowButton(NSWindowZoomButton).setHidden(true)
  }

  // Close window callback
  var closeButton = panel.standardWindowButton(NSWindowCloseButton)
  function closeHandler () {
    if (options.onPanelClose) {
      var result = options.onPanelClose()
      if (result === false) {
        return
      }
    }
    panel.close()
    threadDictionary.removeObjectForKey(options.identifier)
    coScript.setShouldKeepAround(false)
  }

  closeButton.setCOSJSTargetFunction(closeHandler)
  closeButton.setAction('callAction:')

  panel.setStyleMask(options.styleMask || (
    options.resizable
    ? (NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSResizableWindowMask | NSClosableWindowMask | NSFullSizeContentViewWindowMask)
    : (NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask | NSFullSizeContentViewWindowMask)
  ))
  panel.becomeKeyWindow()
  panel.setLevel(NSFloatingWindowLevel)

  // Appearance
  var backgroundColor = options.background || NSColor.whiteColor()
  panel.setBackgroundColor(backgroundColor)
  if (options.blurredBackground) {
    var vibrancy = NSVisualEffectView.alloc().initWithFrame(NSMakeRect(0, 0, panelWidth, panelHeight))
    vibrancy.setAppearance(NSAppearance.appearanceNamed(NSAppearanceNameVibrantLight))
    vibrancy.setBlendingMode(NSVisualEffectBlendingModeBehindWindow)

    // Add it to the panel
    panel.contentView().addSubview(vibrancy)
    fitSubviewToView(vibrancy, panel.contentView(), [0, 0, 0, 0])
  }

  threadDictionary[identifier] = panel

  if (options.shouldKeepAround !== false) { // Long-running script
    coScript.setShouldKeepAround(true)
  }

  // Add Web View to window
  webView = WebView.alloc().initWithFrame(NSMakeRect(
    0,
    options.hideTitleBar ? -24 : 0,
    options.width || 240,
    (options.height || 180) - (options.hideTitleBar ? 0 : 24)
  ))

  if (options.frameLoadDelegate || options.handlers) {
    var handlers = options.frameLoadDelegate || {}
    if (options.handlers) {
      var lastQueryId
      handlers[LOCATION_CHANGED] = function (webview, frame) {
        var query = webview.windowScriptObject().evaluateWebScript('window.location.hash')
        query = parseQuery(query)
        if (query.pluginAction && query.actionId && query.actionId !== lastQueryId && query.pluginAction in options.handlers) {
          lastQueryId = query.actionId
          try {
            query.pluginArgs = JSON.parse(query.pluginArgs)
          } catch (err) {}
          options.handlers[query.pluginAction].apply(context, query.pluginArgs)
        }
      }
    }
    var frameLoadDelegate = new MochaJSDelegate(handlers)
    webView.setFrameLoadDelegate_(frameLoadDelegate.getClassInstance())
  }
  if (options.uiDelegate) {
    var uiDelegate = new MochaJSDelegate(options.uiDelegate)
    webView.setUIDelegate_(uiDelegate.getClassInstance())
  }

  if (!options.blurredBackground) {
    webView.setOpaque(true)
    webView.setBackgroundColor(backgroundColor)
  } else {
    // Prevent it from drawing a white background
    webView.setDrawsBackground(false)
  }

  // When frameLocation is a file, prefix it with the Sketch Resources path
  if ((/^(?!http|localhost|www|file).*\.html?$/).test(frameLocation)) {
    frameLocation = context.plugin.urlForResourceNamed(frameLocation).path()
  }
  webView.setMainFrameURL_(frameLocation)

  panel.contentView().addSubview(webView)
  fitSubviewToView(webView, panel.contentView(), [
    0, options.hideTitleBar ? 0 : 24, 0, 0
  ])

  panel.center()
  panel.makeKeyAndOrderFront(null)

  return {
    panel: panel,
    eval: webView.stringByEvaluatingJavaScriptFromString,
    webView: webView,
    close: closeHandler
  }
}

WebUI.clean = function () {
  coScript.setShouldKeepAround(false)
}

module.exports = WebUI


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/* globals NSUUID MOClassDescription NSObject NSSelectorFromString NSClassFromString */

module.exports = function (selectorHandlerDict, superclass) {
  var uniqueClassName = 'MochaJSDelegate_DynamicClass_' + NSUUID.UUID().UUIDString()

  var delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, superclass || NSObject)

  delegateClassDesc.registerClass()

  // Storage Handlers
  var handlers = {}

  // Define interface
  this.setHandlerForSelector = function (selectorString, func) {
    var handlerHasBeenSet = (selectorString in handlers)
    var selector = NSSelectorFromString(selectorString)

    handlers[selectorString] = func

    /*
      For some reason, Mocha acts weird about arguments: https://github.com/logancollins/Mocha/issues/28
      We have to basically create a dynamic handler with a likewise dynamic number of predefined arguments.
    */
    if (!handlerHasBeenSet) {
      var args = []
      var regex = /:/g
      while (regex.exec(selectorString)) {
        args.push('arg' + args.length)
      }

      var dynamicFunction = eval('(function (' + args.join(', ') + ') { return handlers[selectorString].apply(this, arguments); })')

      delegateClassDesc.addInstanceMethodWithSelector_function_(selector, dynamicFunction)
    }
  }

  this.removeHandlerForSelector = function (selectorString) {
    delete handlers[selectorString]
  }

  this.getHandlerForSelector = function (selectorString) {
    return handlers[selectorString]
  }

  this.getAllHandlers = function () {
    return handlers
  }

  this.getClass = function () {
    return NSClassFromString(uniqueClassName)
  }

  this.getClassInstance = function () {
    return NSClassFromString(uniqueClassName).new()
  }

  // Convenience
  if (typeof selectorHandlerDict === 'object') {
    for (var selectorString in selectorHandlerDict) {
      this.setHandlerForSelector(selectorString, selectorHandlerDict[selectorString])
    }
  }
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function (query) {
  query = query.split('?')[1]
  if (!query) { return }
  query = query.split('&').reduce(function (prev, s) {
    var res = s.split('=')
    if (res.length === 2) {
      prev[decodeURIComponent(res[0])] = decodeURIComponent(res[1])
    }
    return prev
  }, {})
  return query
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

const SUITE_PREFIX = 'plugin.sketch.'

function isPresent (data) {
  return data != null
}

module.exports = {
  getUserPreferences: function (pluginName, defaultPrefs) {
    var prefs = {}
    var store = NSUserDefaults.alloc().initWithSuiteName(SUITE_PREFIX + pluginName)
    Object.keys(defaultPrefs).forEach(function (k) {
      if (typeof defaultPrefs[k] === 'boolean') {
        prefs[k] = isPresent(store.boolForKey(k)) ? Boolean(store.boolForKey(k)) : defaultPrefs[k]
      } else if (typeof defaultPrefs[k] === 'number') {
        prefs[k] = isPresent(store.doubleForKey(k)) ? store.doubleForKey(k) : defaultPrefs[k]
      } else if (typeof defaultPrefs[k] === 'string') {
        prefs[k] = isPresent(store.stringForKey(k)) ? '' + store.stringForKey(k) : defaultPrefs[k]
      } else if (Array.isArray(defaultPrefs[k])) {
        prefs[k] = store.arrayForKey(k) || defaultPrefs[k]
      } else {
        prefs[k] = store.dictionaryForKey(k) || defaultPrefs[k]
      }
    })
    return prefs
  },
  setUserPreferences: function (pluginName, prefs) {
    var store = NSUserDefaults.alloc().initWithSuiteName(SUITE_PREFIX + pluginName)
    Object.keys(prefs).forEach(function (k) {
      if (typeof prefs[k] === 'boolean') {
        store.setBool_forKey(prefs[k], k)
      } else if (typeof prefs[k] === 'number') {
        store.setDouble_forKey(prefs[k], k)
      } else {
        store.setObject_forKey(prefs[k], k)
      }
    })
    store.synchronize()
  }
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = function (context) {

  var document = context.document; // the current document (MSDocument)

  var symbols = document.documentData().localSymbols();
  var symbolsList = [];
  var parents = [];
  var count = 0;

  // Going through all symbols to create a symbolsList
  for (var i = 0; i < symbols.length; i++) {

    var symbol = symbols[i];

    /*
     * Take the symbol name create an array of folders plus name.
     * So Elements/Button/Normal becomes ['Element', Button, Normal]
     */
    var symbolPath = symbol.name();
    var symbolPathArray = symbolPath.split('/');
    var id = String(symbol.symbolID());

    // Going through the pathArray
    for (var j = 0; j < symbolPathArray.length; j++) {
      var pathName = symbolPathArray[j];
      var savingPath = symbolsList;

      if (parents.length > 0) {
        for (var parentId = 0; parentId < parents.length; parentId++) {
          var p = parents[parentId];

          oldSavingpath = savingPath;
          savingPath = oldSavingpath[p].children;
        }
      }

      // Check if it's a folder or a symbol
      if (j < symbolPathArray.length - 1) {
        var folderExists = -1;

        for (var k = 0; k < savingPath.length; k++) {
          var item = savingPath[k];
          if (isFolder(item, pathName)) {
            folderExists = k;
          }
        }

        if (folderExists != -1) {
          parents.push(folderExists);
        } else {

          // Adding ID to idPath
          var folderId = shortid.generate();

          savingPath.push({
            name: pathName,
            type: "folder",
            children: [],
            id: folderId
          });

          for (var k = 0; k < savingPath.length; k++) {
            var item = savingPath[k];
            if (isFolder(item, pathName)) {
              folderExists = k;
            }
          }

          parents.push(folderExists);
        }
      } else {
        count++;

        // Adding symbol to list
        savingPath.push({
          name: pathName,
          type: "symbol",
          id: id
        });

        // Reset parents
        parents = [];
      }
    }
  }
  log('[SYMBOLS MANAGER] Document symbols: ' + symbols.length + ' / Converted symbols: ' + count);
  return symbolsList;
};

var resolvePath = __webpack_require__(9);
var shortid = __webpack_require__(11);

function isFolder(item, name) {
  if (item.name === name && item.type === 'folder') {
    return true;
  }
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var Path = __webpack_require__(10)
/**
 *
 * @param {Object} o
 * @param {String} path
 * @returns {*}
 */
module.exports = function (o, path) {
  if (typeof path !== 'string') {
    throw new TypeError('path must be a string')
  }
  if (typeof o !== 'object') {
    throw new TypeError('object must be passed')
  }
  var pathObj = Path.get(path)
  if (!pathObj.valid) {
    throw new Error('path is not a valid object path')
  }
  return pathObj.getValueFrom(o)
}


/***/ }),
/* 10 */
/***/ (function(module, exports) {

// gutted from https://github.com/Polymer/observe-js/blob/master/src/observe.js
function noop () {}
function detectEval () {
  // Don't test for eval if we're running in a Chrome App environment.
  // We check for APIs set that only exist in a Chrome App context.
  if (typeof chrome !== 'undefined' && chrome.app && chrome.app.runtime) {
    return false
  }

  // Firefox OS Apps do not allow eval. This feature detection is very hacky
  // but even if some other platform adds support for this function this code
  // will continue to work.
  if (typeof navigator != 'undefined' && navigator.getDeviceStorage) {
    return false
  }

  try {
    var f = new Function('', 'return true;')
    return f()
  } catch (ex) {
    return false
  }
}

var hasEval = detectEval()

function isIndex (s) {
  return +s === s >>> 0 && s !== ''
}

function isObject (obj) {
  return obj === Object(obj)
}

var createObject = ('__proto__' in {}) ?
  function (obj) {
    return obj
  } :
  function (obj) {
    var proto = obj.__proto__
    if (!proto)
      return obj
    var newObject = Object.create(proto)
    Object.getOwnPropertyNames(obj).forEach(function (name) {
      Object.defineProperty(newObject, name,
        Object.getOwnPropertyDescriptor(obj, name))
    })
    return newObject
  }

function parsePath (path) {
  var keys = []
  var index = -1
  var c, newChar, key, type, transition, action, typeMap, mode = 'beforePath'

  var actions = {
    push: function () {
      if (key === undefined)
        return

      keys.push(key)
      key = undefined
    },

    append: function () {
      if (key === undefined)
        key = newChar
      else
        key += newChar
    }
  }

  function maybeUnescapeQuote () {
    if (index >= path.length)
      return

    var nextChar = path[index + 1]
    if ((mode == 'inSingleQuote' && nextChar == "'") ||
      (mode == 'inDoubleQuote' && nextChar == '"')) {
      index++
      newChar = nextChar
      actions.append()
      return true
    }
  }

  while (mode) {
    index++
    c = path[index]

    if (c == '\\' && maybeUnescapeQuote(mode))
      continue

    type = getPathCharType(c)
    typeMap = pathStateMachine[mode]
    transition = typeMap[type] || typeMap['else'] || 'error'

    if (transition == 'error')
      return // parse error

    mode = transition[0]
    action = actions[transition[1]] || noop
    newChar = transition[2] === undefined ? c : transition[2]
    action()

    if (mode === 'afterPath') {
      return keys
    }
  }

  return // parse error
}

var identStart = '[\$_a-zA-Z]'
var identPart = '[\$_a-zA-Z0-9]'
var identRegExp = new RegExp('^' + identStart + '+' + identPart + '*' + '$')

function isIdent (s) {
  return identRegExp.test(s)
}

var constructorIsPrivate = {}

function Path (parts, privateToken) {
  if (privateToken !== constructorIsPrivate)
    throw Error('Use Path.get to retrieve path objects')

  for (var i = 0; i < parts.length; i++) {
    this.push(String(parts[i]))
  }

  if (hasEval && this.length) {
    this.getValueFrom = this.compiledGetValueFromFn()
  }
}

var pathCache = {}

function getPath (pathString) {
  if (pathString instanceof Path)
    return pathString

  if (pathString == null || pathString.length == 0)
    pathString = ''

  if (typeof pathString != 'string') {
    if (isIndex(pathString.length)) {
      // Constructed with array-like (pre-parsed) keys
      return new Path(pathString, constructorIsPrivate)
    }

    pathString = String(pathString)
  }

  var path = pathCache[pathString]
  if (path)
    return path

  var parts = parsePath(pathString)
  if (!parts)
    return invalidPath

  var path = new Path(parts, constructorIsPrivate)
  pathCache[pathString] = path
  return path
}

Path.get = getPath

function formatAccessor (key) {
  if (isIndex(key)) {
    return '[' + key + ']'
  } else {
    return '["' + key.replace(/"/g, '\\"') + '"]'
  }
}

Path.prototype = createObject({
  __proto__: [],
  valid: true,

  toString: function () {
    var pathString = ''
    for (var i = 0; i < this.length; i++) {
      var key = this[i]
      if (isIdent(key)) {
        pathString += i ? '.' + key : key
      } else {
        pathString += formatAccessor(key)
      }
    }

    return pathString
  },

  getValueFrom: function (obj, directObserver) {
    for (var i = 0; i < this.length; i++) {
      if (obj == null)
        return
      obj = obj[this[i]]
    }
    return obj
  },

  iterateObjects: function (obj, observe) {
    for (var i = 0; i < this.length; i++) {
      if (i)
        obj = obj[this[i - 1]]
      if (!isObject(obj))
        return
      observe(obj, this[i])
    }
  },

  compiledGetValueFromFn: function () {
    var str = ''
    var pathString = 'obj'
    str += 'if (obj != null'
    var i = 0
    var key
    for (; i < (this.length - 1); i++) {
      key = this[i]
      pathString += isIdent(key) ? '.' + key : formatAccessor(key)
      str += ' &&\n     ' + pathString + ' != null'
    }
    str += ')\n'

    var key = this[i]
    pathString += isIdent(key) ? '.' + key : formatAccessor(key)

    str += '  return ' + pathString + ';\nelse\n  return undefined;'
    return new Function('obj', str)
  },

  setValueFrom: function (obj, value) {
    if (!this.length)
      return false

    for (var i = 0; i < this.length - 1; i++) {
      if (!isObject(obj))
        return false
      obj = obj[this[i]]
    }

    if (!isObject(obj))
      return false

    obj[this[i]] = value
    return true
  }
})

function getPathCharType (char) {
  if (char === undefined)
    return 'eof'

  var code = char.charCodeAt(0)

  switch (code) {
    case 0x5B: // [
    case 0x5D: // ]
    case 0x2E: // .
    case 0x22: // "
    case 0x27: // '
    case 0x30: // 0
      return char

    case 0x5F: // _
    case 0x24: // $
      return 'ident'

    case 0x20: // Space
    case 0x09: // Tab
    case 0x0A: // Newline
    case 0x0D: // Return
    case 0xA0: // No-break space
    case 0xFEFF: // Byte Order Mark
    case 0x2028: // Line Separator
    case 0x2029: // Paragraph Separator
      return 'ws'
  }

  // a-z, A-Z
  if ((0x61 <= code && code <= 0x7A) || (0x41 <= code && code <= 0x5A))
    return 'ident'

  // 1-9
  if (0x31 <= code && code <= 0x39)
    return 'number'

  return 'else'
}

var pathStateMachine = {
  'beforePath': {
    'ws': ['beforePath'],
    'ident': ['inIdent', 'append'],
    '[': ['beforeElement'],
    'eof': ['afterPath']
  },

  'inPath': {
    'ws': ['inPath'],
    '.': ['beforeIdent'],
    '[': ['beforeElement'],
    'eof': ['afterPath']
  },

  'beforeIdent': {
    'ws': ['beforeIdent'],
    'ident': ['inIdent', 'append']
  },

  'inIdent': {
    'ident': ['inIdent', 'append'],
    '0': ['inIdent', 'append'],
    'number': ['inIdent', 'append'],
    'ws': ['inPath', 'push'],
    '.': ['beforeIdent', 'push'],
    '[': ['beforeElement', 'push'],
    'eof': ['afterPath', 'push']
  },

  'beforeElement': {
    'ws': ['beforeElement'],
    '0': ['afterZero', 'append'],
    'number': ['inIndex', 'append'],
    "'": ['inSingleQuote', 'append', ''],
    '"': ['inDoubleQuote', 'append', '']
  },

  'afterZero': {
    'ws': ['afterElement', 'push'],
    ']': ['inPath', 'push']
  },

  'inIndex': {
    '0': ['inIndex', 'append'],
    'number': ['inIndex', 'append'],
    'ws': ['afterElement'],
    ']': ['inPath', 'push']
  },

  'inSingleQuote': {
    "'": ['afterElement'],
    'eof': ['error'],
    'else': ['inSingleQuote', 'append']
  },

  'inDoubleQuote': {
    '"': ['afterElement'],
    'eof': ['error'],
    'else': ['inDoubleQuote', 'append']
  },

  'afterElement': {
    'ws': ['afterElement'],
    ']': ['inPath', 'push']
  }
}

var invalidPath = new Path('', constructorIsPrivate)
invalidPath.valid = false
invalidPath.getValueFrom = invalidPath.setValueFrom = function () {}

module.exports = Path


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(12);


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(0);
var encode = __webpack_require__(2);
var decode = __webpack_require__(15);
var build = __webpack_require__(16);
var isValid = __webpack_require__(17);

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(18) || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.decode = decode;
module.exports.isValid = isValid;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

function randomByte() {
    if (!crypto || !crypto.getRandomValues) {
        return Math.floor(Math.random() * 256) & 0x30;
    }
    var dest = new Uint8Array(1);
    crypto.getRandomValues(dest);
    return dest[0] & 0x30;
}

module.exports = randomByte;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(0);

/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

module.exports = decode;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var encode = __webpack_require__(2);
var alphabet = __webpack_require__(0);

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + encode(alphabet.lookup, version);
    str = str + encode(alphabet.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode(alphabet.lookup, counter);
    }
    str = str + encode(alphabet.lookup, seconds);

    return str;
}

module.exports = build;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(0);

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var characters = alphabet.characters();
    var len = id.length;
    for(var i = 0; i < len;i++) {
        if (characters.indexOf(id[i]) === -1) {
            return false;
        }
    }
    return true;
}

module.exports = isShortId;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = 0;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = function (symbols, context) {
  var document = context.document;
  var documentData = document.documentData();
  var counter = 0;

  symbols = (0, _flattenSymbolList2['default'])(symbols);

  for (var i = 0; i < symbols.length; i++) {
    var symbol = symbols[i];
    var symbolName = symbol.name;
    var symbolId = symbol.symbolId;
    var targetSymbol = documentData.symbolWithID(symbolId);

    // If curren symbol name is different then new one, we change it

    if (targetSymbol.name() != symbolName) {
      targetSymbol.name = symbolName;
      counter++;
    }
  }

  // Returning confirmation message
  if (counter > 0) {
    context.document.showMessage(counter + ' symbol changed');
  } else if (counter > 0) {
    context.document.showMessage(counter + ' symbols changed');
  } else {
    context.document.showMessage('No symbols changed');
  }
};

var _flattenSymbolList = __webpack_require__(20);

var _flattenSymbolList2 = _interopRequireDefault(_flattenSymbolList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/***/ }),
/* 20 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = function (symbolsList) {
  var flatList = [];
  var tempPath = '';

  var removeLastFolder = function () {
    function removeLastFolder(path) {
      path = path.substring(0, path.lastIndexOf('/'));
      path = path.substring(0, path.lastIndexOf('/'));
      if (path != '') {
        path += '/';
      }
      return path;
    }

    return removeLastFolder;
  }();

  var flattenList = function () {
    function flattenList(targetList) {
      targetList.map(function (listItem, itemId) {
        if (listItem.hasOwnProperty('children')) {
          tempPath += listItem.name + '/';
          flattenList(listItem.children);
        } else {
          flatList.push({
            name: tempPath + listItem.name,
            symbolId: listItem.id
          });
        }

        if (targetList.length == itemId + 1) {
          tempPath = removeLastFolder(tempPath);
        }

        if (listItem.hasOwnProperty('children') && listItem.children.length == 0) {
          tempPath = removeLastFolder(tempPath);
        }
      });
    }

    return flattenList;
  }();
  flattenList(symbolsList);

  return flatList;
};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (hex) {
	var r = parseInt(hex.substring(0, 2), 16) / 255,
	    g = parseInt(hex.substring(2, 4), 16) / 255,
	    b = parseInt(hex.substring(4, 6), 16) / 255,
	    a = 1;
	return NSColor.colorWithRed_green_blue_alpha(r, g, b, a);
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = function (context, symbolId) {
  var document = context.document;
  var documentData = document.documentData();
  var targetSymbol = documentData.symbolWithID(symbolId);
  var path = this.context.scriptPath.stringByDeletingLastPathComponent() + '/' + _config2['default'].previewsFolder + '/' + symbolId + '.tiff';

  saveImageSlice(document, targetSymbol, path, 1, "tiff", true);
};

var _config = __webpack_require__(1);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function saveImageSlice(doc, layer, path, scale, format, excludeOverlaps) {
  var ancestry = MSImmutableLayerAncestry.ancestryWithMSLayer(layer);
  var exportRequest = MSExportRequest.exportRequestsFromLayerAncestry_(ancestry).firstObject();
  exportRequest.format = format;
  var scaleX = _config2['default'].previewImageSize.width / exportRequest.rect().size.width;
  var scaleY = _config2['default'].previewImageSize.height / exportRequest.rect().size.height;
  var scale = scaleX < scaleY ? scaleX : scaleY;
  scale = scale > 2 ? 2 : scale;
  exportRequest.scale = scale;
  doc.saveArtboardOrSlice_toFile(exportRequest, path);
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = function () {
  var path = this.context.scriptPath.stringByDeletingLastPathComponent() + '/' + _config2['default'].previewsFolder + '/';
  var error = null;
  var result = NSFileManager.defaultManager().removeItemAtPath_error(path, error);
  if (error != null) {
    throw new Error(error);
  }
  return result;
};

var _config = __webpack_require__(1);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = run.bind(this, 'default')
