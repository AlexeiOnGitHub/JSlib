/*
 * Title:       Javascript library. Utility. LinkedList.
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
 *    01-01a02  16.11.2017  AK    1. new js.define is used to define module
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01a01  04.10.2017  AK    1. initial creation
 *    --------  ----------  ----  ---------------------------------------------
 */

js.include([], function(){
    // CODE
    js.define({module:"com.ak.util.LinkedList", version:"0101a02"}, 
              [], 
              function(){

    //----------------------------------------------------------
    //-- fields
    //----------------------------------------------------------

    var _first, _last, _size;

    //----------------------------------------------------------
    //-- main functions
    //----------------------------------------------------------

    this.add = /*void*/ function (/*?*/ item_) {this.insert(_size, item_);};
    //--
    this.insert = /*void*/ function (/*int*/ idx_, /*?*/ item_) {
        // VARS
        var _node = {next:null, prev:null, payload:item_}, _ptr;
        // CODE
        if (!js.isInt(idx_) || idx_<0 || idx_>_size){
            throw new Error("Parameter 'index' is not integer or out of boundaries; expected integer value from 0 to "+_size);
        } //-- end if
        if (_size===0){ //-- insert element in empty list
            _first = _last = _node;
        }else if (idx_===0){ //-- insert as first element
            _node.next = _first;
            if (_first){_first.prev = _node;} //-- end if
            _first = _node;
        }else if (idx_===_size){ //-- insert as last element
            _node.prev = _last;
            if (_last){_last.next = _node;} //-- end if
            _last = _node;
        }else{
            for (_ptr=_first; idx_>1; idx_--){_ptr=_ptr.next;} //-- end for
            _node.next = _ptr.next;
            _node.prev = _ptr;
            _ptr.next.prev = _node;
            _ptr.next = _node;
        } //-- end if
        _size++;
    };
    //--
    this.clear = /*void*/ function (/*void*/) {_first=_last=null; _size=0;};
    //--
    this.contains = /*boolean*/ function (/*?*/ item_) {return this.indexOf(item_)>=0;};
    //--
    this.get = /*?*/ function (/*int*/ idx_) {
        // VAR
        var _ptr;
        // CODE
        if (!js.isInt(idx_) || idx_<0 || idx_>=_size){
            throw new Error("Parameter 'index' is not integer or out of boundaries; expected integer value from 0 to "+_size);
        } //-- end if
        for (_ptr=_first; idx_>0; idx_--){_ptr=_ptr.next;} //-- end for
        return _ptr.payload;
    };
    //--
    this.indexOf = /*int*/ function (/*?*/ item_) {
        // VAR
        var _idx=0, _ptr=_first, _str=js.stringify(item_);
        // CODE
        for (; _ptr; _idx++, _ptr=_ptr.next){
            if (_str===js.stringify(_ptr.payload)){break;} //-- end if
        } //-- end for
        return _idx<_size?_idx:-1;
    };
    //--
    this.lastIndexOf = /*int*/ function (/*?*/ item_) {
        // VAR
        var _idx=_size-1, _ptr=_last, _str=js.stringify(item_);
        // CODE
        for (; _ptr; _idx--, _ptr=_ptr.prev){
            if (_str===js.stringify(_ptr.payload)){break;} //-- end if
        } //-- end for
        return _idx;
    };
    //--
    this.remove = /*?*/ function (/*int*/ idx_) {
        // VAR
        var _ptr;
        // CODE
        if (!js.isInt(idx_) || idx_<0 || idx_>=_size){
            throw new Error("Parameter 'index' is not integer or out of boundaries; expected integer value from 0 to "+_size);
        } //-- end if
        if (_size===1){ //-- remove the latest element
            _ptr = _first;
            clear();
        }else if (idx_===0){ //-- remove first element
            _ptr = _first;
            _first = _first.next;
            if (_first){_first.prev = null;} //-- end if
        }else if (idx_===_size-1){ //-- remove last element
            _ptr = _last;
            _last = _last.prev;
            if (_last){_last.next = null;} //-- end if
        }else{
            for (_ptr=_first; idx_>0; idx_--){_ptr=_ptr.next;} //-- end for
            _ptr.next.prev = _ptr.prev;
            _ptr.prev.next = _ptr.next;
        } //-- end if
        _size--;
        return _ptr.payload;
    };
    //--
    this.size = /*void*/ function (/*void*/) {return _size;};
    //--
    this.isEmpty = /*boolean*/ function (/*void*/) {return _size===0;};
    //--
    this.toArray = /*void*/ function (/*void*/) {
        // VAR
        var _rv=[], _ptr=_first;
        // CODE
        for (; _ptr; _ptr=_ptr.next){_rv.push(_ptr.payload);} //-- end for
        return _rv;
    };
    //--

    //----------------------------------------------------------
    //-- initial operations
    //----------------------------------------------------------
    this.clear();
});});