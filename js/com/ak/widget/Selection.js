/*
 * Title:       Javascript library. Widget. Selection.
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
    js.define({module:"com.ak.widget.Selection", version:"0101a01"}, 
              [_Widget], 
              function (/*Object?*/ prm_){

    //---------------
    //-- markers:   string of markers, separated by space; i.e. "marker1 marker2"
    //-- classes:   string of classes, separated by space; i.e. "class1 class2"
    //-- values:    array of strings of values (mandatory); its length defines number of options (must be >1)
    //-- labels:    array of strings of visual labels; its length must be equal to values array length
    //-- size:      integer value of list size (must be >1); default value is 0 that means "combobox"
    //-- multi:     boolean flag of possibility of multiple selection; default: false

    //----------------------------------------------------------
    //-- precheck & fields
    //----------------------------------------------------------

    var _root;
    var _self = this;

    if (!prm_){
        throw new Error("Parameter 'prm' is absent.");
    } //-- end if
    if (!prm_.values){
        throw new Error("Mandatory parameter field 'values' is absent.");
    } //-- end if
    if (!js.isArray(prm_.values)){
        throw new Error("Parameter field 'values' is not an array.");
    } //-- end if
    if (prm_.multi){
        if (!prm_.size || prm_.size<2){
            throw new Error("Parameter field 'size' is not set or <2.");
        } //-- end if
    } //-- end if
    if (prm_.labels){
        if (!js.isArray(prm_.labels)){
            throw new Error("Parameter field 'labels' is not an array.");
        } //-- end if
        if (prm_.labels.length!=prm_.values.length){
            js.logErr("Parameter field 'labels' length is not equal to parameter field 'values' length; labels:", prm_.labels, "; values:", prm_.values);
            throw new Error("Parameter field 'labels' length is not equal to parameter field 'values' length.");
        } //-- end if
    } //-- end if

    //----------------------------------------------------------
    //-- aux function
    //----------------------------------------------------------

    //----------------------------------------------------------
    //-- main function
    //----------------------------------------------------------
    
    this.getValue = /*String or Array of Strings*/ function () {
        // CODE
        return _root.multiple?_root.options.reduce(function(x, y){if (y.selected){x.push(y.value);} return x;}, [])
                             :_root.options.reduce(function(x, y){return y.selected?y.value:x;}, null);
    };
    //--
    this.setValue = /*String*/ function (/*Array or String/int*/ val_) {_root.value = val_;};
    //--
    this.init = /*String*/ function (/*String[]*/ values_, /*String[]*/ labels_) {
        // VARS
        var _labels;
        // CODE
        if (!js.isArray(values_)){
            throw new Error("Parameter 'values' is not an array.");
        } //-- end if
        if (labels_){
            if (!js.isArray(labels_)){
                throw new Error("Parameter 'labels' is not an array.");
            } //-- end if
            if (labels_.length!=values_.length){
                js.logErr("Parameter 'labels' length is not equal to parameter 'values' length; labels:", labels_, "; values:", values_);
                throw new Error("Parameter 'labels' length is not equal to parameter 'values' length.");
            } //-- end if
            _labels = labels_;
        }else{
            _labels = values_;
        } //-- end if
        this.clear();
        values_.forEach(function(x, i){_self.add(x, _labels[i]);});
    };
    //--
    this.select = /*String*/ function (/*int*/ idx_) {if (_root.options[idx_]){_root.options[idx_].selected=true;}};
    //--
    this.setDisabled = /*void*/ function (/*boolean*/ flag_) {
        // CODE
        _root.disabled=flag_;
        if (flag_){ //-- disable
            js.addClass(_root, "disabled");
        }else{ //-- enable
            js.removeClass(_root, "disabled");
        } //-- end if
    };
    //--
    this.clear = /*void*/ function () {while (_root.length>0){_root.remove(0);}};
    //--
    this.add = /*void*/ function (/*String*/ value_, /*String*/ label_) {
        // VARS
        var _option = document.createElement("option");
        // CODE
        _option.value = value_;
        _option.text = label_ || value_;
        _root.add(_option);         
    };

    //----------------------------------------------------------
    //-- initial operations
    //----------------------------------------------------------

    _root = document.createElement("select");
    this.setRootHtml(_root);
    this.init(prm_.values, prm_.labels);
    if (prm_.size>1){_root.size=prm_.size;}
    _root.multiple = prm_.multi;
    if (prm_.classes){this.setClasses(prm_.classes);}
    if (prm_.markers){js.addMarkers(this, prm_.markers);}

});});

