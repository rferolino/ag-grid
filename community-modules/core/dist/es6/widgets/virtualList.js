/**
 * @ag-grid-community/core - Advanced Data Grid / Data Table supporting Javascript / React / AngularJS / Web Components
 * @version v23.2.1
 * @link http://www.ag-grid.com/
 * @license MIT
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Autowired } from '../context/context';
import { RefSelector } from './componentAnnotations';
import { ManagedFocusComponent } from './managedFocusComponent';
import { Constants } from '../constants';
import { _ } from '../utils';
var VirtualList = /** @class */ (function (_super) {
    __extends(VirtualList, _super);
    function VirtualList(cssIdentifier) {
        if (cssIdentifier === void 0) { cssIdentifier = 'default'; }
        var _this = _super.call(this, VirtualList.getTemplate(cssIdentifier)) || this;
        _this.cssIdentifier = cssIdentifier;
        _this.renderedRows = new Map();
        _this.rowHeight = 20;
        return _this;
    }
    VirtualList.prototype.postConstruct = function () {
        this.addScrollListener();
        this.rowHeight = this.getItemHeight();
        _super.prototype.postConstruct.call(this);
    };
    VirtualList.prototype.isFocusableContainer = function () {
        return true;
    };
    VirtualList.prototype.focusInnerElement = function (fromBottom) {
        var rowCount = this.model.getRowCount();
        this.focusRow(fromBottom ? rowCount - 1 : 0);
    };
    VirtualList.prototype.onFocusIn = function (e) {
        _super.prototype.onFocusIn.call(this, e);
        var target = e.target;
        if (_.containsClass(target, 'ag-virtual-list-item')) {
            this.lastFocusedRow = parseInt(target.getAttribute('aria-rowindex'), 10) - 1;
        }
    };
    VirtualList.prototype.onFocusOut = function (e) {
        _super.prototype.onFocusOut.call(this, e);
        if (!this.getFocusableElement().contains(e.relatedTarget)) {
            this.lastFocusedRow = null;
        }
    };
    VirtualList.prototype.handleKeyDown = function (e) {
        switch (e.keyCode) {
            case Constants.KEY_UP:
            case Constants.KEY_DOWN:
            case Constants.KEY_TAB:
                if (this.navigate(e.keyCode === Constants.KEY_UP ||
                    (e.keyCode === Constants.KEY_TAB && e.shiftKey))) {
                    e.preventDefault();
                }
                break;
        }
    };
    VirtualList.prototype.navigate = function (up) {
        if (!_.exists(this.lastFocusedRow)) {
            return false;
        }
        var nextRow = this.lastFocusedRow + (up ? -1 : 1);
        if (nextRow < 0 || nextRow >= this.model.getRowCount()) {
            return false;
        }
        this.focusRow(nextRow);
        return true;
    };
    VirtualList.prototype.getLastFocusedRow = function () {
        return this.lastFocusedRow;
    };
    VirtualList.prototype.focusRow = function (rowNumber) {
        var _this = this;
        this.ensureIndexVisible(rowNumber);
        window.setTimeout(function () {
            var renderedRow = _this.renderedRows.get(rowNumber);
            if (renderedRow) {
                renderedRow.eDiv.focus();
            }
        }, 10);
    };
    VirtualList.prototype.getComponentAt = function (rowIndex) {
        var comp = this.renderedRows.get(rowIndex);
        return comp && comp.rowComponent;
    };
    VirtualList.getTemplate = function (cssIdentifier) {
        return /* html */ "\n            <div class=\"ag-virtual-list-viewport ag-" + cssIdentifier + "-virtual-list-viewport\">\n                <div class=\"ag-virtual-list-container ag-" + cssIdentifier + "-virtual-list-container\" ref=\"eContainer\"></div>\n            </div>";
    };
    VirtualList.prototype.getItemHeight = function () {
        return this.gridOptionsWrapper.getListItemHeight();
    };
    VirtualList.prototype.ensureIndexVisible = function (index) {
        var lastRow = this.model.getRowCount();
        if (typeof index !== 'number' || index < 0 || index >= lastRow) {
            console.warn('invalid row index for ensureIndexVisible: ' + index);
            return;
        }
        var rowTopPixel = index * this.rowHeight;
        var rowBottomPixel = rowTopPixel + this.rowHeight;
        var eGui = this.getGui();
        var viewportTopPixel = eGui.scrollTop;
        var viewportHeight = eGui.offsetHeight;
        var viewportBottomPixel = viewportTopPixel + viewportHeight;
        var viewportScrolledPastRow = viewportTopPixel > rowTopPixel;
        var viewportScrolledBeforeRow = viewportBottomPixel < rowBottomPixel;
        if (viewportScrolledPastRow) {
            // if row is before, scroll up with row at top
            eGui.scrollTop = rowTopPixel;
        }
        else if (viewportScrolledBeforeRow) {
            // if row is below, scroll down with row at bottom
            var newScrollPosition = rowBottomPixel - viewportHeight;
            eGui.scrollTop = newScrollPosition;
        }
    };
    VirtualList.prototype.setComponentCreator = function (componentCreator) {
        this.componentCreator = componentCreator;
    };
    VirtualList.prototype.getRowHeight = function () {
        return this.rowHeight;
    };
    VirtualList.prototype.getScrollTop = function () {
        return this.getGui().scrollTop;
    };
    VirtualList.prototype.setRowHeight = function (rowHeight) {
        this.rowHeight = rowHeight;
        this.refresh();
    };
    VirtualList.prototype.refresh = function () {
        var _this = this;
        if (this.model == null) {
            return;
        }
        var rowCount = this.model.getRowCount();
        this.eContainer.style.height = rowCount * this.rowHeight + "px";
        this.eContainer.setAttribute('aria-rowcount', rowCount.toString());
        // ensure height is applied before attempting to redraw rows
        setTimeout(function () {
            _this.clearVirtualRows();
            _this.drawVirtualRows();
        }, 0);
    };
    VirtualList.prototype.clearVirtualRows = function () {
        var _this = this;
        this.renderedRows.forEach(function (_, rowIndex) { return _this.removeRow(rowIndex); });
    };
    VirtualList.prototype.drawVirtualRows = function () {
        var gui = this.getGui();
        var topPixel = gui.scrollTop;
        var bottomPixel = topPixel + gui.offsetHeight;
        var firstRow = Math.floor(topPixel / this.rowHeight);
        var lastRow = Math.floor(bottomPixel / this.rowHeight);
        this.ensureRowsRendered(firstRow, lastRow);
    };
    VirtualList.prototype.ensureRowsRendered = function (start, finish) {
        var _this = this;
        // remove any rows that are no longer required
        this.renderedRows.forEach(function (_, rowIndex) {
            if ((rowIndex < start || rowIndex > finish) && rowIndex !== _this.lastFocusedRow) {
                _this.removeRow(rowIndex);
            }
        });
        // insert any required new rows
        for (var rowIndex = start; rowIndex <= finish; rowIndex++) {
            if (this.renderedRows.has(rowIndex)) {
                continue;
            }
            // check this row actually exists (in case overflow buffer window exceeds real data)
            if (rowIndex < this.model.getRowCount()) {
                var value = this.model.getRow(rowIndex);
                this.insertRow(value, rowIndex);
            }
        }
    };
    VirtualList.prototype.insertRow = function (value, rowIndex) {
        var eDiv = document.createElement('div');
        _.addCssClass(eDiv, 'ag-virtual-list-item');
        _.addCssClass(eDiv, "ag-" + this.cssIdentifier + "-virtual-list-item");
        eDiv.setAttribute('aria-rowindex', (rowIndex + 1).toString());
        eDiv.setAttribute('tabindex', '-1');
        eDiv.style.height = this.rowHeight + "px";
        eDiv.style.top = this.rowHeight * rowIndex + "px";
        var rowComponent = this.componentCreator(value);
        eDiv.appendChild(rowComponent.getGui());
        this.eContainer.appendChild(eDiv);
        this.renderedRows.set(rowIndex, { rowComponent: rowComponent, eDiv: eDiv });
    };
    VirtualList.prototype.removeRow = function (rowIndex) {
        var component = this.renderedRows.get(rowIndex);
        this.eContainer.removeChild(component.eDiv);
        this.destroyBean(component.rowComponent);
        this.renderedRows.delete(rowIndex);
    };
    VirtualList.prototype.addScrollListener = function () {
        var _this = this;
        this.addGuiEventListener('scroll', function () { return _this.drawVirtualRows(); });
    };
    VirtualList.prototype.setModel = function (model) {
        this.model = model;
    };
    __decorate([
        Autowired('gridOptionsWrapper')
    ], VirtualList.prototype, "gridOptionsWrapper", void 0);
    __decorate([
        RefSelector('eContainer')
    ], VirtualList.prototype, "eContainer", void 0);
    return VirtualList;
}(ManagedFocusComponent));
export { VirtualList };
