// Type definitions for ag-grid v4.2.1
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ceolter/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
import { ColumnGroupChild } from "./columnGroupChild";
import { OriginalColumnGroupChild } from "./originalColumnGroupChild";
import { ColDef, AbstractColDef, IAggFunction } from "./colDef";
import { RowNode } from "./rowNode";
export declare class Column implements ColumnGroupChild, OriginalColumnGroupChild {
    static EVENT_MOVING_CHANGED: string;
    static EVENT_LEFT_CHANGED: string;
    static EVENT_WIDTH_CHANGED: string;
    static EVENT_LAST_LEFT_PINNED_CHANGED: string;
    static EVENT_FIRST_RIGHT_PINNED_CHANGED: string;
    static EVENT_VISIBLE_CHANGED: string;
    static EVENT_FILTER_ACTIVE_CHANGED: string;
    static EVENT_SORT_CHANGED: string;
    static PINNED_RIGHT: string;
    static PINNED_LEFT: string;
    static AGG_SUM: string;
    static AGG_MIN: string;
    static AGG_MAX: string;
    static AGG_FIRST: string;
    static AGG_LAST: string;
    static SORT_ASC: string;
    static SORT_DESC: string;
    private gridOptionsWrapper;
    private columnUtils;
    private colDef;
    private colId;
    private actualWidth;
    private visible;
    private pinned;
    private left;
    private aggFunc;
    private sort;
    private sortedAt;
    private moving;
    private lastLeftPinned;
    private firstRightPinned;
    private minWidth;
    private maxWidth;
    private filterActive;
    private eventService;
    constructor(colDef: ColDef, colId: String);
    initialise(): void;
    private validate();
    addEventListener(eventType: string, listener: Function): void;
    removeEventListener(eventType: string, listener: Function): void;
    isCellEditable(rowNode: RowNode): boolean;
    setMoving(moving: boolean): void;
    isMoving(): boolean;
    getSort(): string;
    setSort(sort: string): void;
    isSortAscending(): boolean;
    isSortDescending(): boolean;
    isSortNone(): boolean;
    getSortedAt(): number;
    setSortedAt(sortedAt: number): void;
    setAggFunc(aggFunc: string | IAggFunction): void;
    getAggFunc(): string | IAggFunction;
    getLeft(): number;
    getRight(): number;
    setLeft(left: number): void;
    isFilterActive(): boolean;
    setFilterActive(active: boolean): void;
    setPinned(pinned: string | boolean): void;
    setFirstRightPinned(firstRightPinned: boolean): void;
    setLastLeftPinned(lastLeftPinned: boolean): void;
    isFirstRightPinned(): boolean;
    isLastLeftPinned(): boolean;
    isPinned(): boolean;
    isPinnedLeft(): boolean;
    isPinnedRight(): boolean;
    getPinned(): string;
    setVisible(visible: boolean): void;
    isVisible(): boolean;
    getColDef(): ColDef;
    getColumnGroupShow(): string;
    getColId(): string;
    getId(): string;
    getDefinition(): AbstractColDef;
    getActualWidth(): number;
    setActualWidth(actualWidth: number): void;
    isGreaterThanMax(width: number): boolean;
    getMinWidth(): number;
    getMaxWidth(): number;
    setMinimum(): void;
}
