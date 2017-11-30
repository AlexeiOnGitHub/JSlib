/*
 * Title:       Javascript. Core library.
 * Description: 
 * License:     MIT License
 * Company:     N/A
 * Author:      Alexei KUCHUMOV
 * Source:      https://github.com/AlexeiOnGitHub/JSlib
 *
 *  Modification author mnemonics:
 *    Mnemonic  Author
 *    --------  ----------
 *    AK        A.Kuchumov
 *
 *  Modifications:
 *    Version   Date        Auth  Description
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01b08  30.11.2017  AK    1. Multi-browser operation.
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01b07  25.10.2017  AK    1. load(): Add load resource functionality.
 *              26.10.2017        2. define(): Changed to support module description and inheritance
 *                                3. Add include(): Check loaded modules (previously it was in define())
 *              16.11.2017  AK    4. new js.define is used to define module
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01b06  05.10.2017  AK    1. Add hashCode() function to String prototype
 *                                2. Add define() function to check and define modules
 *                                3. load(): Log level changed from 'info' to 'debug'
 *                                4. Add isObject() and isArray() functions
 *                                5. Add uniq() function to build from given array an array with uniq values
 *                                6. Add stringify() function to build string representation for any item
 *                                7. Add set of is...Level() functions to check log level 
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01b05  14.09.2017  AK    1. Add isFunction(): Check if argument is a function.
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01b04  12.08.2016  AK    1. Add eval(): Executes function passing modules as parameters.
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01b03  16.03.2016  AK    1. Add setStrongMode(): strong mode on/off switch
 *                                2. Add checkStrong(): throws exception is strong mode is on
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01b02  15.01.2016  AK    1. Add doubleClickDetector(): if someone "doubleclicks" different buttons
 *                                   it is treated now as single click on the last button.
 *                                2. getDoubleClickDetector() is deprecated now.
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01b01  14.01.2016  AK    1. load css-modules
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01a01  22.01.2015  AK    1. initial creation
 *    --------  ----------  ----  ---------------------------------------------
 */

;(function (){

    //----------------------------------------------------------
    var js = {};
    var _module = "js";
    var _version = {};
    //-- version
    _version.hver   = "01";
    _version.lver   = "01";
    _version.letter = "b";
    _version.patch  = "08";
    _version.full = _version.hver+"-"+_version.lver+_version.letter+_version.patch;
    js.__module = _module;
    js.__version = _version.full;

    //----------------------------------------------------------
    //-- IE detector (v6-v7-v8-v9-v10-v11)
    //-- based on 
    //--   https://stackoverflow.com/a/20411654
    //--   https://stackoverflow.com/a/21712356
    //--
    //-- Defaults strings:
    //--   IE 10: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)"
    //--   IE 11: "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko"
    //--   Edge:  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0"
    //----------------------------------------------------------

    js.isIE = /*boolean*/ function () {
        // CODE
        return navigator.userAgent.indexOf('MSIE')!==-1 || 
               navigator.appVersion.indexOf('Trident/') > 0;
    };
    //--
    js.detectIE = /*int or boolean*/ function () {
        // VARS
        var _ua = window.navigator.userAgent;
        var _msie = _ua.indexOf('MSIE ');
        var _trident = _ua.indexOf('Trident/');
        var _edge = _ua.indexOf('Edge/');
        var _idx;
        // CODE
        if (_msie>0) { // IE 10 or older => return version number
            return parseInt(_ua.substring(_msie+5, _ua.indexOf('.', _msie)), 10);
        }
        if (_trident>0) { // IE 11 => return version number
            _idx = _ua.indexOf('rv:');
            return parseInt(_ua.substring(_idx+3, _ua.indexOf('.', _idx)), 10);
        }
        if (_edge>0) { // Edge => return version number
            return parseInt(_ua.substring(_edge+5, _ua.indexOf('.', _edge)), 10);
        }
        return false; // other browsers
    };

    //----------------------------------------------------------
    //-- add if not supported natively:
    //--    indexOf(), lastIndexOf(), forEach(), map(), filter(), every(), some()
    //-- based on https://stackoverflow.com/questions/2790001/fixing-javascript-array-functions-in-internet-explorer-indexof-foreach-etc
    //----------------------------------------------------------

    if (!("indexOf" in Array.prototype)) {
        Array.prototype.indexOf = /*int*/ function (/*Object*/ obj_, /*int?*/ pos_) {
            // VAR
            var _len = this.length;
            // CODE
            pos_ = pos_ || 0;
            pos_ += pos_<0?_len:0;
            pos_ = pos_<0?0:pos_;
            while (pos_<_len){
                if (pos_ in this && this[pos_]===obj_){return pos_;}
                pos_++;
            } //-- end while
            return -1;
        };
    } //-- end if
    if (!("lastIndexOf" in Array.prototype)) {
        Array.prototype.lastIndexOf = /*int*/ function (/*Object*/ obj_, /*int?*/ pos_) {
            // VAR
            var _len = this.length;
            // CODE
            pos_ = pos_ || _len-1;
            pos_ += pos_<0?_len:0;
            pos_ = pos_<_len?pos_:_len-1;
            while (pos_>=0){
                if (pos_ in this && this[pos_]===obj_){return pos_;}
                pos_--;
            } //-- end while
            return -1;
        };
    } //-- end if
    if (!("forEach" in Array.prototype)) {
        Array.prototype.forEach = /*int*/ function (/*Function*/ func_, /*Object?*/ ctx_) {
            // VAR
            var _len = this.length, _idx = 0;
            // CODE
            while (_idx<_len){
                if (_idx in this) {func_.call(ctx_, this[_idx], _idx, this);}
                _idx++;
            } //-- end while
        };
    } //-- end if
    if (!("map" in Array.prototype)) {
        Array.prototype.map = /*Array*/ function (/*Function*/ func_, /*Object?*/ ctx_) {
            // VAR
            var _len = this.length, _idx = 0, _rv = new Array(_len);
            // CODE
            while (_idx<_len){
                if (_idx in this) {_rv[_idx] = func_.call(ctx_, this[_idx], _idx, this);}
                _idx++;
            } //-- end while
            return _rv;
        };
    } //-- end if
    if (!("filter" in Array.prototype)) {
        Array.prototype.filter = /*Array*/ function (/*Function*/ func_, /*Object?*/ ctx_) {
            // VAR
            var _len = this.length, _idx = 0, _rv = [], _val;
            // CODE
            while (_idx<_len){
                if (_idx in this) {
                    _val = this[_idx];
                    if (func_.call(ctx_, _val, _idx, this)){
                        _rv.push(_val);
                    } //-- end if
                } //-- end if
                _idx++;
            } //-- end while
            return _rv;
        };
    } //-- end if
    if (!("every" in Array.prototype)) {
        Array.prototype.every = /*Array*/ function (/*Function*/ func_, /*Object?*/ ctx_) {
            // VAR
            var _len = this.length, _idx = 0;
            // CODE
            while (_idx<_len){
                if (_idx in this && !func_.call(ctx_, this[_idx], _idx, this)){
                    return false;
                } //-- end if
                _idx++;
            } //-- end while
            return true;
        };
    } //-- end if
    if (!("some" in Array.prototype)) {
        Array.prototype.some = /*Array*/ function (/*Function*/ func_, /*Object?*/ ctx_) {
            // VAR
            var _len = this.length, _idx = 0;
            // CODE
            while (_idx<_len){
                if (_idx in this && func_.call(ctx_, this[_idx], _idx, this)){
                    return true;
                } //-- end if
                _idx++;
            } //-- end while
            return false;
        };
    } //-- end if

    //----------------------------------------------------------
    //-- 'upgrade' Object with 'keys'
    //-- based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    //----------------------------------------------------------
    
    if (!Object.keys){
        Object.keys = (function() {
            'use strict';
            // VARS
            var _hasOwnProperty = Object.prototype.hasOwnProperty,
                _hasDontEnumBug = !({ toString: null }).propertyIsEnumerable("toString"),
                _dontEnums = ["toString",
                              "toLocaleString",
                              "valueOf",
                              "hasOwnProperty",
                              "isPrototypeOf",
                              "propertyIsEnumerable",
                              "constructor",
                             ],
                _dontEnumsLength = _dontEnums.length;
            // CODE
            return function(obj_) {
                // VARS
                var _rv=[];
                // CODE
                if (obj_===null || (!js.isObject(obj_) && !js.isFunction(obj_))){
                    throw new Error("Object.keys() is called on non-object");
                }
                for (var prop in obj_){
                    if (obj_.hasOwnProperty(prop)){
                        _rv.push(prop);
                    } //-- end if
                } //-- end for
                if (_hasDontEnumBug) {
                    _dontEnums.forEach(function(x){
                        // CODE
                        if (obj_.hasOwnProperty(x)){
                            _rv.push(x);
                        } //-- end if
                    });
                }
                return _rv;
            };
        }());
    } //-- end if

    //----------------------------------------------------------
    //-- 'upgrade' Array with 'reduce' and 'reduceRight'
    //-- based on 
    //--   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    //--   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
    //----------------------------------------------------------

    if (!Array.prototype.reduce) {
        Array.prototype.reduce = /*Object*/ function (/*Function*/ func_, /*Object?*/ init_) {
            // VARS
            var _ctx, _len, _idx, _val;
            // CODE
            if (this===null || this===undefined){
                throw new Error("Function reduce() called on null or undefined or .");
            } //-- end if
            if (!js.isFunction(func_)){throw new Error("Parameter 'function' is not a Function.");}
            _ctx = Object(this);
            _len = _ctx.length >>> 0; 
            _idx = 0;
            if (arguments.length>1){
                _val = arguments[1];
            }else{
                while (_idx<_len && !(_idx in _ctx)) {_idx++;}
                if (_idx>=len) {
                    throw new Error("Reduce of empty array with no initial value");
                } //-- end if
                _val = _ctx[_idx++];

            } //-- end if
            while (_idx<_len){
                if (_idx in _ctx) {
                    _val = func_(_val, _ctx[_idx], _idx, _ctx);
                }
                _idx++;
            } //-- end while
            return _val;
        };
        Array.prototype.reduceRight = /*Object*/ function (/*Function*/ func_, /*Object?*/ init_) {
            // VARS
            var _ctx, _len, _idx, _val;
            // CODE
            if (this===null || this===undefined){
                throw new Error("Function reduce() called on null or undefined or .");
            } //-- end if
            if (!js.isFunction(func_)){throw new Error("Parameter 'function' is not a Function.");}
            _ctx = Object(this);
            _len = _ctx.length >>> 0; 
            _idx = _len - 1;
            if (arguments.length>1){
                _val = arguments[1];
            }else{
                while (_idx>=0 && !(_idx in _ctx)) {_idx--;}
                if (_idx<0) {
                    throw new Error("Reduce of empty array with no initial value");
                } //-- end if
                _val = _ctx[_idx--];

            } //-- end if
            while (_idx>=0){
                if (_idx in _ctx) {
                    _val = func_(_val, _ctx[_idx], _idx, _ctx);
                }
                _idx--;
            } //-- end while
            return _val;
        };
    }

    //----------------------------------------------------------
    //-- 'upgrade' NodeList, HTMLCollection and FileList to Array
    //-- based on http://stackoverflow.com/questions/13957354/how-to-have-foreach-available-on-pseudo-arrays-returned-by-queryselectorall [10]
    //----------------------------------------------------------
    if (js.detectIE()){
        ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'every', 'some'].forEach(function (p){
            HTMLSelectElement.prototype[p] = Array.prototype[p];
        });
    }else{
        ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'every', 'some'].forEach(function (p){
            HTMLCollection.prototype[p] = NodeList.prototype[p] = FileList.prototype[p] = Array.prototype[p];
        });
        ['indexOf'].forEach(function (p){
            HTMLCollection.prototype[p] = Array.prototype[p];
        });
        ['join'].forEach(function (p){
            Uint8Array.prototype[p] = Array.prototype[p];
        });
        ['forEach'].forEach(function (p){
            Uint8ClampedArray.prototype[p] = Array.prototype[p];
        });
    }

    //----------------------------------------------------------
    //-- 'upgrade' String with 'startsWith' and 'endsWith' functions
    //-- based on http://stackoverflow.com/questions/280634/endswith-in-javascript
    //----------------------------------------------------------
    if (typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = 
            function (prefix_){return this.lastIndexOf(prefix_, 0)===0;};
    }

    if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = 
            function (suffix_){return this.indexOf(suffix_, this.length-((suffix_ && suffix_.length) || 0))!==-1;};
    }

    //----------------------------------------------------------
    //-- 'upgrade' String with 'hashCode' function
    //-- based on http://stackoverflow.com/questions/280634/endswith-in-javascript
    //----------------------------------------------------------

    if (typeof String.prototype.hashCode !== 'function') {
        String.prototype.hashCode = function() {
            // VARS
            var _hash = 0, _idx;
            // CODE
            for (_idx=0; _idx<this.length; _idx++) {
                _hash  = ((_hash << 5) - _hash) + this.charCodeAt(_idx);
                _hash |= 0; // Convert to 32bit integer
            }
            return _hash;
        };
    }

    //----------------------------------------------------------
    //-- 'upgrade' Element, HTMLDocument & Window with addEventListener/removeEventListener for IE8
    //-- based on https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    //----------------------------------------------------------

    if (!Event.prototype.preventDefault){
        Event.prototype.preventDefault = function (){this.returnValue=false;};
    }
    if (!Event.prototype.stopPropagation){
        Event.prototype.stopPropagation = function(){this.cancelBubble=true;};
    }
    if (!Element.prototype.addEventListener){
        var _eventListeners=[];
        var _addEventListener = /*void*/ function(/*String*/ type_, /*Function*/ func_){
            // VARS
            var _self = this;
            var _wrapper = function (e_){
                // CODE
                e_.target = e_.srcElement;
                e_.currentTarget = _self;
                if (typeof func_.handleEvent != 'undefined') {
                    func_.handleEvent(e_);
                }else{
                    func_.call(_self, e_);
                }
            };
            // CODE
            if (type_=="DOMContentLoaded") {
                var _wrapper2 = function (e_){
                    // CODE
                    if (document.readyState=="complete") {
                        _wrapper(e_);
                    }
                };
                document.attachEvent("onreadystatechange", _wrapper2);
                _eventListeners.push({object: this, type: type_, listener: func_, wrapper: _wrapper2});
        
                if (document.readyState=="complete") {
                    // VARS
                    var _e = new Event();
                    // CODE
                    _e.srcElement = window;
                    _wrapper2(_e);
                }
            }else{
                this.attachEvent("on"+type_, _wrapper);
                _eventListeners.push({object: this, type: type_, listener: func_, wrapper: _wrapper});
            }
        };
        var _removeEventListener = /*void*/ function(/*String*/ type_, /*Function*/ func_){
            // VARS
            var _counter = 0;
            // CODE
            while (_counter<_eventListeners.length) {
                var _eventListener = _eventListeners[counter];
                if (_eventListener.object==this && 
                    _eventListener.type==type_ && 
                    _eventListener.listener==func_) {
                    if (type_=="DOMContentLoaded") {
                        this.detachEvent("onreadystatechange", _eventListener.wrapper);
                    }else{
                        this.detachEvent("on"+type_, _eventListener.wrapper);
                    }
                    _eventListeners.splice(_counter, 1);
                    break;
                }
                ++_counter;
            }
        };
        Element.prototype.addEventListener = _addEventListener;
        Element.prototype.removeEventListener = _removeEventListener;
        if (HTMLDocument){
            HTMLDocument.prototype.addEventListener = _addEventListener;
            HTMLDocument.prototype.removeEventListener = _removeEventListener;
        }
        if (Window){
            Window.prototype.addEventListener = _addEventListener;
            Window.prototype.removeEventListener = _removeEventListener;
        }
    }

    //----------------------------------------------------------
    //-- property processing
    //----------------------------------------------------------

    //----------------------------------------------------------
    js.evalProperty = function (/*Object*/ ctx_, /*String*/ prop_, /*Object*/ val_, /*Boolean*/ set_){
        // VAR
        var _rv = null;
        // CODE
        if (ctx_){
        //console.log(">>> js.evalProperty():   #1");
            if (set_){
                if (!ctx_[prop_]){
                    ctx_[prop_] = (val_||{});
                }
                _rv = ctx_[prop_];
            }else if (!prop_){
                _rv = ctx_;
            }else if (!ctx_[prop_] && val_){
                ctx_[prop_] = val_;
                _rv = ctx_[prop_];
            }else{
                _rv = ctx_[prop_];
            }
        }
        return _rv;
    };

    //----------------------------------------------------------
    js.evalPath = function (/*Object*/ ctx_, /*String*/ prop_, /*Object*/ val_, /*Boolean*/ set_){
        // VAR
        var _obj;
        var _idx = prop_.indexOf('.');
        // CODE
        if (_idx<0){
            return js.evalProperty(ctx_, prop_, val_, set_);
        }else{
            _obj = js.evalProperty(ctx_, prop_.substring(0, _idx), null, set_);
            return (_obj || set_) && js.evalPath(_obj, prop_.substring(_idx+1), val_, set_);
        }
    };

    //----------------------------------------------------------
    js.setProperty = function (/*String*/ path_, /*String*/ prop_, /*Object*/ val_){
        // CODE
        return js.evalPath(window, !path_?prop_:(path_+"."+prop_), val_, true);
    };

    //----------------------------------------------------------
    js.getProperty = function (/*String*/ path_, /*String*/ prop_){
        // CODE
        return js.evalPath(window, !path_?prop_:(path_+"."+prop_), null, false);
    };

    //----------------------------------------------------------
    //-- module processing
    //----------------------------------------------------------

    //----------------------------------------------------------
    // Parameters:
    //   - modules: array of properties
    //   - func:    function to execute
    //   - params:  array of 
    // Returns: nothing
    // Executes function with array of objects determinated by array of string
    js.eval = function (/*Array*/ modules_, /*Function*/ func_, /*Array?*/ params_) {
        // CODE
        func_.apply(func_, modules_.map(function (x){
            // VAR
            var _mod = js.getProperty("", x);
            // CODE
            if (!_mod){
                throw new Error("Module '"+x+"' is absent.");
            } //-- end if
            return _mod;
        }));
    };

    //----------------------------------------------------------
    // Parameters:
    //   - name:    aggregated name of module
    //   - modules: array of properties
    //   - func:    function to execute
    // Returns: nothing
    // Executes function with array of objects determinated by array of string and register result
    js.regeval = function (/*String*/ name_, /*Array*/ modules_, /*Function*/ func_) {
        // VAR
        var _idx = name_.lastIndexOf('.');
        // CODE
        if (_idx<0){
            js.setProperty("", name_, func_);
        }else{
            js.setProperty(name_.substring(0, _idx), name_.substring(_idx+1), func_);
        } //-- end if
        js.eval(modules_, func_);
    };

    //----------------------------------------------------------
    // Parameters:
    //      descriptor: object with module name and version
    //      entities:   array of 'parents'
    //      func:       module to define
    //
    // Returns: nothing
    //
    // Checks that modules are defined and defines new module with given name
    //
    //--
    js.define = /*void*/ function (/*Object*/ descriptor_, /*Array*/ ancestors_, /*Function*/ func_) {
        // VARS
        var _items, _class, _package, _ancestors=[], _roots=[];
        // CODE
        if (!descriptor_){throw new Error("Parameter 'descriptor' is null.");}
        if (!js.isObject(descriptor_)){throw new Error("Parameter 'descriptor' is not an Object.");}
        if (!js.isString(descriptor_.module)){throw new Error("Parameter 'descriptor.module' is not valid; null");}
        if (!js.isString(descriptor_.version)){throw new Error("Parameter 'descriptor.version' is not a String.");}
        if (!ancestors_ || !js.isArray(ancestors_) || 
            ancestors_.length>0 && !ancestors_.every(function(x){return js.isFunction(x);})){
            throw new Error("Parameter 'ancestors' is not an Array of Functions.");
        } //-- end if
        if (!js.isFunction(func_)){throw new Error("Parameter 'function' is not a Function.");}
        //--
        _items = descriptor_.module.split(".");
        if (_items.some(function(x){return x.length==0;})){
            throw new Error("Parameter 'descriptor.module' is not valid; empty component");
        }
        _class = _items.pop();
        if (_class.charAt(0).match("^[a-z]$")){
            throw new Error("Parameter 'descriptor.module' is not valid; class name starts from [a..z]");
        }
        _items.forEach(function(x, i){
            // CODE
            if (!x.charAt(0).match("^[a-z]$")){
                throw new Error("Parameter 'descriptor.module' is not valid; package component does not start from [a..z]");
            }
        });
        _package = _items.join(".");
        //--
        func_.prototype = ancestors_.map(function(x){return new x();}).reduce(function(x, y){
            // CODE
            for (var prop in y){
                if (y.hasOwnProperty(prop)){
                    x[prop] = y[prop];
                } //-- end if
            } //-- end for
            _ancestors.push(y.constructor);
            _roots = _roots.concat(y.constructor.__roots);
            return x;
        }, {});
        if (_roots.length==0){_roots=[func_];}
        func_.prototype.getClass = function(){return _class;};
        func_.prototype.getPackage = function(){return _package;};
        func_.prototype.getModule  = function(){return descriptor_.module;};
        func_.prototype.getVersion = function(){return descriptor_.version;};
        func_.prototype.getInfo    = function(){return "["+_class+"]:'"+descriptor_.module+"' (ver:"+descriptor_.version+")";};
        func_.prototype.getAncestors = function(){return _ancestors;};
        func_.prototype.getRoots = function(){return _roots;};
        func_.prototype.constructor = func_;
        func_.__module = descriptor_.module;
        func_.__roots = _roots;
        //--
        js.setProperty(_package, _class, func_);
        if (js.getProperty(_package, _class)!==func_){
            throw new Error("Failed to define module '"+descriptor_.module_+"'.");
        } //-- end if
    };

    //----------------------------------------------------------
    // Parameters:
    //   - modules: list of modules to load: script, CSS or resource
    //   - func:    function to execute (optional)
    // Returns: nothing
    // Loads modules one after another, after all executes function (if specified)
    js.load = /*void*/ function (/*Array*/ modules_, /*Function*/ func_) {
        // VAR
        var _opt = false, _mod, _elem;
        // CODE
        if (modules_ && modules_.length){
            if (modules_.length>50){throw new Error("Too many modules: ", modules_);} //-- end if
            //-- extract next module name 
            if (!modules_.shift || !modules_.unshift){
                throw new Error("Parameter 'modules' is not an array.");
            } //-- end if
            _mod = modules_.shift();
            if (!js.isString(_mod)){
                throw new Error("Array in parameter 'modules' contains non-string value.");
            } //-- end if
            if (_mod.startsWith("!")){
                _opt = true;
                _mod = _mod.substring(1);
            } //-- end if
            if (_mod.toLowerCase().startsWith("mvc:")){
                _mod = _mod.substring(4);
                modules_.unshift((_opt?"!":"")+_mod+"v.js");
                modules_.unshift((_opt?"!":"")+_mod+"c.js");
                modules_.unshift((_opt?"!":"")+_mod+"m.js");
                js.load(modules_, func_);
            }else{
                js.logDebug("loading "+(_opt?"(optional) ":"")+_mod);
                //-- check if CSS or script
                if (_mod.toLowerCase().startsWith("res:")){
                    _loadResource(
                        _mod.substring(4),
                        function () {
                            // CODE
                            js.logDebug("  resource loaded: ", _mod.substring(4));
                            js.load(modules_, func_);
                        },
                        function () {
                            // CODE
                            if (!_opt){
                                throw new Error("Resource not loaded: "+_mod.substring(4));
                            } //-- end if
                            js.logWrn("Resource not loaded: "+_mod.substring(4));
                            js.load(modules_, func_);
                        }
                    );
                }else if (_mod.toLowerCase().endsWith(".css")){
                    _loadCSS(
                        _mod, 
                        function () {
                            // CODE
                            js.logDebug("  CSS loaded: ", _mod);
                            js.load(modules_, func_);
                        },
                        function () {
                            // CODE
                            if (!_opt){
                                throw new Error("CSS not loaded: "+_mod);
                            } //-- end if
                            js.logWrn("CSS not loaded: "+_mod);
                            js.load(modules_, func_);
                        }
                    );
                }else if (_mod.toLowerCase().endsWith(".js")){
                    _loadJS(
                        _mod,
                        function () {
                            // CODE
                            js.logDebug("  JS loaded: ", _mod);
                            js.load(modules_, func_);
                        },
                        function () {
                            // CODE
                            if (!_opt){
                                throw new Error("JS not loaded: "+_mod);
                            } //-- end if
                            js.logWrn("JS not loaded: "+_mod);
                            js.load(modules_, func_);
                        }
                    );
                }else{
                    if (!_opt){
                        throw new Error("Parameter 'modules' contains module of unsupported type; module:["+_mod+"].");
                    } //-- end if
                    js.logWrn("Parameter 'modules' contains module of unsupported type; module:["+_mod+"].");
                } //-- end if
            } //-- end if
        }else if (func_){
            // execute function
            if (!js.isFunction(func_)){
                throw new Error("Parameter 'func' is not a function.");
            } //-- end if
            func_();
        } //-- end if
    };

    //----------------------------------------------------------
    var _loadCSS = /*void*/ function (/*String*/ href_, /*Function*/ onload_, /*Function*/ onerror_) {
        // VAR
        var _head = document.getElementsByTagName("head")[0];
        var _link;
        // CODE
        _link = document.createElement("link");
        _link.setAttribute("rel", "stylesheet");
        _link.setAttribute("type", "text/css");
        _link.setAttribute("href", href_);
        if (typeof onload_ === "function"){_link.onload=onload_;} //-- end if
        if (typeof onerror_ === "function"){_link.onerror=onerror_;} //-- end if
        _head.appendChild(_link);
        return;
    };

    //----------------------------------------------------------
    var _loadJS = /*void*/ function (/*String*/ href_, /*Function*/ onload_, /*Function*/ onerror_) {
        // VAR
        var _head = document.getElementsByTagName("head")[0];
        var _script;
        // CODE
        _script = document.createElement("script");
        _script.setAttribute("type","text/javascript");
        _script.setAttribute("src", href_);
        if (js.detectIE()<11){
            _script.onreadystatechange = function() {
                // CODE
                switch (_script.readyState){
                    case "complete": //-- success
                    case "loaded": //-- failure
                        if (js.isFunction(onload_)){onload_();}
                        break;
                    default:
                        break;
                } //-- end switch
            };
        }else{
            if (js.isFunction(onload_)){_script.onload=onload_;} //-- end if
            if (js.isFunction(onerror_)){_script.onerror=onerror_;} //-- end if
        } //-- end if
        _head.appendChild(_script);
        return;
    };

    //----------------------------------------------------------
    var _loadResource = /*void*/ function (/*String*/ href_, /*Function*/ onload_, /*Function*/ onerror_) {
        // VARS
        var _req = new XMLHttpRequest(), _resource, _idx;
        // CODE
        _idx = href_?href_.lastIndexOf("."):-1;
        _resource = (_idx<0?href_:href_.slice(0, _idx)).split("/").join(".");
        _req.open("GET", href_);
        _req.onreadystatechange = function (){
            // CODE
            if (_req.readyState===4){
                if (_req.status===200){
                    try {
                        js.setProperty("", _resource, JSON.parse(_req.responseText));
                        js.logDebug("Resource '"+href_+"' is in JSON format.");
                    }
                    catch (e){
                        js.setProperty("", _resource, _req.responseText);
                        js.logDebug("Resource '"+href_+"' is treated as a String.");
                    }
                    onload_();
                }else{
                    onerror_();
                } //-- end if
            } //-- end if
        };
        _req.send(null);
        return;
    };

    //----------------------------------------------------------
    // Parameters:
    //   - entities: list of entities
    //   - func:     function to execute
    // Returns: nothing
    // Check that all entities are defined, after all executes function with entities as parameters
    js.include = /*void*/ function (/*Array of String*/ entities_, /*Function*/ func_){
        // CODE
        if (entities_===null) {throw new Error("Parameter 'entities' is null.");}
        if (!js.isArray(entities_) || entities_.some(function(x){return !js.isString(x);})) {
            throw new Error("Parameter 'entities' is not an Array of Strings.");
        }
        if (func_===null) {throw new Error("Parameter 'function' is null.");}
        if (!js.isFunction(func_)) {throw new Error("Parameter 'function' is not a Function.");}
        func_.apply(this, entities_.map(function(x){
            // VARS
            var _entity = js.getProperty("", x);
            // CODE
            if (!_entity){throw new Error("Module '"+x+"' is absent.");}
            return _entity;
        }));
    };

    //----------------------------------------------------------
    //-- logging
    //----------------------------------------------------------

    var _debugLvl = 5;

    //----------------------------------------------------------
    js.isTraceLevel  = /*boolean*/ function (){return _debugLvl>=6;};
    js.isDebugLevel  = /*boolean*/ function (){return _debugLvl>=5;};
    js.isInfoLevel   = /*boolean*/ function (){return _debugLvl>=4;};
    js.isWrnLevel    = /*boolean*/ function (){return _debugLvl>=3;};
    js.isErrLevel    = /*boolean*/ function (){return _debugLvl>=2;};
    js.isSysErrLevel = /*boolean*/ function (){return _debugLvl>=1;};
    js.isLogOff      = /*boolean*/ function (){return _debugLvl===0;};

    //----------------------------------------------------------
    js.getDebugLevel = /*int*/ function (){return _debugLvl;};

    //----------------------------------------------------------
    js.setDebugLevel = /*boolean*/ function (/*int*/ level_){
        // VAR
        var _fn = _module+".setDebugLevel()";
        // CODE
        if (!js.isInt(level_) || level_<0 || level_>6){
            js.logErr(_fn, "Expected integer value from 0 to 6.");
            return false;
        } //-- end if
        _debugLvl = level_;
        js.log(_fn, ": Current client debug level value is set to:["+_debugLvl+"]");
        return true;
    };

    //----------------------------------------------------------
    js.log = /*void*/ function (){
        // CODE
        if (console && js.isFunction(console.log)){
            console.log.apply(console, (arguments && arguments.length>0)?arguments:"");
        } //-- end if
    };

    //----------------------------------------------------------
    js.logTrace = /*void*/ function (/*...*/){
        // CODE
        if (_debugLvl>=6){
            if (arguments.length===0){
                throw new Error("Arguments are absent.");
            } //-- end if
            Array.prototype.unshift.call(arguments, ":TRC:");
            js.log.apply(js, arguments);
        } //-- end if
        return;
    };
    //----------------------------------------------------------
    js.logDebug = /*void*/ function (/*...*/){
        // CODE
        if (_debugLvl>=5){
            if (arguments.length===0){
                throw new Error("Arguments are absent.");
            } //-- end if
            Array.prototype.unshift.call(arguments, ":DBG:");
            js.log.apply(js, arguments);
        } //-- end if
        return;
    };
    //----------------------------------------------------------
    js.logInfo = /*void*/ function (/*...*/){
        // CODE
        if (_debugLvl>=4){
            if (arguments.length===0){
                throw new Error("Arguments are absent.");
            } //-- end if
            Array.prototype.unshift.call(arguments, ":INF:");
            js.log.apply(js, arguments);
        } //-- end if
        return;
    };
    //----------------------------------------------------------
    js.logWrn = /*void*/ function (/*...*/){
        // CODE
        if (_debugLvl>=3){
            if (arguments.length===0){
                throw new Error("Arguments are absent.");
            } //-- end if
            Array.prototype.unshift.call(arguments, ":WRN:");
            js.log.apply(js, arguments);
        } //-- end if
        return;
    };
    //----------------------------------------------------------
    js.logErr = /*void*/ function (/*...*/){
        // CODE
        if (_debugLvl>=2){
            if (arguments.length===0){
                throw new Error("Arguments are absent.");
            } //-- end if
            Array.prototype.unshift.call(arguments, ":ERR:");
            js.log.apply(js, arguments);
        } //-- end if
        return;
    };
    //----------------------------------------------------------
    js.logSysErr = /*void*/ function (/*...*/){
        // CODE
        if (_debugLvl>=1){
            if (arguments.length===0){
                throw new Error("Arguments are absent.");
            } //-- end if
            Array.prototype.unshift.call(arguments, ":SYSERR:");
            js.log.apply(js, arguments);
        } //-- end if
        return;
    };
    //----------------------------------------------------------
    js.logInternal = /*void*/ function (/*...*/){
        // CODE
        if (arguments.length===0){
            throw new Error("Arguments are absent.");
        } //-- end if
        Array.prototype.unshift.call(arguments, ":INTERNAL:");
        js.log.apply(js, arguments);
        return;
    };

    //----------------------------------------------------------
    js.printStackTrace = /*void*/ function () {
        // VAR
        var _callstack=[], _done=false, _curFunc, _fn, _fname, _skip;
        // CODE
        try {
            _callstack.dont.exist+=0; //-- doesn't exist- that's the point
        } 
        catch (e_) {
            if (e_.stack) { //-- Firefox
        //js.log(">>> e_.stack", e_.stack);
                e_.stack.split('\n').forEach(
                    function (x, i) {if (x.match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {_callstack.push("* --   "+x);}}
                );
                _callstack.shift(); //-- Remove call to printStackTrace()
                _done = true;
            }else if (window.opera && e_.message) { //-- Opera
                _skip = false;
                e_.message.split('\n').forEach(
                    function (x, i, arr){
                        if (_skip){
                            _skip = false;
                        }else if (x.match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
                            if (arr[i+1]){
                                _callstack.push("* --   "+x+" at "+arr[i+1]);
                                _skip = true;
                            }else{
                                _callstack.push("* --   "+x);
                            } //-- end if
                        } //-- end if
                    }
                );
                _callstack.shift(); //-- Remove call to printStackTrace()
                _done = true;
            } //-- end if
        }
        if (!_done) { //IE and Safari
            _curFunc = arguments.callee.caller;
            while (_curFunc) {
                _fn = _curFunc.toString();
                _fname = _fn.substring(_fn.indexOf("function") + 8, _fn.indexOf('')) || 'anonymous';
                _callstack.push("* --   "+_fname);
                _curFunc = _curFunc.caller;
            }
        }
        js.log("* ------------------------------------------------------- *\n" +
               _callstack.join("\n") +
               "* ------------------------------------------------------- *\n");
        return;
    };

    //----------------------------------------------------------
    //-- strong mode switcher
    //----------------------------------------------------------

    var __strongMode = false;
    //----------------------------------------------------------
    js.setStrongMode = /*void*/ function (/*boolean*/ flag_){__strongMode=flag_;};

    //----------------------------------------------------------
    js.checkStrongMode = /*void*/ function (/*String or Object*/ val_){
        // CODE
        if (__strongMode){
            if (!val_){
                throw new Error("<null>");
            } //-- end if
            if (typeof val_=='string' || val_ instanceof String){
                throw new Error(val_);
            } //-- end if
            throw val_;
        } //-- end if
        return;
    };

    //----------------------------------------------------------
    //-- html element class attribute processing
    //----------------------------------------------------------

    //----------------------------------------------------------
    js.hasClass = /*boolean*/ function (/*Oblect*/ obj_, /*String*/ class_){
        // CODE
        return obj_ && obj_.className && obj_.className.split(" ")
                                                       .some(function(x){return x===class_;});
    };

    //----------------------------------------------------------
    js.addClass = /*void*/ function (/*Object*/ obj_, /*String*/ class_){
        // CODE
        if (!js.isElement(obj_)){
            throw new Error("Argument 'object' is not HTMLElement.");
        }
        if (!obj_ || !class_ || js.hasClass(obj_, class_)){return;}
        if (obj_.className && obj_.className.length>0){
            obj_.className += " " + class_;
        }else{
            obj_.className = class_;
        }
    };
    //----------------------------------------------------------
    js.addClasses = /*void*/ function (/*Object*/ obj_, /*String*/ classes_){
        // CODE
        if (js.isString(classes_)){
            classes_.split(" ").filter(function (x){return x;})
                    .forEach(function (x){js.addClass(obj_, x);});
        } //-- end if
    };

    //----------------------------------------------------------
    js.removeClass = /*void*/ function (/*Oblect*/ obj_, /*String*/ class_){
        // CODE
        if (obj_ && obj_.className){
            obj_.className = ""+obj_.className.split(" ").filter(function (x){return x!==class_;}).join(" ");
        } //-- end if
    };

    //----------------------------------------------------------
    js.toggleClass = /*void*/ function (/*Oblect*/ obj_, /*Class*/ class_){
        // CODE
        if (js.hasClass(obj_, class_)){
            js.removeClass(obj_, class_);
        }else{
            js.addClass(obj_, class_);
        }
    };

    //----------------------------------------------------------
    js.hasMarker = /*boolean*/ function (/*Oblect*/ obj_, /*String*/ marker_){
        // CODE
        return obj_ && obj_.__markers && obj_.__markers.some &&
               obj_.__markers.some(function(x){return x===marker_;});
    };
    //----------------------------------------------------------
    js.addMarker = /*void*/ function (/*Object*/ obj_, /*String*/ marker_){
        // CODE
        if (!obj_ || !marker_ || js.hasMarker(obj_, marker_)){return;}
        if (obj_.__markers){
            obj_.__markers.push(marker_);
        }else{
            obj_.__markers = [marker_];
        }
    };
    //----------------------------------------------------------
    js.addMarkers = /*void*/ function (/*Object*/ obj_, /*String*/ markers_){
        // CODE
        markers_.split(" ").filter(function (x){return x;})
                .forEach(function (x){js.addMarker(obj_, x);});
    };
    //----------------------------------------------------------
    js.setMarkers = /*void*/ function (/*Object*/ obj_, /*String*/ markers_){
        // CODE
        obj_.__markers = [];
        js.addMarkers(obj_, markers_);
    };
    //----------------------------------------------------------
    js.removeMarker = /*void*/ function (/*Oblect*/ obj_, /*String*/ marker_){
        // CODE
        if (obj_ && obj_.__markers){
            obj_.__markers = obj_.__markers.filter(function (x){return x!==marker_;});
        } //-- end if
    };
    //----------------------------------------------------------
    js.toggleMarker = /*void*/ function (/*Oblect*/ obj_, /*Class*/ marker_){
        // CODE
        if (js.hasMarker(obj_, marker_)){
            js.removeMarker(obj_, marker_);
        }else{
            js.addMarker(obj_, marker_);
        }
    };

    //----------------------------------------------------------
    //-- module/object programming
    //----------------------------------------------------------

    //----------------------------------------------------------
    var _uid = 0;
    js.getUid = /*int*/ function (){return _uid++;};

    //----------------------------------------------------------
    js.inherit = /*?*/ function (/*Prototype*/ oP_){
        // VAR
        var oT;
        var oF;
        // CODE
        if (oP_===null) {throw TypeError();}
        if (Object.create){
            return Object.create(oP_);
        }
        oT = typeof oP_;
        if (oT!=="object" && oT!=="function"){
            throw TypeError();
        }
        oF = function (){};
        oF.prototype = oP_;
        return new oF();
    };

    //----------------------------------------------------------
    //-- crosscoding
    //----------------------------------------------------------

    //----------------------------------------------------------
    js.escapeHTML = /*String*/ function (/*String*/ val_){
        // CODE
        if (!val_){return null;} //-- end if
        return val_.length>0?val_.split("").map(function (item){return escapedChar(item.charAt(0));}).join("")
                            :"";
    };

    //----------------------------------------------------------
    function /*character*/ escapedChar (/*character*/ ch_){
        var _rv = null;
        var _code = ch_.charCodeAt(0);
        // CODE
        switch (_code){
            //-- tags
            case 34:  _rv = "&quot;"; break; //"
            case 60:  _rv = "&lt;"; break; //<
            case 62:  _rv = "&gt;"; break; //>
            //-- br
            case 10:  _rv = "<br/>"; break; //newline
            case 13:  _rv = ""; break;
            //-- nbsp
            case 32:  _rv = "&nbsp;"; break; //space
            //-- others
            case 38:  _rv = "&amp;"; break;
            case 162: _rv = "&cent;"; break; 
            case 192: _rv = "&Agrave;"; break; 
            case 193: _rv = "&Aacute;"; break;
            case 194: _rv = "&Acirc;"; break; 
            case 195: _rv = "&Atilde;"; break; 
            case 196: _rv = "&Auml;"; break; 
            case 197: _rv = "&Aring;"; break; 
            case 198: _rv = "&AElig;"; break;
            case 199: _rv = "&Ccedil;"; break; 
            case 200: _rv = "&Egrave;"; break; 
            case 201: _rv = "&Eacute;"; break; 
            case 202: _rv = "&Ecirc;"; break; 
            case 203: _rv = "&Euml;"; break;
            case 204: _rv = "&Igrave;"; break; 
            case 205: _rv = "&Iacute;"; break;
            case 206: _rv = "&Icirc;"; break; 
            case 207: _rv = "&Iuml;"; break;
            case 208: _rv = "&ETH;"; break;
            case 209: _rv = "&Ntilde;"; break; 
            case 210: _rv = "&Ograve;"; break; 
            case 211: _rv = "&Oacute;"; break;
            case 212: _rv = "&Ocirc;"; break; 
            case 213: _rv = "&Otilde;"; break; 
            case 214: _rv = "&Ouml;"; break;
            case 216: _rv = "&Oslash;"; break; 
            case 217: _rv = "&Ugrave;"; break; 
            case 218: _rv = "&Uacute;"; break; 
            case 219: _rv = "&Ucirc;"; break; 
            case 220: _rv = "&Uuml;"; break; 
            case 221: _rv = "&Yacute;"; break;
            case 222: _rv = "&THORN;"; break; 
            case 223: _rv = "&szlig;"; break; 
            case 224: _rv = "&agrave;"; break; 
            case 225: _rv = "&aacute;"; break; 
            case 226: _rv = "&acirc;"; break; 
            case 227: _rv = "&atilde;"; break; 
            case 228: _rv = "&auml;"; break; 
            case 229: _rv = "&aring;"; break; 
            case 230: _rv = "&aelig;"; break; 
            case 231: _rv = "&ccedil;"; break; 
            case 232: _rv = "&egrave;"; break; 
            case 233: _rv = "&eacute;"; break;
            case 234: _rv = "&ecirc;"; break; 
            case 235: _rv = "&euml;"; break; 
            case 236: _rv = "&igrave;"; break; 
            case 237: _rv = "&iacute;"; break; 
            case 238: _rv = "&icirc;"; break; 
            case 239: _rv = "&iuml;"; break; 
            case 240: _rv = "&eth;"; break; 
            case 241: _rv = "&ntilde;"; break; 
            case 242: _rv = "&ograve;"; break; 
            case 243: _rv = "&oacute;"; break;
            case 244: _rv = "&ocirc;"; break; 
            case 245: _rv = "&otilde;"; break;
            case 246: _rv = "&ouml;"; break; 
            case 248: _rv = "&oslash;"; break; 
            case 249: _rv = "&ugrave;"; break; 
            case 250: _rv = "&uacute;"; break; 
            case 251: _rv = "&ucirc;"; break; 
            case 252: _rv = "&uuml;"; break; 
            case 253: _rv = "&yacute;"; break; 
            case 254: _rv = "&thorn;"; break; 
            case 255: _rv = "&yuml;"; break;
            default:
                _rv = "";
                if (_code>127){
                    _rv = "&#x" + js.ihs(_code, 4) + ";";
                }else{
                    _rv += ch_;
                } //-- end if
                break;
        } //-- end switch
        //--
        return _rv;
    }

    //----------------------------------------------------------
    //-- misc
    //----------------------------------------------------------

    //----------------------------------------------------------
    js.removeChildren = /*void*/ function (/*Object*/ obj_){
        // CODE
        if (!obj_){
            throw new Error("Argument is null or absent.");
        } //-- end if
        while (obj_.firstChild){
            obj_.removeChild(obj_.firstChild);
        } //-- end while
    };

    //----------------------------------------------------------
    var achHex = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');
    js.ihs = /*String*/ function (/*int*/ val_, /*int?*/ tot_pos_){
        // VAR
        var _rv = "";
        var _skipLeadingZeroes = (tot_pos_?false:true);
        var _totpos = (tot_pos_<100)?tot_pos_:100;
        var _number;
        // CODE
        if (!js.isInt(val_)){return null;} //-- end if
        if (_totpos===0){return null;} //-- end if
        if (val_<0){
            _number = -val_;
            _totpos--;
        }else{
            _number = val_;
        } //-- end if
        while (_totpos>0){
            _rv = achHex[_number%16] + _rv;
            _number = _number>>1;
            if (_skipLeadingZeroes && _number===0){break;} //-- end if
            _totpos--;
        } //-- end while
        if (_number>0){return _rv.split("").map(function (x){return "*";}).join("");} //-- end if
        return (val_<0)?"-":""+_rv;
    };

    //----------------------------------------------------------
    js.hsi = /*String*/ function (/*String*/ val_){
        // VAR
        var iRV = 0;
        var iV;
        // CODE
        if (!val_){return 0;}
        switch (val_.charAt(val_.length-1)){
            case '0': iV = 0; break;
            case '1': iV = 1; break;
            case '2': iV = 2; break;
            case '3': iV = 3; break;
            case '4': iV = 4; break;
            case '5': iV = 5; break;
            case '6': iV = 6; break;
            case '7': iV = 7; break;
            case '8': iV = 8; break;
            case '9': iV = 9; break;
            case 'A': case 'a': iV = 10; break;
            case 'B': case 'b': iV = 11; break;
            case 'C': case 'c': iV = 12; break;
            case 'D': case 'd': iV = 13; break;
            case 'E': case 'e': iV = 14; break;
            case 'F': case 'f': iV = 15; break;
            default:
                throw new Error("Wrong hexdecimal character:["+val_.charAt(val_.length-1)+"]; position:["+(val_.length-1)+"].");
        } //-- end switch
        return js.hsi(val_.slice(0, val_.length-1))*16+iV;
    };

    //----------------------------------------------------------
    js.toHexa = /*String*/ function (/*String*/ val_){
        // CODE
        return val_.split("").map(function (item){return js.ihs(item.charCodeAt(0), 2);}).join("");
    };
    //----------------------------------------------------------
    js.toUTF16hexa = /*String*/ function (/*String*/ val_){
        // CODE
        return "feff"+val_.split("").map(function (item){return js.ihs(item.charCodeAt(0), 4);}).join("");
    };
    //----------------------------------------------------------
    js.fromUTF16hexa = /*String*/ function  (/*String or byte array*/ obj_){
        // VAR
        var _rv = "";
        var blBE, i, w1, w2, w3, w4, jsV, abV;
        var ach = [];
        // CODE
        if (!obj_){
            throw new Error("Argument is null or absent.");
        } //-- end if
        if (typeof arguments[0]=='string' || arguments[0] instanceof String){
            if (obj_.length<8 || obj_.length%4>0){
                throw new Error("Wrong argument string length:["+obj_.length+"].");
            } //-- end if
            jsV = obj_.slice(0, 4);
            if (jsV.toUpperCase()=="FEFF"){
                blBE = true;
            }else if (jsV.toUpperCase()=="FFFE"){
                blBE = false;
            }else{
                throw new Error("Unknown type of argument string coding ["+jsV+"].");
            } //-- end if
            jsV = obj_.slice(4, obj_.length);
            i = 0;
            while (jsV.length>0){
                w1 = js.hsi(jsV.slice(0, 2));
                w2 = js.hsi(jsV.slice(2, 4));
                w3 = blBE?((w1<<8)+w2):((w2<<8)+w1);
                if ((w3 & 0xF800)!==0xD800){ // w3 < 0xD800 || w3 > 0xDFFF
                    ach.push(w3);
                    jsV = jsV.slice(4, jsV.length);
                    i += 4;
                    continue;
                }
                if ((w3 & 0xFC00)===0xD800){ // w3 >= 0xD800 && w3 <= 0xDBFF
                    throw new Error("Invalid octets 0x" + jsV.slice(0, 4) + " at offset " + (i/4+1) + ".");
                }
                if (jsV.length<=4){
                    throw new Error("Expected additional octet(s).");
                }
                w4 = w3;
                w1 = js.hsi(jsV.slice(4, 6));
                w2 = js.hsi(jsV.slice(6, 8));
                w3 = blBE?((w1<<8)+w2):((w2<<8)+w1);
                if ((w3 & 0xFC00)!==0xDC00){ // w3 < 0xDC00 || w3 > 0xDFFF)
                    throw new Error("Invalid octets 0x" + jsV.slice(0, 4) + " at offset " + (i/4+2) + ".");
                }
                ach.push(((w4 & 0x3ff) << 10) + (w3 & 0x3ff) + 0x10000);
                jsV = jsV.slice(8, jsV.length);
                i += 8;
            } //-- end while
        }else if (obj_.subarray){ //-- duck typing of byte array
            if (obj_.byteLength<4 || obj_.byteLength%2>0){
                throw new Error("Wrong argument array length:["+obj_.length+"].");
            } //-- end if
            if (obj_[0]==254 && obj_[1]==255){ //-- "FEFF" - big endian
                blBE = true;
            }else if (obj_[0]==255 && obj_[1]==254){ //-- "FFFE" - little endian
                blBE = false;
            }else{
                throw new Error("Unknown type of argument array coding ["+obj_+"].");
            } //-- end if
            i = 2;
            while (i<obj_.byteLength){
                w1 = obj_[i];
                w2 = obj_[i+1];
                w3 = blBE?((w1<<8)+w2):((w2<<8)+w1);
                if ((w3 & 0xF800)!==0xD800){ // w3 < 0xD800 || w3 > 0xDFFF
                    ach.push(w3);
                    i += 2;
                    continue;
                }
                if ((w3 & 0xFC00)===0xD800){ // w3 >= 0xD800 && w3 <= 0xDBFF
                    throw new Error("Invalid octets 0x" + js.ihs(w3, 4) + " at offset " + i + ".");
                }
                if (i+2>obj_.byteLength){
                    throw new Error("Expected additional octet(s).");
                }
                w4 = w3;
                w1 = obj_[i+2];
                w2 = obj_[i+3];
                w3 = blBE?((w1<<8)+w2):((w2<<8)+w1);
                if ((w3 & 0xFC00)!==0xDC00){ // w3 < 0xDC00 || w3 > 0xDFFF)
                    throw new Error("Invalid octets 0x" + js.ihs(w3, 4) + " at offset " + (i+2) + ".");
                }
                ach.push(((w4 & 0x3ff) << 10) + (w3 & 0x3ff) + 0x10000);
                i += 4;
            } //-- end while
        }else{
            throw new Error(_fn, "Wrong argument: neither String nor byte array.");
        } //-- end if
        _rv = String.fromCharCode.apply(String, ach);
        //--
        return _rv;
    };

    //----------------------------------------------------------
    js.getInt = /*int*/ function (/*byte array*/ abValues_, /*int*/ iO_){
        var b1, b2, b3, b4;
        // CODE
        b1 = abValues_[iO_  ]<<24;
        b2 = abValues_[iO_+1]<<16;
        b3 = abValues_[iO_+2]<<8;
        b4 = abValues_[iO_+3];
        return b1+b2+b3+b4;
    };

    //----------------------------------------------------------
    js.getShort = /*int*/ function (/*byte array*/ abValues_, /*int*/ iO_){
        var b1, b2;
        // CODE
        b1 = abValues_[iO_  ]<<8;
        b2 = abValues_[iO_+1];
        return b1+b2;
    };

    //----------------------------------------------------------
    js.getLong_hexastr = /*String*/ function (/*byte array*/ abValues_, /*int*/ iO_){
        var b1, b2, b3, b4, b5, b6, b7, b8;
        // CODE
        b1 = js.ihs(abValues_[iO_  ], 2);
        b2 = js.ihs(abValues_[iO_+1], 2);
        b3 = js.ihs(abValues_[iO_+2], 2);
        b4 = js.ihs(abValues_[iO_+3], 2);
        b5 = js.ihs(abValues_[iO_+4], 2);
        b6 = js.ihs(abValues_[iO_+5], 2);
        b7 = js.ihs(abValues_[iO_+6], 2);
        b8 = js.ihs(abValues_[iO_+7], 2);
        return b1+b2+b3+b4+b5+b6+b7+b8;
    };

    //----------------------------------------------------------
    // Returns a random number:
    //   - if one argument: between 0 (inclusive) and iI1_ (exclusive)
    //   - if two arguments: between iI1_ (inclusive) and iI2_ (exclusive) 
    js.getRandomArbitrary = /*double*/ function (/*double*/ iI1_, /*double?*/ iI2_){
        // VAR
        var iMin, iMax;
        // CODE
        if (iI2_){
            iMin = iI1_;
            iMax = iI2_;
        }else{
            iMin = 0;
            iMax = iI1_;
        } //-- end if
        return Math.random() * (iMax - iMin) + iMin;
    };

    //----------------------------------------------------------
    // Returns a random integer:
    //   - if one argument: between 0 (inclusive) and Math.floor(iI1_) (exclusive)
    //   - if two arguments: between Math.floor(iI1_) (inclusive) and Math.floor(iI2_) (exclusive) 
    // Using Math.round() will give you a non-uniform distribution!
    js.getRandomInt = /*int*/ function (/*int*/ iI1_, /*int?*/ iI2_){
        // VAR
        var iMin, iMax;
        // CODE
        if (iI2_){
            iMin = Math.floor(iI1_);
            iMax = Math.floor(iI2_);
        }else{
            iMin = 0;
            iMax = Math.floor(iI1_);
        } //-- end if
        // CODE
        return Math.floor(Math.random() * (iMax - iMin)) + iMin;
    };
  
    //----------------------------------------------------------
    // Returns text width.
    // Arguments:
    //   1st - HTML-element : it is source of font properties and text
    //   1st - String: it is text, then
    //      2nd - HTML-element : it is source of font properties
    //      2nd - String: it is font description
    js.getTextWidth = /*int*/ function (/*{...}*/){
        // VAR
        var jsText, jsFont, oCanvas, oContext, oMetrics, oStyle;
        // CODE
        if (!arguments[0]){
            throw new Error("Argument is null or absent.");
        } //-- end if
        if (arguments[0].nodeType && arguments[0].nodeType==1){
            jsText = arguments[0].innerHTML+"";
            oStyle = window.getComputedStyle(arguments[0]);
            jsFont = oStyle.fontStyle+" "+oStyle.fontSize+" "+oStyle.fontFamily;
        }else if (typeof arguments[0]=='string' || arguments[0] instanceof String){
            jsText = arguments[0];
            if (!arguments[1]){
                throw new Error("Second argument is null or absent.");
            } //-- end if
            if (arguments[1].nodeType && arguments[1].nodeType==1){
                oStyle = window.getComputedStyle(arguments[1]);
                jsFont = oStyle.fontStyle+" "+oStyle.fontSize+" "+oStyle.fontFamily;
            }else if (typeof arguments[1]=='string' || arguments[1] instanceof String){
                jsFont = arguments[1];
            }else{
                throw new Error("Second argument must be HTML-element or of String type.");
            } //-- end if
        }else{
            throw new Error("First argument must be HTML-element or of String type.");
        } //-- end if
        if (!oCanvas){oCanvas = document.createElement("canvas");} //-- end if
        oContext = oCanvas.getContext("2d");
        oContext.font = jsFont;
        oMetrics = oContext.measureText(jsText);
        return Math.floor(oMetrics.width)+1;
    };

    //----------------------------------------------------------
    js.getDoubleClickDetector = /*Function*/ function (/*Function*/ fnOnSingleClick_, /*Function*/ fnOnDoubleClick_){
        // CODE
        js.logWrn("Deprecated since ver:#01-01b02! Use 'js.doubleClickDetector()' instead.");
        return /*void*/ function (/*Event*/ oEvent_){ 
            // CODE
            if (oEvent_.target.getAttribute("__clicked")){
                oEvent_.target.removeAttribute("__clicked");
                fnOnDoubleClick_(oEvent_);
            }else{
                oEvent_.target.setAttribute("__clicked" ,true);
                setTimeout(function (){
                    // CODE
                    if (oEvent_.target.getAttribute("__clicked")){
                        oEvent_.target.removeAttribute("__clicked");
                        fnOnSingleClick_(oEvent_);
                    }else{
                        oEvent_.target.removeAttribute("__clicked");
                    } //-- end if
                }, 200);
            } //-- end if
            return;
        };
    };

    //----------------------------------------------------------
    js.doubleClickDetector = /*Function*/ function (/*Function*/ fnOnSingleClick_, 
                                                    /*Function*/ fnOnDoubleClick_,
                                                    /*?*/ arg_){
        // CODE
        return /*void*/ function (/*Event*/ oEvent_){ 
            // CODE
            if (oEvent_.which==oEvent_.target.getAttribute("__clicked")){
                oEvent_.target.removeAttribute("__clicked");
                if (fnOnDoubleClick_){
                    fnOnDoubleClick_(oEvent_, arg_);
                } //-- end if
            }else if (oEvent_.target.getAttribute("__clicked")){
                oEvent_.target.removeAttribute("__clicked");
                if (fnOnSingleClick_){
                    fnOnSingleClick_(oEvent_, arg_);
                } //-- end if
            }else{
                oEvent_.target.setAttribute("__clicked", oEvent_.which);
                setTimeout(function (){
                    // CODE
                    if (oEvent_.target.getAttribute("__clicked")){
                        oEvent_.target.removeAttribute("__clicked");
                        if (fnOnSingleClick_){
                            fnOnSingleClick_(oEvent_, arg_);
                        } //-- end if
                    }else{
                        oEvent_.target.removeAttribute("__clicked");
                    } //-- end if
                }, 200);
            } //-- end if
            return;
        };
    };

    //----------------------------------------------------------
    js.__dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
                     "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    js.__monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                       "January", "February", "March", "April", "May", "June", 
                       "July", "August", "September", "October", "November", "December"]; 
    js.__pad = function (val, len){
        // CODE
        val = String(val);
        len = len || 2;
        while (val.length < len) {val = "0" + val;}
        return val;
    };
    js.formatDate = /*String*/ function (/*Object*/ nls_index, /*number or String or Date?*/date, /*String?*/ mask, /*boolean*/ utc){
        // VAR
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
        var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
        var timezoneClip = /[^-+\dA-Z]/g;
        // Some common format strings
        var masks = {
            "default":      "ddd mmm dd yyyy HH:MM:ss",
            shortDate:      "m/d/yy",
            mediumDate:     "mmm d, yyyy",
            longDate:       "mmmm d, yyyy",
            fullDate:       "dddd, mmmm d, yyyy",
            shortTime:      "h:MM TT",
            mediumTime:     "h:MM:ss TT",
            longTime:       "h:MM:ss TT Z",
            isoDate:        "yyyy-mm-dd",
            isoTime:        "HH:MM:ss",
            isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
            isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        };
        // CODE
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)){
            mask = date;
            date = undefined;
        }
        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date();
        if (isNaN(date)) {throw SyntaxError("invalid date");}
        mask = String(masks[mask] || mask || masks["default"]);
        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:"){
            mask = mask.slice(4);
            utc = true;
        }
        var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:    d,
                    dd:   js.__pad(d),
                    ddd:  nls_index && nls_index.dayNames && nls_index.dayNames[D] || js.__dayNames[D],
                    dddd: nls_index && nls_index.dayNames && nls_index.dayNames[D+7] || js.__dayNames[D+7],
                    m:    m + 1,
                    mm:   js.__pad(m + 1),
                    mmm:  nls_index && nls_index.monthNames && nls_index.monthNames[m] || js.__monthNames[m],
                    mmmm: nls_index && nls_index.monthNames && nls_index.monthNames[m+12] || js.__monthNames[m+12],
                    yy:   String(y).slice(2),
                    yyyy: y,
                    h:    H % 12 || 12,
                    hh:   js.__pad(H % 12 || 12),
                    H:    H,
                    HH:   js.__pad(H),
                    M:    M,
                    MM:   js.__pad(M),
                    s:    s,
                    ss:   js.__pad(s),
                    l:    js.__pad(L, 3),
                    L:    Math.round(L / 10),
                    t:    H < 12 ? "a"  : "p",
                    tt:   H < 12 ? "am" : "pm",
                    T:    H < 12 ? "A"  : "P",
                    TT:   H < 12 ? "AM" : "PM",
                    Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o:    (o > 0 ? "-" : "+") + js.__pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

        return mask.replace(token, function (x){return x in flags ? flags[x] : x.slice(1, x.length - 1);});
    };

    //----------------------------------------------------------
    js.getTimestamp = /*Number*/ function (){
        // CODE
        if (performance && js.isFunction(performance.now)){
            return performance.now();
        } //-- end if
        return +new Date();
    };

    //----------------------------------------------------------
    js.formatSize = /*String*/ function (/*number*/iSize_){
        var _rv = "";
        // CODE
        if (/^\+?(0|[1-9]\d*)$/.test(iSize_)){
            if (iSize_<1024){
                _rv = iSize_+" B";
            }else if (iSize_<1024*1024){
                _rv = js.toFixed(iSize_/1024, 1)+" KB";
            }else if (iSize_<1024*1024*1024){
                _rv = js.toFixed(iSize_/1024/1024, 1)+" MB";
            }else{
                _rv = js.toFixed(iSize_/1024/1024/1024, 1)+" TB";
            } //-- end if
        }
        return _rv;
    };
    //----------------------------------------------------------
    js.toFixed = /*String*/ function (value_, precision_){
        var _precision = precision_ || 0;
        var _neg = value_ < 0;
        var _power = Math.pow(10, _precision);
        var _value = Math.round(value_ * _power);
        var _integral = String((_neg ? Math.ceil : Math.floor)(_value / _power));
        var _fraction = String((_neg ? -_value : _value) % _power);
        var _padding = new Array(Math.max(_precision - _fraction.length, 0) + 1).join('0');
        return _precision ? _integral + '.' + _padding + _fraction : _integral;
    };

    //----------------------------------------------------------
    js.redraw = /*void*/ function (/*HTMLElement*/ elem_) {
        // VAR
        var _disp, _stub;
        // CODE
        _disp = elem_.style.display;
        elem_.style.display = 'none';
        _stub = elem_.offsetHeight;
        elem_.style.display = _disp;
        return;
    };

    //----------------------------------------------------------
    js.isNode = /*boolean*/ function (/*?*/ elem_) {
        // CODE
        return typeof Node==="object"?(elem_ instanceof Node)
                                     :(elem_ && 
                                       typeof elem_==="object" && 
                                       typeof elem_.nodeType==="number" && 
                                       typeof elem_.nodeName==="string");
    };

    //----------------------------------------------------------
    js.isElement = /*boolean*/ function (/*?*/ elem_){
        // CODE
        return typeof HTMLElement === "object"? (elem_ instanceof HTMLElement)
                                              : (elem_ && 
                                                 typeof elem_==="object" && 
                                                 elem_!==null && 
                                                 elem_.nodeType===1 && 
                                                 typeof elem_.nodeName==="string");
    };

    //----------------------------------------------------------
    js.isObject = /*boolean*/ function (val_) {
        // CODE
        return val_!==null && ((typeof val_ === 'function') || (typeof val_ === 'object'));
    };
    //----------------------------------------------------------
    js.isFunction = /*boolean*/ function (/*?*/ val_) {return (typeof val_==='function');};

    //----------------------------------------------------------
    js.isArray = /*boolean*/ function (/*?*/ val_) {return !!val_ && val_.constructor === Array;};

    //----------------------------------------------------------
    js.isString = /*boolean*/ function (/*?*/ val_) {return typeof val_==='string' || val_ instanceof String;};

    //----------------------------------------------------------
    js.isNumber = /*boolean*/ function (/*?*/ val_) {return !isNaN(val_) && isFinite(val_);};

    //----------------------------------------------------------
    js.isInt = /*boolean*/ function (/*?*/ val_) {return  (typeof val_=='number') && (val_%1===0);};

    //----------------------------------------------------------
    js.uniq = /*Array of ?*/ function (/*Array of ?*/arr_) {
        // VARS
        var _prims = {"boolean":{}, "number":{}, "string":{}}, _objs = [];
        // CODE
        return arr_.filter(function(x) {
            var _type = typeof x;
            if (_type in _prims) {
                return _prims[_type].hasOwnProperty(x)?false:(_prims[_type][x]=true);
            }else{
                return _objs.indexOf(x)>=0?false:_objs.push(x);
            }
        });
    };

    //----------------------------------------------------------
    js.stringify = /*String*/ function (/*?*/ val_) {
        // CODE
        switch (typeof val_){
          case 'boolean':   return val_?"true":"false";
          case 'number':    return "num:"+val_;
          case 'string':    return "str:"+val_;
          case 'object':    return (js.isArray(val_)?"arr:":"obj:")+JSON.stringify(val_);
          case 'function':  return val_.toString();
          default: break; //-- 'undefined'
        } //-- end switch 
        return "undefined";
    };

    //----------------------------------------------------------
    js.invoke = /*void*/ function (/*Function*/ func_, /*int?*/ start_, /*int?*/ delay_, /*int?*/ end_) {
        // CODE
        if (!func_ || !js.isFunction(func_)){
            throw new Error("First parameter ('callback') must be function.");
        } //-- end if
        if (!start_){
            start_ = 0;
        }else if (!js.isInt(start_)){
            throw new Error("Second parameter ('start') must be integer (if present).");
        } //-- end if
        if (delay_ && !js.isInt(delay_)){
            throw new Error("Third parameter ('delay') must be integer (if present).");
        } //-- end if
        if (end_ && !js.isInt(end_)){
            throw new Error("Forth parameter ('end') must be integer (if present).");
        } //-- end if
        if (delay_){
            setTimeout(function(){
                            // VARS
                            var _int = setInterval(func_, delay_);
                            // CODE
                            if (end_){setTimeout(function(){clearInterval(_int);}, end_);} //-- end if
                       }, 
                       start_); //-- single call
        }else{
            setTimeout(func_, start_); //-- single call
        } //-- end if
    };

    //----------------------------------------------------------
    js.notImpl = /*void*/ function () {
        // CODE
        if (console && js.isFunction(console.trace)){
            console.trace();
        } //-- end if
        //    js.log(js.printStackTrace());
        throw new Error("Not implemented!!!");
    };

    //----------------------------------------------------------
    js.setProperty("", "js", js);
})();