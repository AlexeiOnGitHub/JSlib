/*
 * Title:       Javascript library. Widget. TextArea.
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
 *    01-01a01  24.10.2017  AK    1. initial creation
 *    --------  ----------  ----  ---------------------------------------------
 */

js.include(["com.ak.widget._Widget"], function(_Widget){
    // CODE
    js.define({module:"com.ak.widget.TextArea", version:"0101a01"}, 
              [_Widget], 
              function (/*Object?*/ prm_){

    //---------------
    //-- markers:   string of markers, separated by space; i.e. "marker1 marker2"
    //-- classes:   string of classes, separated by space; i.e. "class1 class2"
    //-- values:    array of text lines

    //----------------------------------------------------------
    //-- precheck & fields
    //----------------------------------------------------------

    var _item;

    //----------------------------------------------------------
    //-- aux function
    //----------------------------------------------------------

    //----------------------------------------------------------
    //-- main function
    //----------------------------------------------------------

    this.setDisabled = /*void*/ function (/*boolean*/ flag_) {
        // CODE
        if (flag_){ //-- disable
            js.addClass(_item, "disabled");
        }else{ //-- enable
            js.removeClass(_item, "disabled");
        } //-- end if
    };
    //--
    this.setValue = /*void*/ function (/*Array of strings*/ values_) {
        // CODE
        if (!js.isArray(values_)){
            values_ = [values_];
        } //-- end if
        if (values_.some(function(x){return !x && !js.isString(x);})){
            js.logErr("Parameter 'values' is not an array of only strings; arr:", values_);
            throw new Error("Parameter 'values' is not an array of only strings.");
        } //-- end if
        js.removeChildren(_item);
        values_.forEach(function(x){
            // VARS
            var _elem;
            // CODE
            _elem = document.createElement("p");
            _elem.innerHTML = x?x:"";
            _item.appendChild(_elem);
        });
        this.getValue = function (){return values_;};
    };

    //----------------------------------------------------------
    //-- initial operations
    //----------------------------------------------------------

    _item = document.createElement("div");
    this.setRootHtml(_item);
    if (prm_){
        if (prm_.classes){this.setClasses(prm_.classes);}
        if (prm_.markers){js.addMarkers(this, prm_.markers);}
        if (prm_.value){
            this.setValue(js.isString(prm_.values)?[prm_.values]:prm_.values.filter(function(x){return x;}));
        }
    } //-- end if

});});

