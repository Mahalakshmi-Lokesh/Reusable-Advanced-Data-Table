import { LightningElement, api, track, wire } from 'lwc';
import getRecords from '@salesforce/apex/DataTableController.getRecords';
import getCSV from '@salesforce/apex/DataTableController.getCSV';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ReusableDataTable extends LightningElement {

    @api objectApiName;
    @api fieldList;
    @api pageSize = 5;
    @api rowActions;

    @track data = [];
    @track columns = [];

    pageNumber = 1;
    totalRecords = 0;

    searchKey = '';
    columnFilters = {};

    sortedBy = 'Name';
    sortedDirection = 'asc';

    draftValues = [];
    wiredResult;
    isLoading = true;
    error;

    connectedCallback() {
        this.columns = this.fieldList.split(',').map(f => ({
            label: f.trim(),
            fieldName: f.trim(),
            sortable: true,
            editable: true
        }));

        if (this.rowActions) {
            this.columns.push({
                type: 'action',
                typeAttributes: { rowActions: this.rowActions }
            });
        }
    }

    get columnFiltersString() {
        return JSON.stringify(this.columnFilters);
    }

    @wire(getRecords, {
        objectName: '$objectApiName',
        fields: '$fieldList',
        pageSize: '$pageSize',
        pageNumber: '$pageNumber',
        searchKey: '$searchKey',
        sortBy: '$sortedBy',
        sortDirection: '$sortedDirection',
        columnFiltersJson: '$columnFiltersString'
    })
    wiredData(result) {
        this.wiredResult = result;

        const { data, error } = result;

        if (data) {
            this.data = data.records;
            this.totalRecords = data.totalCount;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = [];
        }

        this.isLoading = false;
    }

    handleSearch(event) {
        this.searchKey = event.target.value;
        this.pageNumber = 1;
    }

    handleColumnFilter(event) {
        const field = event.target.dataset.field;
        const value = event.target.value;

        this.columnFilters = { ...this.columnFilters, [field]: value };
        this.pageNumber = 1;
    }

    handleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
    }

    nextPage() {
        if (this.pageNumber < this.totalPages) {
            this.pageNumber++;
        }
    }

    prevPage() {
        if (this.pageNumber > 1) {
            this.pageNumber--;
        }
    }

    handleRefresh() {
        this.pageNumber = 1;
        this.searchKey = '';
        this.columnFilters = {};
        refreshApex(this.wiredResult);
    }

    handleSave(event) {
        const records = event.detail.draftValues.map(d => ({ fields: d }));

        Promise.all(records.map(r => updateRecord(r)))
            .then(() => {
                this.showToast('Success', 'Records updated', 'success');
                this.draftValues = [];
                return refreshApex(this.wiredResult);
            })
            .catch(() => {
                this.showToast('Error', 'Update failed', 'error');
            });
    }

    handleRowAction(event) {
        this.dispatchEvent(
            new CustomEvent('rowaction', { detail: event.detail })
        );
    }

    handleExport() {
        getCSV({ objectName: this.objectApiName, fields: this.fieldList })
            .then(csv => {
                const a = document.createElement('a');
                a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                a.download = `${this.objectApiName}.csv`;
                a.click();
            });
    }

    get totalPages() {
        return Math.ceil(this.totalRecords / this.pageSize);
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    get cardTitle() {
        return `${this.objectApiName} Records`;
    }
}