/*
 * Title:       Javascript library. Widget. Radio group.
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
 *    01-01a01  01.11.2017  AK    1. initial creation
 *    --------  ----------  ----  ---------------------------------------------
 */

js.include(["com.ak.widget._Widget"], function(_Widget){
    // CODE
    js.define({module:"com.ak.widget.RadioGroup", version:"0101a01"}, 
              [_Widget], 
              function (/*Object?*/ prm_){

    //---------------
    //-- markers:   string of markers, separated by space; i.e. "marker1 marker2"
    //-- classes:   array of strings of classes, separated by space; i.e. "class1 class2"
    //--            i.e. for three buttons: [<rb1>, <rb2>, <rb3>]
    //-- values:    array of strings of values (mandatory); its length defines number of buttons

    //----------------------------------------------------------
    //-- precheck & fields
    //----------------------------------------------------------

    var _root;
    var _rbs = [];
    var _vals;
    var _uid = js.getUid();

    if (!prm_){
        throw new Error("Parameter 'prm' is absent.");
    } //-- end if
    if (!prm_.values){
        throw new Error("Mandatory parameter field 'values' is absent.");
    } //-- end if
    if (!js.isArray(prm_.values)){
        throw new Error("Parameter field 'values' is not an array.");
    } //-- end if
    _vals = prm_.values.filter(function(x){return x;});
    if (_vals.length<2){
        throw new Error("Parameter field 'values' is an array of length <2.");
    } //-- end if
    if (_vals.some(function(x){return !js.isString(x);})){
        js.logErr("Parameter field 'values' is not an array of only strings; arr:", prm_.values);
        throw new Error("Parameter field 'values' is not an array of only strings.");
    } //-- end if

    //----------------------------------------------------------
    //-- aux function
    //----------------------------------------------------------

    //----------------------------------------------------------
    //-- main function
    //----------------------------------------------------------
    
    this.getValue = /*String*/ function () {
        // CODE
        return _rbs.reduce(function(x, y){return y.checked?y.value:x;}, null);
    };
    //--
    this.setValue = /*boolean*/ function (/*String or number*/ val_) {
        // CODE
        return _rbs.some(function(x){
            // CODE
            if (x.value===val_){
                x.checked = true;
                return true;
            } //-- end if
            return false;
        });
    };
    //--
    this.init = /*String*/ function (/*Array of Strings*/ arr_) {
        // CODE
        if (_rbs.length==0){
            arr_.forEach(function(x){
                // VARS
                var _rb = document.createElement("input");
                // CODE
                _rb.type = "radio";
                _rb.name = _uid;
                _rb.value = x;
                _root.appendChild(_rb);
                _rbs.push(_rb);
            });
        } //-- end if
    };
    //--
    this.select = /*String*/ function (/*int*/ idx_) {if (_rbs[idx_]){_rbs[idx_].checked = true;}};
    //--
    this.setClasses = /*String*/ function (/*Array of Strings*/ val_) {
        // CODE
        val_.forEach(function(x, i){
            // CODE
            if (i>0){
                _rbs[i-1].className = x;
            }else{
                _root.className = x;
            } //-- end if
        });
    };
    //--
    this.addClasses4rb = /*String*/ function (/*String*/ val_, /*int?*/ idx_) {
        // CODE
        if (idx_>=0 && idx_<_rbs.length){
            js.addClasses(_rbs[idx_], val_);
        } //-- end if
    };
    //--
    this.removeClass4rb = /*String*/ function (/*String*/ val_, /*int?*/ idx_) {
        // CODE
        if (idx_>=0 && idx_<_rbs.length){
            js.removeClass(_rbs[idx_], val_);
        } //-- end if
    };
    //--
    this.addEventListener = /*void*/ function (/*String*/ event_, /*Function*/ func_) {
        // CODE
        _rbs.forEach(function(x){x.addEventListener(event_, func_);});
    };
    //--
    this.setDisabled = /*void*/ function (/*boolean*/ flag_) {_rbs.forEach(function(x){x.disabled = flag_;});};

    //----------------------------------------------------------
    //-- initial operations
    //----------------------------------------------------------

    _root = document.createElement("div");
    this.setRootHtml(_root);
    this.init(_vals);
    if (prm_.classes){this.setClasses(prm_.classes);}
    if (prm_.markers){js.addMarkers(this, prm_.markers);}

});});

