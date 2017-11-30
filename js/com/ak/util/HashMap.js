/*
 * Title:       Javascript library. Utility. HashMap.
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
 *    01-01a03  30.11.2017  AK    1. js.getTimestamp is used to get timestamp
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01a02  16.11.2017  AK    1. new js.define is used to define module
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01a01  01.10.2017  AK    1. initial creation
 *    --------  ----------  ----  ---------------------------------------------
 */

js.include([], function(){
    // CODE
    js.define({module:"com.ak.util.HashMap", version:"0101a03"}, 
              [], 
              function (/*int*/ capacity_, /*float*/ loadFactor_){

    //----------------------------------------------------------
    //-- defaults
    //----------------------------------------------------------
    var __INITIAL_CAPACITY_DEF = 16;
    var __MAXIMUM_CAPACITY = 1<<30;
    var __INITIAL_LOAD_FACTOR_DEF = 0.75;

    //----------------------------------------------------------
    //-- precheck & fields
    //----------------------------------------------------------

    var _capacity, _loadFactor, _threshold, _size, _table;

    //-- __all_fields
    if (loadFactor_){
        if (!js.isNumber(loadFactor_) || loadFactor_<0){
            throw new Error("Parameter 'load factor' must be non-negative number.");
        } //-- end if
        _loadFactor = loadFactor_;
    }else{
        _loadFactor = __INITIAL_LOAD_FACTOR_DEF;
    } //-- end if

    if (capacity_){
        if (!js.isInt(capacity_) || capacity_<1 || capacity_>__MAXIMUM_CAPACITY){
            throw new Error("Parameter 'capacity' must be integer in range[1..2^30].");
        } //-- end if
        _capacity = 1;
        while (_capacity<capacity_){_capacity = _capacity << 1;}
    }else{
        _capacity = __INITIAL_CAPACITY_DEF;
    } //-- end if

    _threshold = _capacity * _loadFactor;
    _size = 0;
    _table = [];

    //----------------------------------------------------------
    //-- aux functions
    //----------------------------------------------------------

    var _rehash = /*int*/ function (/*int*/ hash_) {
        // VARS
        var _hash = hash_ ^ (hash_ >>> 20) ^ (hash_ >>> 12);
        // CODE
        return _hash ^ (_hash >>> 7) ^ (_hash >>> 4);
    };
    //--
    var _resize = /*void*/ function (/*int*/ new_capacity_) {
        // VARS
        var _old_table = _table;
        var _ts;
        // CODE
        if (new_capacity_<__MAXIMUM_CAPACITY) {
            if (js.isDebugLevel()){
                js.logDebug("._resize()", "Resizing hash table to ["+new_capacity_+"]...");
                _ts = js.getTimestamp();
            } //-- end if
            _table = [];
            _capacity = new_capacity_;
            _threshold = _capacity * _loadFactor;
            _old_table.forEach(function(x){if(x){x.forEach(function(y){
                // VAR
                var _idx = y.hash & (_capacity-1);
                var _arr = _table[_idx];
                // CODE
                if (_arr){_arr.push(y);}else{_table[_idx]=[y];}
            });}});
            js.logDebug("._resize()", "End of resize:", js.getTimestamp()-_ts, "ms");
        }else{
            _capacity = __MAXIMUM_CAPACITY;
            _threshold = __MAXIMUM_CAPACITY;
        }
        return;
    };
    //--
    var _getNode = /*<Node>?*/ function (/*<K>*/ key_) {
        // VAR
        var _str = js.stringify(key_);
        var _hash = _str.hashCode();
        var _idx = _hash & (_capacity-1), _idx2;
        var _arr = _table[_idx];
        // CODE
        if (_arr && _arr.some(function(x, i){_idx2=i; return x.strkey===_str;})){
            return _arr[_idx2];
        } //-- end if
        return null;
    };

    //--
    var _getNodes = /*Array of <Node>*/ function (/*void*/) {
        // CODE
        return _table.reduce(
            function(x1, x2){
                return (x2?x2:[]).reduce(
                    function(y1, y2){y1.push(y2); return y1;}, 
                    x1);},
            []);
    };

    //----------------------------------------------------------
    //-- main functions
    //----------------------------------------------------------

    this.put = /*<V>?*/ function (/*<K>*/ key_, /*<V>?*/ value_) {
        // VAR
        var _str = js.stringify(key_);
        var _hash = _str.hashCode();
        var _idx = _hash & (_capacity-1), _idx2;
        var _arr = _table[_idx];
        // CODE
        if (_arr){
            if (_arr.some(function(x, i){_idx2=i; return x.strkey===_str;})){
                return _arr.splice(_idx2, 1, {key:key_, value:value_, hash:_hash, strkey:_str, marker:[]})[0].value;
            } //-- end if
            _arr.push({key:key_, value:value_, hash:_hash, strkey:_str, marker:[]});
        }else{
            _table[_idx] = [{key:key_, value:value_, hash:_hash, strkey:_str, marker:[]}];
        } //-- end if
        _size++;
        if (_size>_threshold){
            _resize(_capacity << 1);
        } //-- end if
        return null;
    };
    //--
    this.get = /*<V>?*/ function (/*<K>*/ key_) {
        // VAR
        var _node = _getNode(key_);
        // CODE
        return _node?_node.value:null;
    };
    //--
    this.remove = /*<V>?*/ function (/*<K>*/ key_) {
        // VAR
        var _str = js.stringify(key_);
        var _hash = _str.hashCode();
        var _idx = _hash & (_capacity-1), _idx2;
        var _arr = _table[_idx];
        // CODE
        if (_arr){
            if (_arr.some(function(x, i){_idx2=i; return x.strkey===_str;})){
                _size--;
                return _arr.splice(_idx2, 1)[0].value;
            } //-- end if
        } //-- end if
        return null;
    };
    //--
    this.clear = /*void*/ function (/*void*/) {
        // CODE
        _table = [];
        _size=0;
    };
    //--
    this.hasKey = /*boolean*/ function (/*<K>*/ key_) {
        // VAR
        var _str = js.stringify(key_);
        var _hash = _str.hashCode();
        var _idx = _hash & (_capacity-1), _idx2;
        var _arr = _table[_idx];
        // CODE
        return _arr && _arr.some(function(x){return x.strkey===_str;});
    };
    //--
    this.hasValue = /*boolean*/ function (/*<V>*/ value_) {
        // VARS
        var _str = js.stringify(value_);
        // CODE
        return _table.some(function(x){return x && x.some(function(y){return _str===js.stringify(y.value);});});
    };
    //--
    this.getKeys = /*Array of <K>*/ function (/*void*/) {
        // CODE
        return _table.reduce(
            function(x1, x2){
                return (x2?x2:[]).reduce(
                    function(y1, y2){y1.push(y2.key); return y1;}, 
                    x1);},
            []);
    };
    //--
    this.getValues = /*Array of <V>*/ function (/*void*/) {
        // CODE
        return _table.reduce(
            function(x1, x2){
                return (x2?x2:[]).reduce(
                    function(y1, y2){y1.push(y2.value); return y1;}, 
                    x1);},
            []);
    };
    //--
    this.getEntries = /*Array of {key:<K>, value:<V>}*/ function (/*void*/) {
        // CODE
        return _table.reduce(
            function(x1, x2){
                return (x2?x2:[]).reduce(
                    function(y1, y2){y1.push({key: y2.key, value: y2.value}); return y1;}, 
                    x1);},
            []);
    };
    //--
    this.isEmpty = /*boolean*/ function (/*void*/) {return _size===0;};
    //--
    this.size = /*int*/ function (/*void*/) { return _size;};

    //--
    this.getMarks = /*Array of strings?*/ function (/*<K>*/ key_) {
        // VARS
        var _node = _getNode(key_);
        // CODE
        return _node?_node.marker:null;
    };
    //--
    this.addMark = /*boolean*/ function (/*<K>?*/ key_, /*String*/ mark_) {
        // VARS
        var _node = _getNode(key_);
        // CODE
        if (!_node){return false;} //-- end if
        if (_node.marker.indexOf(mark_<0)){_node.marker.push(mark_);} //-- end if
        return true;
    };
    //--
    this.hasMark = /*boolean*/ function (/*<K>?*/ key_, /*String*/ mark_) {
        // VARS
        var _node = _getNode(key_);
        // CODE
        if (_node){return _node.marker.indexOf(mark_)>=0;} //-- end if
        return false;
    };
    //--
    this.removeMark = /*void*/ function (/*<K>?*/ key_, /*String*/ mark_) {
        // VARS
        var _node = _getNode(key_);
        // CODE
        if (_node){_node.marker = _node.marker.filter(function(x){return x!=mark_;});} //-- end if
    };
    //--
    this.removeMarks = /*void*/ function (/*<K>?*/ key_) {
        // VARS
        var _node = _getNode(key_);
        // CODE
        if (_node){_node.marker = [];} //-- end if
    };
    //--
    this.removeAllMarks = /*void*/ function () {_getNodes().forEach(function(x){x.marker=[];});};

    //----------------------------------------------------------
    //-- initial operations
    //----------------------------------------------------------
    _resize(_capacity);
});});