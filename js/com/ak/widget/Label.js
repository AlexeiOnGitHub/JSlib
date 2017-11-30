/*
 * Title:       Javascript library. Widget. Label.
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
    js.define({module:"com.ak.widget.Label", version:"0101a01"}, 
              [_Widget], 
              function (/*Object?*/ prm_){

    //---------------
    //-- markers:   string of markers, separated by space; i.e. "marker1 marker2"
    //-- classes:   string of classes, separated by space; i.e. "class1 class2"
    //-- value:     label text
    //-- src:       label image

    //----------------------------------------------------------
    //-- precheck & fields
    //----------------------------------------------------------

    var _item, _img;

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

    //----------------------------------------------------------
    //-- initial operations
    //----------------------------------------------------------

    _item = document.createElement("div");
    this.setRootHtml(_item);
    if (prm_){
        if (prm_.classes){this.setClasses(prm_.classes);}
        if (prm_.markers){js.addMarkers(this, prm_.markers);}
        if (prm_.value){this.setValue(prm_.value);}
        if (prm_.src){
            _img = document.createElement("img");
            _img.src = prm_.src;
            _item.appendChild(_img);
        } //-- end if
    } //-- end if

});});

