/*
 * Title:       Javascript library. Widget. Table.
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
 *    01-01a03  17.12.2017  AK    1. Add table sort support.
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01a02  04.12.2017  AK    1. Add table rebuild on window size change.
 *    --------  ----------  ----  ---------------------------------------------
 *    01-01a01  10.10.2017  AK    1. initial creation
 *    --------  ----------  ----  ---------------------------------------------
 */

js.include(["com.ak.widget._Widget",
            "com.ak.widget.ColumnDescriptor",
            "com.ak.model.DataModel"], 
            function(_Widget, ColumnDescriptor, DataModel){
    // CODE
    js.define({module:"com.ak.widget.Table", version:"0101a03"}, 
              [_Widget], 
              function (/*Object*/ prm_){

    //---------------
    //-- markers:   string of markers, separated by space; i.e. "marker1 marker2"
    //-- classes:   string of classes, separated by space; i.e. "class1 class2"
    //-- cds:       array of ColumnDescriptor objects (mandatory)
    //-- model:     DataModel object (mandatory)
    //-- hh:        header height; default: 50px
    //-- ch:        cell height; default: 50px
    //-- lstnrs:    array of descriptors of table/row/cell listeners
    //-- getHeight: function to get height of table on rebuild

    //----------------------------------------------------------
    //-- precheck & fields
    //----------------------------------------------------------

    var _self = this;
    
    if (!prm_){
        throw new Error("Parameter 'prm' is absent.");
    } //-- end if

    var _cds = prm_.cds;
    if (!_cds){
        throw new Error("Parameter field 'cds' is absent. Expected a non-empty array of 'com.ak.widget.ColumnDescriptor'.");
    } //-- end if
    if (!js.isArray(_cds) || _cds.length<1 || !_cds.every(function(x){return x && x.getClass && x.getClass()==="ColumnDescriptor";})){
        throw new Error("Parameter field 'cds' has wrong type. Expected a non-empty array of 'com.ak.widget.ColumnDescriptor'.");
    } //-- end if

    var _model = prm_.model;
    if (_model && _model.getClass && _model.getClass()!="DataModel"){
        throw new Error("Parameter field 'model' has wrong type. Expected an instance of 'com.ak.model.DataModel'.");
    } //-- end if

    var _getHeight = prm_.getHeight;
    if (_getHeight && !js.isFunction(_getHeight)){
        throw new Error("Parameter field 'getHeight' has wrong type. Expected a Function that returns integer value.");
    } //-- end if
    
    var _viewProfile = [];
    for (var i=0; i<_cds.length; i++){_viewProfile[i]=i;}

    var _sortProfile = [];

    var _root;
    var _header;
    var _body;
    var _hh = 50;
    var _ch = 50;
    var _oldVerticalScroll = 0;

    var _viewGrid = []; //-- filterred & sorted
    var _filters = [];

    var _lstnrs_table = [];
    var _lstnrs_hrow  = [];
    var _lstnrs_hcell = [];
    var _lstnrs_row   = [];
    var _lstnrs_cell  = [];

    if (prm_.lstnrs){
        prm_.lstnrs.forEach(function(x, i){
            // CODE
            switch (x.type){
              case "table": _lstnrs_table.push(x); break;
              case "hrow":  _lstnrs_hrow.push(x);  break;
              case "hcell": _lstnrs_hcell.push(x); break;
              case "row":   _lstnrs_row.push(x);   break;
              case "cell":  _lstnrs_cell.push(x);  break;
              default:
                js.logErr("Parameter field 'lstnrs' has unknown listener type:["+x.type+"]; index:["+i+"].");
                throw new Error("Parameter field 'lstnrs' has unknown listener type.");
            } //-- end switch
        });
    } //-- end if

    //----------------------------------------------------------
    //-- aux function
    //----------------------------------------------------------

    var _defaultCellRenderer = /*HTMLElement*/ function (/*Object*/ row_, /*int*/ rowIdx_, 
                                                         /*ColumnDescriptor*/ cd_, /*int*/ colIdx_) {
        // VARS
        var _item;
        // CODE
        _item = document.createElement("div");
        _item.innerHTML = cd_.getValue(row_, colIdx_) || ("cell "+row_.__uid+"x"+colIdx_);
        return _item;
    };
    //--
    var _defaultHeaderRenderer = /*HTMLElement*/ function (/*ColumnDescriptor*/ cd_, /*int*/ colIdx_) {
        // VARS
        var _item;
        // CODE
        _item = document.createElement("div");
        _item.innerHTML = cd_.getTitle() || ("col "+colIdx_);
        return _item;
    };
    //--
    var _renderTable = /*HTMLElement*/ function (/*void*/) {
        // VARS
        var _table, _headerHeight, _top=0;
        // CODE
        _table = document.createElement("div");
        js.addClass(_table, "page-table");
        _table.style.width = _cds.reduce(function(x, y){return x+y.getWidth();}, 19) + "px";
        _header = _renderHeaderRow();
        _header.__table = _table;
        _table.appendChild(_header);
        //--
        if (_body){
            _oldVerticalScroll = _body.scrollTop;
        } //-- end if
        _body = document.createElement("div");
        js.addClass(_body, "page-tablebody");
        _body.style.top = _header.style.height;
        _viewGrid.forEach(function(x, i, arr){
            // VARS
            var _row = _renderRow(x, i, _top);
            // CODE
            _row.__table = _table;
            _row.__data = x;
            _body.appendChild(_row); 
            _top+=_ch;
        });
        _table.appendChild(_body);
        //-- add listeners
        _lstnrs_table.forEach(function(x){_table.addEventListener(x.event, x.func);});
        return _table;
    };
    //--
    var _renderHeaderRow = /*HTMLElement*/ function (/*void*/) {
        // VARS
        var _headrow, _left=0, _elem;
        // CODE
        _headrow = document.createElement("div");
        js.addClass(_headrow, "page-tableheaderrow");
        _viewProfile.forEach(function(x, i){
            // CODE
            _elem = _renderHeaderCell(_left, _cds[x], i);
            _elem.__headrow = _headrow;
            _elem.__cd = _cds[x];
            _headrow.appendChild(_elem);
            _left += _cds[x].getWidth();
        });
        _headrow.style.height = _hh+"px";
        _elem = document.createElement("div");
        _elem.__headrow = _headrow;
        js.addClass(_elem, "page-tableheadercell");
        _elem.style.left = _left+"px";
        _elem.style.width = "18px";
        _elem.style.borderWidth = "0";
        _headrow.appendChild(_elem);
        //-- add listeners
        _lstnrs_hrow.forEach(function(x){_headrow.addEventListener(x.event, x.func);});
        return _headrow;
    };
    //--
    var _renderHeaderCell = /*HTMLElement*/ function (/*int*/ left_, /*ColumnDescriptor*/ cd_, /*int*/ colIdx_) {
        // VARS
        var _headcell, _wrap1, _wrap2, _wrap3, _content, _elem;
        // CODE
        _headcell = document.createElement("div");
        _wrap1 = document.createElement("div"); _wrap1.__headcell = _headcell;
        _wrap2 = document.createElement("div"); _wrap2.__headcell = _headcell;
        _wrap3 = document.createElement("div"); _wrap3.__headcell = _headcell;
        _content = document.createElement("div"); _content.__headcell = _headcell;
        js.addClass(_headcell, "page-tableheadercell");
        js.addClass(_wrap1, "page-tablecellwrap1");
        js.addClass(_wrap2, "page-tablecellwrap2");
        js.addClass(_wrap3, "page-tablecellwrap3");
        js.addClass(_content, "page-tablecellcontent");
        _headcell.style.left = left_+"px";
        _headcell.style.width = cd_.getWidth()+"px";
        if (colIdx_===0){
            _headcell.style.borderWidth = "0";
        } //-- end if
        _elem = cd_.renderHeader(_content, cd_, colIdx_);
        if (_sortProfile.length>0 && _sortProfile[0]===cd_){
            _elem.innerHTML += cd_.isSortOrderAsc()?"&#x25bc;":"&#x25b2;";
        } //-- end if
        _content.appendChild(_elem);
        _wrap3.appendChild(_content);
        _wrap2.appendChild(_wrap3);
        _wrap1.appendChild(_wrap2);
        _headcell.appendChild(_wrap1);
        //-- add listeners
        _lstnrs_hcell.forEach(function(x){_headcell.addEventListener(x.event, x.func);});
        if (cd_.isSortable()){
//js.log(">>> adding listener to header cell", _headcell);
            _headcell.addEventListener("click", function(){
                // CODE
//js.log(">>> cd:", cd_);
                if (_sortProfile.length>0 && _sortProfile[0]===cd_){
                    cd_.changeSortOrder();
                }else{
                    cd_.setSortOrderAsc(true);
                    _sortProfile = [cd_];
                } //-- end if
                _self.rebuild();
            });
        } //-- end if
        return _headcell;
    };
    //--
    var _renderRow = /*HTMLElement*/ function (/*Object*/ row_, /*int*/ rowIdx_, /*int*/ top_) {
        // VARS
        var _row, _left=0, _elem;
        // CODE
        _row = document.createElement("div");
        js.addClass(_row, "page-tablerow");
        _row.style.top = top_+"px";
        _viewProfile.forEach(function(x, i){
            _elem = _renderCell(_left, row_, rowIdx_, _cds[x], i);
            _elem.__row = _row;
            _row.appendChild(_elem);
            _left += _cds[x].getWidth();
        });
        _row.style.height = _ch+"px";
        _elem = document.createElement("div");
        _elem.__row = _row;
        js.addClass(_elem, "page-tablecell");
        _elem.style.left = _left+"px";
        _elem.style.width = "16px";
        _row.appendChild(_elem);
        //-- add listeners
        _lstnrs_row.forEach(function(x){_row.addEventListener(x.event, x.func);});
        return _row;
    };
    //--
    var _renderCell = /*HTMLElement*/ function (/*int*/ left_, /*Object*/ row_, /*int*/ rowIdx_, 
                                                /*ColumnDescriptor*/ cd_, /*int*/ colIdx_) {
        // VARS
        var _cell, _wrap1, _wrap2, _wrap3, _content;
        //CODE
        _cell = document.createElement("div");
        _wrap1 = document.createElement("div"); _wrap1.__cell = _cell;
        _wrap2 = document.createElement("div"); _wrap2.__cell = _cell;
        _wrap3 = document.createElement("div"); _wrap3.__cell = _cell;
        _content = document.createElement("div"); _content.__cell = _cell;
        js.addClass(_cell, "page-tablecell");
        js.addClass(_wrap1, "page-tablecellwrap1");
        js.addClass(_wrap2, "page-tablecellwrap2");
        js.addClass(_wrap3, "page-tablecellwrap3");
        js.addClass(_content, "page-tablecellcontent");
        _cell.style.left = left_+"px";
        _cell.style.width = cd_.getWidth()+"px";
        if (colIdx_===0){
            _cell.style.borderWidth = "0";
        } //-- end if
        _content.appendChild(cd_.renderCell(_content, row_, rowIdx_, cd_, colIdx_));
        _wrap3.appendChild(_content);
        _wrap2.appendChild(_wrap3);
        _wrap1.appendChild(_wrap2);
        _cell.appendChild(_wrap1);
        //-- add listeners
        _lstnrs_cell.forEach(function(x){_cell.addEventListener(x.event, x.func);});
        return _cell;
    };
    //--
    var _sortRow = /*int*/ function (/*Object[]*/ row1_, /*Object[]*/ row2_) {
        // VARS
        var _rv=0;
        // CODE
        _sortProfile.some(function (x){ /*cd*/
            // VAR
            var _idx = _cds.indexOf(x) ;
            // CODE
            _rv = x.sort(x.getValue(row1_, _idx), x.getValue(row2_, _idx));

//js.log(">>> cd index:", _idx, "; row1:", row1_, "; row2:", row2_, "; cd:", x);
//js.log(">>>    val1:", x.getValue(row1_, _idx), "; val2:", x.getValue(row2_, _idx), "; rv:", _rv, "; order:", x.isSortOrderAsc());
            _rv = (_rv===0 || x.isSortOrderAsc())?_rv:(-_rv);
          return _rv;
        });
//js.log(">>> _rv:", _rv);
        return _rv;
    };
    //--
    var _sortByRowId = /*int*/ function (/*Object[]*/ row1_, /*Object[]*/ row2_) {
        // VARS
        var _uid1 = row1_.__uid, _uid2 = row2_.__uid;
        // CODE
        return _uid1<_uid2?-1:(_uid1>_uid2?1:0);
    };

    //----------------------------------------------------------
    //-- main function
    //----------------------------------------------------------

    this.rebuild = /*void*/ function (/*void*/){
        // VARS
        var _item, _height;
        // CODE
        _viewGrid = _model.getGrid().filter(function(x){return _filters.every(function(y){y(x);});})
                                    .sort(function (x, y){return _sortByRowId(x, y);})
                                    .sort(function (x, y){return _sortRow(x, y);});
        _item = _renderTable();
        if (_item){
//            _height = _root.style.height;
            js.removeChildren(_root);
            _root.appendChild(_item);
            if (_getHeight){
                _height = _getHeight();
                _root.style.height = _height + "px";
                _body.style.height = (_height-_header.offsetHeight)+"px";
            }else{
                _body.style.height = (_root.offsetHeight-_header.offsetHeight)+"px";
            } //-- end if
            _body.scrollTop = (_oldVerticalScroll<_body.scrollTopMax?_oldVerticalScroll:_body.scrollTopMax);
        } //-- end if
    };
    //--

    //----------------------------------------------------------
    //-- initial operations
    //----------------------------------------------------------

    _root = document.createElement("div");
    this.setRootHtml(_root);
    if (prm_.classes){this.setClasses(prm_.classes);}
    if (prm_.markers){js.addMarkers(this, prm_.markers);}
    if (prm_.hh){_hh = +prm_.hh;}
    if (prm_.ch){_ch = +prm_.ch;}
    //--
    if (_getHeight){
        window.addEventListener("resize", function (e_) {_self.rebuild();});
    } //-- end if
});});
