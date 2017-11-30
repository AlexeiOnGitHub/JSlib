/*
 * Title:       Javascript library. Widget. Button.
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
 *    01-01a01  27.10.2017  AK    1. initial creation
 *    --------  ----------  ----  ---------------------------------------------
 */

js.include(["com.ak.widget._Widget"], function(_Widget){
    // CODE
    js.define({module:"com.ak.widget.Button", version:"0101a01"}, 
              [_Widget], 
              function (/*Object?*/ prm_){

    //---------------
    //-- markers:   string of markers, separated by space; i.e. "marker1 marker2"
    //-- classes:   string of classes, separated by space; i.e. "class1 class2"
    //-- value:     visual label
    //-- disabled:  disabled/enabled flag; true - disabled

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

    this.setDisabled = /*void*/ function (/*boolean*/ flag_) {_item.disabled = flag_;};

    //----------------------------------------------------------
    //-- initial operations
    //----------------------------------------------------------

    _item = document.createElement("button");
    this.setRootHtml(_item);
    if (prm_){
        if (prm_.classes){this.setClasses(prm_.classes);}
        if (prm_.markers){js.addMarkers(this, prm_.markers);}
        if (prm_.value){this.setValue(prm_.value);}
        if (prm_.disabled){this.setDisabled(prm_.disabled);}
    } //-- end if

});});

