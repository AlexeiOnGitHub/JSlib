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
 *    01-01a04  21.08.2018  AK    1. Add table filter support.
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
    js.define({module:"com.ak.widget.Table", version:"0101a04"}, 
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
    //-- filters:   boolean

    //----------------------------------------------------------
    //-- precheck & fields
    //----------------------------------------------------------

    var _self = this;
    var _hh = 50;
    var _ch = 50;
    var _oldVerticalScroll = 0;
    
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
    
    var _filterPresent = prm_.filters;
    
    var _viewProfile = [];
    for (var i=0; i<_cds.length; i++){_viewProfile[i]=i;}

    var _sortProfile = [];

    var _root;
    var _table;
    var _header;
    var _fltrow;
    var _body;

    var _viewGrid = []; //-- filterred & sorted
    var _filters = [];

    var _filtersEnabled = false;

    var _lstnrs_table = [];
    var _lstnrs_hrow  = [];
    var _lstnrs_hcell = [];
    var _lstnrs_row   = [];
    var _lstnrs_cell  = [];

    var _rebuild_timer;

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
        //-- header
        if (_body){
            _oldVerticalScroll = _body.scrollTop;
        } //-- end if
        _body = document.createElement("div");
        js.addClass(_body, "page-tablebody");
        _body.style.top = _hh + (_filtersEnabled?_hh:0) + "px";
        _viewGrid.forEach(function(x, i, arr){
            // VARS
            var _row = _renderRow(x, i, _top);
            // CODE
            _row.__table = _table;
            _row.__data = x;
            _body.appendChild(_row); 
            _top+=_ch;
        });
        return _body;
    };
    //--
    var _renderHeaderRow = /*HTMLElement*/ function (/*void*/) {
        // VARS
        var _headrow, _left=0, _elem, _btn;
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
        if (_filterPresent){
            _btn = document.createElement("button");
            js.addClasses(_btn, "btn-cmn btn-filter");
            _btn.addEventListener("click", function(){
                // CODE
                _filtersEnabled = !_filtersEnabled; 
                _fltrow.style.display = _filtersEnabled?"block":"none";
                _body.style.top = _hh + (_filtersEnabled?_hh:0) + "px";
                _body.style.height = _root.offsetHeight-_hh-(_filtersEnabled?_hh:0)+"px";
                _self.rebuild();
//js.log(">>> flt btn clicked! enabled:", _filtersEnabled, "body height", _body.style.top);
            });
            _elem.appendChild(_btn);
        } //-- end if
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
        _elem.__value = _elem.innerHTML;
        if (_sortProfile.length>0 && _sortProfile[0].cd===cd_){
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
                if (_sortProfile.length>0 && _sortProfile[0].cd===cd_){
                    cd_.changeSortOrder();
                    _elem.innerHTML = _elem.__value + (cd_.isSortOrderAsc()?"&#x25bc;":"&#x25b2;");
                }else{
                    if (_sortProfile.length>0){
                        _sortProfile[0].elem.innerHTML = _sortProfile[0].elem.__value;
                    } //-- end if
                    cd_.setSortOrderAsc(true);
                    _sortProfile = [{"cd":cd_, "elem":_elem}];
                    _elem.innerHTML = _elem.__value + (cd_.isSortOrderAsc()?"&#x25bc;":"&#x25b2;");
                } //-- end if
                _self.rebuild();
            });
        } //-- end if
        return _headcell;
    };
    //--
    var _renderFilterRow = /*HTMLElement*/ function (/*void*/) {
        // VARS
        var _filterrow, _left=0, _elem;
        // CODE
        _filterrow = document.createElement("div");
        js.addClass(_filterrow, "page-tablerow");
        _viewProfile.forEach(function(x, i){
            // CODE
            _elem = _renderFilterCell(_left, _cds[x], i);
            _elem.__fltrow = _filterrow;
            _elem.__cd = _cds[x];
            _filterrow.appendChild(_elem);
            _left += _cds[x].getWidth();
        });
        _filterrow.style.height = _hh+"px";
        _filterrow.style.top = _hh+"px";
        _elem = document.createElement("div");
        _elem.__fltrow = _filterrow;
        js.addClass(_elem, "page-tablerow");
        _elem.style.left = _left+"px";
        _elem.style.width = "18px";
        _elem.style.borderWidth = "0";
        _filterrow.appendChild(_elem);
        //-- add listeners
        return _filterrow;
    };
    //--
    var _renderFilterCell = /*HTMLElement*/ function (/*int*/ left_, /*ColumnDescriptor*/ cd_, /*int*/ colIdx_) {
        // VARS
        var _fltcell, _wrap1, _wrap2, _wrap3, _content, _elem;
        // CODE
        _fltcell = document.createElement("div");
        _wrap1 = document.createElement("div"); _wrap1.__fltcell = _fltcell;
        _wrap2 = document.createElement("div"); _wrap2.__fltcell = _fltcell;
        _wrap3 = document.createElement("div"); _wrap3.__fltcell = _fltcell;
        _content = document.createElement("div"); _content.__fltcell = _fltcell;
        js.addClass(_fltcell, "page-tableheadercell");
        js.addClass(_wrap1, "page-tablecellwrap1");
        js.addClass(_wrap2, "page-tablecellwrap2");
        js.addClass(_wrap3, "page-tablecellwrap3");
        js.addClass(_content, "page-tablecellcontent");
        _fltcell.style.left = left_+"px";
        _fltcell.style.width = cd_.getWidth()+"px";
        if (colIdx_===0){
            _fltcell.style.borderWidth = "0";
        } //-- end if
        if (cd_.isFilterable()){
            _elem = document.createElement("input");
            _elem.style.width = cd_.getWidth()-22+"px";
            _elem.addEventListener("keyup", function(){
                // CODE
                if (_rebuild_timer){
                    clearTimeout(_rebuild_timer);
                } //-- end if
                _rebuild_timer = setTimeout(_self.rebuild, 1000);
            });
            _content.appendChild(_elem);
            _filters.push(function(/*grid row*/x){
//js.log(">>> row:", x, "; column:["+colIdx_+"]; value:["+x[colIdx_]+"]; filter:["+_elem.value+"]");                
                return !_filtersEnabled || 
                       !_elem.value || 
                       (x[colIdx_]+"").toUpperCase().indexOf((_elem.value+"").toUpperCase())>=0;
            });
        } //-- end if
        _wrap3.appendChild(_content);
        _wrap2.appendChild(_wrap3);
        _wrap1.appendChild(_wrap2);
        _fltcell.appendChild(_wrap1);
        return _fltcell;
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
        _sortProfile.some(function (x){ /*{cd, elem}*/
            // VAR
            var _cd = x.cd;
            var _idx = _cds.indexOf(_cd) ;
            // CODE
            _rv = _cd.sort(_cd.getValue(row1_, _idx), _cd.getValue(row2_, _idx));

//js.log(">>> cd index:", _idx, "; row1:", row1_, "; row2:", row2_, "; cd:", x);
//js.log(">>>    val1:", x.getValue(row1_, _idx), "; val2:", x.getValue(row2_, _idx), "; rv:", _rv, "; order:", x.isSortOrderAsc());
            _rv = (_rv===0 || _cd.isSortOrderAsc())?_rv:(-_rv);
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
//js.log(">>> filters on rebuild:", _filters);
        _viewGrid = _model.getGrid().filter(function(x){return _filters.every(function(y){return y(x);});})
                                    .sort(function (x, y){return _sortByRowId(x, y);})
                                    .sort(function (x, y){return _sortRow(x, y);});
        _item = _renderTable();
        if (_item){
//            _height = _root.style.height;
            _table.children.some(function(x, i){
                // CODE
                if (js.hasClass(x, "page-tablebody")){
                    _table.removeChild(x);
                    return true;
                } //-- end if
                return false;
            });
            _body = _item;
            _table.appendChild(_body);
            if (_getHeight){
                _height = _getHeight();
                _root.style.height = _height + "px";
                _body.style.height = (_height-_hh-(_filtersEnabled?_hh:0))+"px";
            }else{
                _body.style.height = (_root.offsetHeight-_hh)+"px";
            } //-- end if
            _body.scrollTop = (_oldVerticalScroll<_body.scrollTopMax?_oldVerticalScroll:_body.scrollTopMax);
        }else{
            js.logErr("Failed to render table.");
            throw new Error("Failed to render table.");
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
    //-- table
    _table = document.createElement("div");
    js.addClass(_table, "page-table");
    _table.style.width = _cds.reduce(function(x, y){return x+y.getWidth();}, 19) + "px";
    //-- add listeners
    _lstnrs_table.forEach(function(x){_table.addEventListener(x.event, x.func);});
    //-- header
    _header = _renderHeaderRow();
    _header.__table = _table;
    _table.appendChild(_header);
    //-- filters
    _fltrow = _renderFilterRow();
    _fltrow.__table = _table;
    _fltrow.style.display = _filtersEnabled?"block":"none";
//js.log(">>> filters on create:", _filters);
//_filters.forEach(function(x, i){js.log(">>>   (#"+i+"): ", _filters[i].toString());});

    //--
    _table.appendChild(_fltrow);
    _root.appendChild(_table);
    //--
    if (_getHeight){
        window.addEventListener("resize", function (e_) {_self.rebuild();});
    } //-- end if
});});
