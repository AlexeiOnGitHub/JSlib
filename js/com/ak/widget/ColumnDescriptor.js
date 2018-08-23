/*
 * Title:       Javascript library. Widget. Column descriptor.
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
 *    01-01a03  22.08.2018  AK    1. Add table filter support.
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01a02  17.12.2017  AK    1. Add table sort support.
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01a01  10.10.2017  AK    1. initial creation
 *    --------  ----------  ----  ---------------------------------------------
 */

js.include([], function(){
    // CODE
    js.define({module:"com.ak.widget.ColumnDescriptor", version:"0101a03"}, 
              [], 
              function (/*Object*/ prm_){

    //----------------------------------------------------------
    //-- precheck & fields
    //----------------------------------------------------------

    //--
    if (!prm_){
        throw new Error("Parameter is absent. Expected an object to init 'column descriptor'.");
    } //-- end if

    //---------------
    //-- type:          type of value; mandatory; is used for filter & sort
    //-- format:        date format; conditional; is used for sort
    //-- title:         column title; default: empty
    //-- width:         column width; default: 200px
    //-- sortable:      flag that column values may be used to sort rows; default: true
    //-- filterable:    flag that column values may be used to filter rows; default: true
    //-- valueFn:       function that extracts value from row; default: corresponding value from row or undefined
    //-- renderFn:      function that form cell structure; default: div with value from valueFn
    //-- sortFn:        function that is used to sort rows using column value; 
    //--                    default: alpabetic for "alphanum" type, numeric for "number", 
    //--                             formatted "yyyy.mm.dd HH.MM.ss" for "date"

    var _type = prm_.type;
    switch (_type){
        case "alphanum":
        case "number":
        case "date":
            break;
        default:
            throw new Error("Unsupported column type:["+_type+"]. Expected: 'alphanum', 'number', or 'date'.");
    } //-- end switch

    var _format = prm_.format;
    var _title = prm_.title;
    
    var _width = prm_.width;
    if (!_width){
        _width = 200;
    }else if (!js.isInt(_width) || _width<0 || _width>5000){
        throw new Error("Wrong field 'width' type. Expected integer value from 0 to 5000.");
    } //-- end if

    var _sortable = true;
    if (prm_.sortable===false){
        _sortable = false;
    } //-- end if
    var _sortOrderAsc = true;

    var _filterable = true;
    if (prm_.filterable===false){
        _filterable = false;
    } //-- end if

    //----------------------------------------------------------
    //-- main functions
    //----------------------------------------------------------

    this.setSourceFunction = /*void*/ function (/*Function*/ func_){
        // CODE
        if (!js.isFunction(func_)){
            js.logErr("Wrong parameter type; expected 'function'; arg:", func_);
            throw new Error("Wrong parameter type; expected 'function'");
        } //-- end if
        this.getValue = func_; 
    };
    //--
    this.setDefaultSourceFunction = /*void*/ function (){
        this.getValue = _defaultSourceFunction;
    };
    //--
    this.setCellRenderingFunction = /*void*/ function (/*Function*/ func_){
        // CODE
        if (!js.isFunction(func_)){
            js.logErr("Wrong parameter type; expected 'function'; arg:", func_);
            throw new Error("Wrong parameter type; expected 'function'");
        } //-- end if
        this.renderCell = func_;
    };
    //--
    this.setDefaultCellRenderingFunction = /*void*/ function (){
        this.renderCell = _defaultCellRenderingFunction;
    };
    //--
    this.setHeaderRenderingFunction = /*void*/ function (/*Function*/ func_){
        // CODE
        if (!js.isFunction(func_)){
            js.logErr("Wrong parameter type; expected 'function'; arg:", func_);
            throw new Error("Wrong parameter type; expected 'function'");
        } //-- end if
        this.renderHeader = func_;
    };
    //--
    this.setDefaultHeaderRenderingFunction = /*void*/ function (){
        this.renderHeader = _defaultHeaderRenderingFunction;
    };
    //--
    this.setSortingFunction = /*void*/ function (/*Function*/ func_){
        // CODE
        if (!js.isFunction(func_)){
            js.logErr("Wrong parameter type; expected 'function'; arg:", func_);
            throw new Error("Wrong parameter type; expected 'function'");
        } //-- end if
        this.sort = func_;
    };
    //--
    this.setDefaultSortingFunction = /*void*/ function (){
        this.sort = _defaultSortingFunction;
    };
    //--
    this.setSortOrderAsc = /*void*/ function (/*boolean*/ val_){
        _sortOrderAsc = val_===true;
    };
    //--
    this.changeSortOrder = /*void*/ function (){
        _sortOrderAsc = !_sortOrderAsc;
    };

    //--
    this.isSortable = /*int*/ function (){return _sortable;};

    //--
    this.isSortOrderAsc = /*int*/ function (){return _sortOrderAsc;};

    //--
    this.isFilterable = /*int*/ function (){return _filterable;};

    //--
    this.getWidth = /*int*/ function (){return _width;};

    //--
    this.getTitle = /*int*/ function (){return _title;};

    //----------------------------------------------------------
    //-- aux functions
    //----------------------------------------------------------

    var _defaultSourceFunction = /*?*/ function(/*Array*/ row_, /*int*/ idx_){
        // CODE
        return row_?row_[idx_]:undefined;
    };  
    //--
    var _defaultCellRenderingFunction = /*HTMLElement*/ function (/*HTMLElement*/ parent_, /*Array*/ row_, /*int*/ idxr_, 
                                                                  /*ColumnDescriptor*/ cd_, /*int*/ idxc_){
        // VARS
        var _elem = document.createElement("div");
        // CODE
        _elem.innerHTML = cd_.getValue(row_, idxc_) || ("cell "+row_.__uid+"x"+idxc_);
        return _elem;
    };
    //--
    var _defaultHeaderRenderingFunction = /*HTMLElement*/ function (/*HTMLElement*/ parent_, /*ColumnDescriptor*/ cd_, /*int*/ idxc_){
        // VARS
        var _elem = document.createElement("div");
        // CODE
        _elem.innerHTML = cd_.getTitle() || ("col "+idxc_);
        return _elem;
    };
    //--
    var _defaultSortingFunction = /*int*/ function (/*?*/ val1_, /*?*/ val2_) {
        // VAR
        var _v1, _v2;
        // CODE
        if (!_sortable){return 0;} //-- end if
        switch (_type){
            case "alphanum":
                _v1 = val1_+"";
                _v2 = val2_+"";
                return _v1==_v2?0:(_v1<_v2?-1:1);
            case "number":
              _v1 = +val1_;
                if (!js.isNumber(_v1)){
                    throw new Error("Wrong type of first argument; expected 'number', found:", _v1);
                } //-- end if
                _v2 = +val2_;
                if (!js.isNumber(_v2)){
                    throw new Error("Wrong type of second argument; expected 'number', found:", _v2);
                } //-- end if
                return _v1==_v2?0:(_v1<_v2?-1:1);
            case "date":
                _v1 = js.formatDate(null, val1_, "yyyy.mm.dd HH:MM:ss");
                _v2 = js.formatDate(null, val2_, "yyyy.mm.dd HH:MM:ss");
                return _v1==_v2?0:(_v1<_v2?-1:1);
            default:
                throw new Error("Unsupported column type:["+_type+"]");
        } //-- end switch
    };
    //--

    //----------------------------------------------------------
    //-- initial operations
    //----------------------------------------------------------

    if (prm_.valueFn){
        this.setSourceFunction(prm_.valueFn);
    }else{
        this.setDefaultSourceFunction();
    } //-- end if

    if (prm_.renderCellFn){
        this.setCellRenderingFunction(prm_.renderCellFn);
    }else{
        this.setDefaultCellRenderingFunction();
    } //-- end if

    if (prm_.renderHeaderFn){
        this.setHeaderRenderingFunction(prm_.renderHeaderFn);
    }else{
        this.setDefaultHeaderRenderingFunction();
    } //-- end if

    if (prm_.sortFn){
        this.setSortingFunction(prm_.sortFn);
    }else{
        this.setDefaultSortingFunction();
    } //-- end if

});});
