import { LightningElement } from 'lwc';

export default class ReusableParent extends LightningElement {
    rowActions = [
        { label: 'View', name: 'view' },
        { label: 'Delete', name: 'delete' }
    ];
}