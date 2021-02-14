import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckMoving } from '@fortawesome/free-solid-svg-icons';
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";
import { Badge, Label } from "reactstrap";
import dhlLogo from '../assets/dhllogo.png';
import hermesLogo from '../assets/hermeslogo.jpg';
import hermesSpedLogo from '../assets/hermes_spedition.png'
import glsLogo from '../assets/glslogo.jpg';
import upsLogo from '../assets/upslogo.png';
import dpdLogo from '../assets/dpdlogo.jpg';
import amazonLogo from '../assets/amazon.png';
import { Order } from "./Home";
import MyLoader from "./MyLoader";

const descriptionColumnTemplate = (rowData: Order) => {
    return (
        <Label>{rowData.title}</Label>
    );
}

const shippingCompanyTemplate = (rowData: Order) => {
    let companyLogo;
    switch (rowData.company) {
        case "DHL": companyLogo = dhlLogo;
            break;
        case "Hermes": companyLogo = hermesLogo;
            break;
        case "Hermes Spedition": companyLogo = hermesSpedLogo;
            break;
        case "DPD": companyLogo = dpdLogo;
            break;
        case "GLS": companyLogo = glsLogo;
            break;
        case "UPS": companyLogo = upsLogo;
            break;
        case "Amazon": companyLogo = amazonLogo;
            break;
    }
    return (
        <img src={companyLogo} alt={rowData.company} className="product-image" />
    );
}

const arrivalDateColumnTemplate = (rowData: Order) => {
    let arrivalDate = new Date(rowData.arrivalDate);
    return (
        <Label>{ arrivalDate.toLocaleDateString() === new Date().toLocaleDateString() ? <b>{arrivalDate.toLocaleDateString()}</b> : arrivalDate.toLocaleDateString()}</Label>
    );
}

const arrivalTimeColumnTemplate = (rowData: Order) => {
    let arrivalTime = new Date(rowData.arrivalTime);
    return (
        <Label>{ arrivalTime.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'}) === new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'}) ? <b>{arrivalTime.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'})}</b> : arrivalTime.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'})}</Label>
    );
}

const trackingLinkTemplate = (rowData: Order) => {
    return (
        <>
            <a className="btn btn-success" href={rowData.link} target="_blank" rel="noopener noreferrer"><b><FontAwesomeIcon icon={faTruckMoving} /> TRACK</b></a>
        </>
    );
}

const statusBodyTemplate = (rowData: Order) => {
    let badgeColor;
    switch (rowData.status) {
        case "SHIPPING": badgeColor = "primary";
            break;
        case "SHIPPED": badgeColor = "secondary";
            break;
        case "OPEN": badgeColor = "info";
            break;
    }

    return (<Badge color={badgeColor}>{rowData.status}</Badge>);
}


function OrderTable(props: {
    children?: any,
    ordersLoading: boolean,
    orders: Order[],
    selectedOrders: Order[],
    setSelectedOrders: Function,
    actionsTemplate: any
}) {
    const [globalFilter, setGlobalFilter] = useState<string>('');

    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Manage Orders</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" placeholder="Search..." onInput={(e: any) => setGlobalFilter(e.target.value)} />
            </span>
        </div>
    );

    return (
        <div className="datatable-responsive">
            {props.ordersLoading ? (<><MyLoader /><MyLoader /><MyLoader /></>) : (
                <DataTable
                    value={props.orders}
                    sortField="arrivalDate"
                    sortOrder={-1}
                    selection={props.selectedOrders}
                    onSelectionChange={(e) => props.setSelectedOrders(e.value)}
                    className="p-datatable-responsive"
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                    header={header}
                    globalFilter={globalFilter}>
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="title" header="Title" sortable body={descriptionColumnTemplate}></Column>
                    <Column field="company" header="Company" sortable body={shippingCompanyTemplate}></Column>
                    <Column field="arrivalDate" header="ArrivalDate" sortable body={arrivalDateColumnTemplate}></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
                    <Column field="link" header="Tracking Link" body={trackingLinkTemplate} ></Column>
                    <Column field="edit" body={props.actionsTemplate}></Column>
                    <Column field="arrivalTime" header="ArrivalTime" sortable body={arrivalTimeColumnTemplate}></Column>
                </DataTable>
            )
            }
        </div>);
};

export default OrderTable;