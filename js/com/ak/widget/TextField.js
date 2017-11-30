/*
 * Title:       Javascript library. Widget. TextField.
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
    js.define({module:"com.ak.widget.TextField", version:"0101a01"}, 
              [_Widget], 
              function (/*Object?*/ prm_){

    //---------------
    //-- markers:   string of markers, separated by space; i.e. "marker1 marker2"
    //-- classes:   string of classes, separated by space; i.e. "class1 class2"
    //-- value:     default value of textfiled
    //-- emptymsg:  message that is shown when textfield is empty
    //-- disabled:  disabled/enabled flag; true: disabled; default: enabled
    //-- password:  secure/unsecure input; true: secure

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

    this.setValue = function (/*String*/ val_) {
        // CODE
        _item.value = val_;
    };
    //--
    this.getValue = function () {return _item.value;};
    //--
    this.setDisabled = /*void*/ function (/*boolean*/ flag_) {
        // CODE
        _item.disabled = flag_;
        if (flag_){ //-- disable
            js.addClass(_item, "disabled");
        }else{ //-- enable
            js.removeClass(_item, "disabled");
        } //-- end if
    };


    //----------------------------------------------------------
    //-- initial operations
    //----------------------------------------------------------

    _item = document.createElement("input");
    this.setRootHtml(_item);
    if (prm_){
        if (prm_.classes){this.setClasses(prm_.classes);}
        if (prm_.markers){js.addMarkers(this, prm_.markers);}
        if (prm_.value){this.setValue(prm_.value);}
        if (prm_.emptymsg){_item.placeholder = prm_.emptymsg+"";}
        if (prm_.disabled){this.setDisabled(prm_.disabled);}
        if (prm_.password){_item.type = "password";}
    } //-- end if

});});

