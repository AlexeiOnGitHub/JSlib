/*
 * Title:       Javascript library. Widget. Panel.
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
 *    01-01a01  30.10.2017  AK    1. initial creation
 *    --------  ----------  ----  ---------------------------------------------
 */

js.include(["com.ak.widget._Widget"], function(_Widget){
    // CODE
    js.define({module:"com.ak.widget.Panel", version:"0101a01"}, 
              [_Widget], 
              function (/*Object?*/ prm_){

    //---------------
    //-- markers:   string of markers, separated by space; i.e. "marker1 marker2"
    //-- classes:   string of classes, separated by space; i.e. "class1 class2"

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
        _item.disabled = flag_;
        if (flag_){ //-- disable
            js.addClass(_item, "panel-disabled");
        }else{ //-- enable
            js.removeClass(_item, "panel-disabled");
        } //-- end if
    };

    //----------------------------------------------------------
    //-- initial operations
    //----------------------------------------------------------

    _item = document.createElement("div");
    this.setRootHtml(_item);
    if (prm_){
        if (prm_.classes){this.setClasses(prm_.classes);}
        if (prm_.markers){js.addMarkers(this, prm_.markers);}
    } //-- end if

});});

