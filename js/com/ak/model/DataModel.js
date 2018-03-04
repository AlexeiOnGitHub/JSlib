/*
 * Title:       Javascript library. Model. Data model.
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
 *    01-01a03  15.02.2018  AK    1. adjust(): add 'skipDel' parameter for incremental adjustment.
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01a02  16.11.2017  AK    1. new js.define is used to define module
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01a01  26.09.2017  AK    1. initial creation
 *    --------  ----------  ----  ---------------------------------------------
 */

js.include(["com.ak.util.HashMap"], function(HashMap){
    // CODE
    js.define({module:"com.ak.model.DataModel", version:"0101a03"}, 
              [], 
              function (/*Array of strings*/ allFields_, /*Array of strings*/ keyFields_){

    //----------------------------------------------------------
    //-- precheck & fields
    //----------------------------------------------------------

    var _all_fields, _key_fields;
    //-- _all_fields
    if (!js.isArray(allFields_) || allFields_.length<1 || !allFields_.every(function(x){return js.isString(x) && x.length>0;})){
        throw new Error("First parameter 'all fields' has wrong type or format. It must be non-empty array of non-empty strings.");
    } //-- end if
    _all_fields = js.uniq(allFields_.slice());
    if (_all_fields.length!=allFields_.length){
        throw new Error("First parameter 'all fields' contains duplicated values.");
    } //-- end if
    //-- _key_fields
    if (keyFields_){
        if (!js.isArray(keyFields_) || keyFields_.length<1){
            throw new Error("Second parameter 'key fields' has wrong type or format. If it is present it must be non-empty array.");
        } //-- end if
        if (!keyFields_.every(function(x){return _all_fields.indexOf(x)>=0;})){
            throw new Error("Second parameter 'key fields' must contain values only from parameter 'all fields'.");
        } //-- end if
        _key_fields = js.uniq(keyFields_.slice());
        if (_key_fields.length!=keyFields_.length){
            throw new Error("Second parameter 'key fields' contains duplicated values.");
        } //-- end if
    }else{
        _key_fields = allFields_.slice();
    } //-- end if

    //--
    var _uid = 0;    
    var _items = new HashMap();
    //--
    var _listeners = {}; 

    //----------------------------------------------------------
    //-- aux function
    //----------------------------------------------------------

    var _getUid = /*int*/ function (/*void*/){return _uid++;};
    //--
    var _checkFields = /*boolean*/ function (/*Object*/ item_) {
        // CODE
        return item_ && js.isObject(item_) && _all_fields.every(function (x){
            // CODE
            return (typeof item_[x])!=='undefined'?true:(js.logErr("Absent field:", x) && false);});
    };
    //--
    var _filterAllFields = /*Array*/ function (/*Object*/ item_) {
        // CODE
        return _all_fields.reduce(function(x, y){x.push(item_[y]); return x;}, []);
    };
    //--
    var _filterKeyFields = /*Array*/ function (/*Object*/ item_) {
        // CODE
        return _key_fields.reduce(function(x, y){x.push(item_[y]); return x;}, []);
    };

    //----------------------------------------------------------
    //-- listeners
    //----------------------------------------------------------

    this.addListener = /*boolean*/ function (/*String*/ event_, /*Object*/ context_, /*Function*/ func_) {
    // CODE
        if (!event_){return false;}
        if (!_listeners[event_]){_listeners[event_]=new HashMap();}
        if (_listeners[event_].hasKey(func_)){return false;}
        _listeners[event_].put(func_, function(x){func_.call(context_, x);});
        return true;
    };
    //--
    this.clearListeners = /*void*/ function (/*String?*/ event_) {
        // CODE
        if (event_){
            _listeners[event_].clear();
        }else{
            _listeners = {};
        } //-- end if
        return;
    };
    //--
    this.removeListener = /*void*/ function (/*String*/ event_, /*Function*/ func_) {
        // CODE
        if (_listeners[event_]){
            _listeners[event_].remove(func_);
        } //-- end if
        return;
    };

    //----------------------------------------------------------
    //-- data manipulation
    //----------------------------------------------------------

    this.removeExcept = /*void*/ function (/*Array of items*/ items_) {
        // VARS
        var _err, _values=[], _keys=[], _changes={del:[], upd:[], ins:[]};
        // CODE
        if (!js.isArray(items_)){
            throw new Error("Parameter 'items' has wrong type. Expected array of objects.");
        } //-- end if
        if (!items_.every(function(x){_err=x; return _checkFields(x);})){
            js.logErr("Parameter 'items' contains wrong item:", _err);
            throw new Error("Parameter 'items' contains wrong item.");
        } //-- end if
        items_.forEach(function(x){
            // CODE
            _values.push(_filterAllFields(x));
            _keys.push(_filterKeyFields(x));
        });
        _items.getKeys().forEach(function(x){
            // CODE
            if (_keys.every(function(y){return js.stringify(x)!==js.stringify(y);})){
                _changes.del.push(_items.remove(x));
            } //-- end if
        });
        if (_listeners.change){
            _listeners.change.getValues().forEach(function(x){x(_changes);});
        } //-- end if
    };

    //----------------------------------------------------------
    this.removeByUids = /*void*/ function (/*Array of int*/ uids_) {
        // VARS
        var _changes={del:[], upd:[], ins:[]};
        // CODE
        if (!js.isArray(uids_) || !uids_.every(function(x){return js.isInt(x);})){
            throw new Error("Parameter has wrong type. Expected array of int.");
        } //-- end if
        _items.getEntries().forEach(function(x){
            // CODE
            if (uids_.indexOf(x.value.__uid)>=0){
                _changes.del.push(_items.remove(x));
            } //-- end if
        });
        if (_listeners.change){
            _listeners.change.getValues().forEach(function(x){x(_changes);});
        } //-- end if
    };

    //----------------------------------------------------------
    this.add = /*void*/ function (/*Array of items*/ items_) {
        // VARS
        var _err, _values=[], _keys=[], _changes={del:[], upd:[], ins:[]};
        // CODE
        if (!js.isArray(items_)){
            throw new Error("Parameter 'items' has wrong type. Expected array of objects.");
        } //-- end if
        if (!items_.every(function(x){_err=x; return _checkFields(x);})){
            js.logErr("Parameter 'items' contains wrong item:", _err);
            throw new Error("Parameter 'items' contains wrong item.");
        } //-- end if
        items_.forEach(function(x){
            // CODE
            _values.push(_filterAllFields(x));
            _keys.push(_filterKeyFields(x));
        });
        _keys.forEach(function(x, i){
            // VARS
            var _v;
            // CODE
            if (!_items.hasKey(x)){
                _v = _values[i];
                _v.__uid = _getUid();
                _items.put(x, _v);
                _changes.ins.push(_v);
            } //-- end if
        });
        if (_listeners.change){
            _listeners.change.getValues().forEach(function(x){x(_changes);});
        } //-- end if
    };

    //----------------------------------------------------------
    this.update = /*void*/ function (/*Array of items*/ items_) {
        // VARS
        var _err, _values=[], _keys=[], _changes={del:[], upd:[], ins:[]};
        // CODE
        if (!js.isArray(items_)){
            throw new Error("Parameter 'items' has wrong type. Expected array of objects.");
        } //-- end if
        if (!items_.every(function(x){_err=x; return _checkFields(x);})){
            js.logErr("Parameter 'items' contains wrong item:", _err);
            throw new Error("Parameter 'items' contains wrong item.");
        } //-- end if
        items_.forEach(function(x){
            // CODE
            _values.push(_filterAllFields(x));
            _keys.push(_filterKeyFields(x));
        });
        _keys.forEach(function(x, i){
            // VARS
            var _v, _ov;
            // CODE
            if (_items.hasKey(x)){
                _v = _values[i];
                _ov = _items.get(x);
                _v.__uid = _ov.__uid;
                if (js.stringify(_v)!==js.stringify(_ov)){
                    _items.put(x, _v);
                    _changes.upd.push(_v);
                } //-- end if
            } //-- end if
        });
        if (_listeners.change){
            _listeners.change.getValues().forEach(function(x){x(_changes);});
        } //-- end if
    };

    //----------------------------------------------------------
    this.adjust = /*void*/ function (/*Array of items*/ items_, /*boolean*/ skipDel_) {
        // VARS
        var _err, _values=[], _keys=[], _changes={del:[], upd:[], ins:[]};
        // CODE
        if (!js.isArray(items_)){
            throw new Error("Parameter 'items' has wrong type. Expected array of objects.");
        } //-- end if
        if (!items_.every(function(x){_err=x; return _checkFields(x);})){
            js.logErr("Parameter 'items' contains wrong item:", _err);
            throw new Error("Parameter 'items' contains wrong item.");
        } //-- end if
        items_.forEach(function(x){
            // CODE
            _values.push(_filterAllFields(x));
            _keys.push(_filterKeyFields(x));
        });
        if (!skipDel_){
            _items.getKeys().forEach(function(x){
                // CODE
                if (_keys.every(function(y){return js.stringify(x)!==js.stringify(y);})){
                    _changes.del.push(_items.remove(x));
                } //-- end if
            });
        } //-- end if
        _keys.forEach(function(x, i){
            // VARS
            var _v, _ov;
            // CODE
            _v = _values[i];
            if (_items.hasKey(x)){
                _ov = _items.get(x);
                _v.__uid = _ov.__uid;
                if (js.stringify(_v)!==js.stringify(_ov)){
                    _items.put(x, _v);
                    _changes.upd.push(_v);
                } //-- end if
            }else{
                _v.__uid = _getUid();
                _items.put(x, _v);
                _changes.ins.push(_v);
            } //-- end if
        });
        if (_listeners.change){
            _listeners.change.getValues().forEach(function(x){x(_changes);});
        } //-- end if
    };

    //----------------------------------------------------------
    this.getGrid = /*Array of items*/ function () {return _items.getValues();};

    //----------------------------------------------------------
    this.getRow = /*items*/ function (/*item*/ key_) {return _items.get(key_);};

    //----------------------------------------------------------
    this.getKeys = /*items*/ function () {return _items.getKeys();};

});});