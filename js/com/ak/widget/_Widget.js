/*
 * Title:       Javascript library. Widget. Core.
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

js.include([], function(){
    // CODE
    js.define({module:"com.ak.widget._Widget", version:"0101a01"}, 
              [], 
              function (){

    //----------------------------------------------------------
    //-- precheck & fields
    //----------------------------------------------------------

    //----------------------------------------------------------
    //-- aux functions
    //----------------------------------------------------------

    var _getNipple = function(){return this.getRootHtml();};

    //----------------------------------------------------------
    //-- main functions
    //----------------------------------------------------------

    this.isWidget = /*boolean*/ function (/*void*/) {return this.getRoots && this.getRoots().indexOf(com.ak.widget._Widget)>=0;};
    //--
    this.getParentWidget = /*Widget*/ function () {return null;};
    //--
    this.getChildrenWidgets = /*Array of Widgets*/ function () {
        // CODE
        return _getNipple.apply(this).children.filter(function(x){return x.__widget;})
                                              .map(function(x){return x.__widget;});
    };
    //--
    var _setParentWidget = /*void*/ function (/*Widget*/ wdg_) {
        // CODE
        if (!wdg_ || !wdg_.isWidget()){throw new Error("Parameter is not a _Widget descendant.");}
        this.getParentWidget = function (){return wdg_;};
    };
    //--
    this.setRootHtml = /*void*/ function (/*HTMLElement*/ elem_) {
        // CODE
        if (!js.isElement(elem_)){throw new Error("Parameter has wrong type. Expected HTMLElement.");}
        elem_.__widget = this;
        this.getRootHtml = function () {return elem_;};
    };
    //--
    this.setValue = function (/*String*/ val_) {
        // CODE
        this.getRootHtml().innerHTML = val_;
    };
    //--
    this.getValue = function () {return this.getRootHtml().innerHTML;};
    //--
    this.addClasses = function (/*String*/ val_) {js.addClasses(this.getRootHtml(), val_);};
    //--
    this.removeClass = function (/*String*/ val_) {js.removeClass(this.getRootHtml(), val_);};
    //--
    this.setClasses = function (/*String*/ val_) {this.getRootHtml().className = val_;};
    //--
    this.insertInto = /*void*/ function (/*HTMLElement*/ elem_) {
        // CODE
        if (!this.getRootHtml){throw new Error("Root HTML element is not defined.");}
        if (js.isElement(elem_)){
            elem_.appendChild(this.getRootHtml());
        }else if (elem_.isWidget && elem_.isWidget()){
            _setParentWidget.apply(this, [elem_]);
            _getNipple.apply(elem_).appendChild(this.getRootHtml());
        }else{
            js.log("Parameter is neighter HTMLElement, nor _Widget descendant.", elem_);
            throw new Error("Parameter is neighter HTMLElement, nor _Widget descendant.");
        } //-- end if
    };
    //--
    this.appendChild = /*void*/ function (/*Object*/ obj_) {
        // CODE
        if (!obj_){throw new Error("Parameter is null.");}
        if (js.isElement(obj_)){
            _getNipple(this).appendChild(obj_);
        }else if (obj_.isWidget && obj_.isWidget()){
            obj_.insertInto(this);
        }else{
            js.log("Parameter is neighter HTMLElement, nor _Widget descendant.", obj_);
            throw new Error("Parameter is neighter HTMLElement, nor _Widget descendant.");
        } //-- end if
    };
    //--
    this.removeChild = /*void*/ function (/*Object*/ obj_) {
        // CODE
        if (!obj_){throw new Error("Parameter is null.");}
        if (js.isElement(obj_)){
            _getNipple(this).removeChild(obj_);
        }else if (obj_.isWidget && obj_.isWidget()){
            _setParentWidget.apply(obj_, []);
            _getNipple.apply(this).removeChild(obj_.getRootHtml());
        }else{
            js.log("Parameter is neighter HTMLElement, nor _Widget descendant.", obj_);
            throw new Error("Parameter is neighter HTMLElement, nor _Widget descendant.");
        } //-- end if
    };
    //--
    this.hide = /*void*/ function () {
        // VARS
        var _self=this, _root=this.getRootHtml(), _display;
        // CODE
        if (_root && _root.style.display!=="none"){
            _display = _root.style.display || "block";
            this.show = function (){_self.getRootHtml().style.display = _display;};
            _root.style.display = "none";
        } //-- end if
    };
    //--
    this.show = /*void*/ function () {this.getRootHtml().style.display = "block";};
    //--
    this.isHidden = /*boolean*/ function () {return this.getRootHtml().style.display==="none";};
    //--
    this.setDisabled = /*void*/ function (/*boolean*/ flag_) {
        // CODE
        this.getChildrenWidgets().forEach(function(x){setDisabled(flag_);});
    };
    //--
    this.addEventListener = /*void*/ function (/*String*/ event_, /*Function*/ func_) {
        // CODE
        this.getRootHtml().addEventListener(event_, func_);
    };
    //--
    this.focus = /*void*/ function () {this.getRootHtml().focus();};

});});

