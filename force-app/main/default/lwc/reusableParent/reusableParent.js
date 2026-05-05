import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ReusableParent extends NavigationMixin(LightningElement) {

    rowActions = [
        { label: 'View', name: 'view' },
        { label: 'Delete', name: 'delete' }
    ];

    handleRowAction(event) {
        const action = event.detail.action?.name;
        const recordId = event.detail.row?.Id;

        if (!recordId) return;

        if (action === 'view') {
            this.navigateToRecord(recordId);
        } else if (action === 'delete') {
            this.deleteRecord(recordId);
        }
    }

    navigateToRecord(recordId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    }

    deleteRecord(recordId) {
        deleteRecord(recordId)
            .then(() => {
                this.showToast('Success', 'Record deleted', 'success');

                const table = this.template.querySelector('c-reusable-data-table');
                if (table && table.handleRefresh) {
                    table.handleRefresh();
                }
            })
            .catch((error) => {
                console.error(error);
                this.showToast('Error', 'Delete failed', 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }
}