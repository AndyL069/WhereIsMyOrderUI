import React from "react";
import { Form, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Button } from "reactstrap";

function UpdateOrderModal(props: {updateOrderModal: boolean, 
    handleUpdateSubmit: ((event: React.FormEvent<HTMLFormElement>) => void) | undefined, 
    updateOrderToggle: ((event: React.MouseEvent<any, MouseEvent>) => void) | undefined,
    orderTitle: string,
    setOrderTitle: Function,
    orderArrivalDate: string,
    setOrderArrivalDate: Function,
    shippingCompany: string,
    setShippingCompany: Function,
    orderZipCode: string,
    setOrderZipCode: Function,
    orderTrackingNumber: string,
    setOrderTrackingNumber: Function,
    shippingStatus: string,
    setShippingStatus: Function})  {
 
 return (<Modal isOpen={props.updateOrderModal} toggle={props.updateOrderToggle}>
<Form onSubmit={props.handleUpdateSubmit}>
    <ModalHeader toggle={props.updateOrderToggle}>Update Order</ModalHeader>
    <ModalBody>
        <FormGroup>
            <Label for="orderTitle">Title</Label>
            <Input name="orderTitle" id="orderTitle" value={props.orderTitle} onChange={(event) => props.setOrderTitle(event.currentTarget.value)}/>
        </FormGroup>
        <FormGroup>
            <Label for="orderArrival">Arrival</Label>
            <Input type="date" name="orderArrival" id="orderArrival" value={props.orderArrivalDate} onChange={(event) => props.setOrderArrivalDate(event.currentTarget.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="orderCompany">Shipping Company</Label>
            <Input
                type="select"
                name="orderCompany"
                id="orderCompanySelect"
                value={props.shippingCompany}
                onChange={(event) => props.setShippingCompany(event.currentTarget.value)}>
                <option>DHL</option>
                <option>Hermes</option>
                <option>DPD</option>
                <option>GLS</option>
                <option>UPS</option>
            </Input>
        </FormGroup>
        <FormGroup>
            <Label for="zipCode">Zip Code</Label>
            <Input name="zipCode" id="zipCode" value={props.orderZipCode} onChange={(event) => props.setOrderZipCode(event.currentTarget.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="trackingNumber">Tracking number</Label>
            <Input name="trackingNumber" id="trackingNumber" value={props.orderTrackingNumber} onChange={(event) => props.setOrderTrackingNumber(event.currentTarget.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="status">Status</Label>
            <Input type="select"
                name="status"
                id="orderTrackingNumberSelect"
                value={props.shippingStatus}
                onChange={(event) => props.setShippingStatus(event.currentTarget.value)}>
                <option>OPEN</option>
                <option>SHIPPING</option>
                <option>SHIPPED</option>
            </Input>
        </FormGroup>
    </ModalBody>
    <ModalFooter>
        <Button type="submit" color="primary" onClick={props.updateOrderToggle}><b>SAVE</b></Button>
        <Button color="secondary" onClick={props.updateOrderToggle}><b>CANCEL</b></Button>
    </ModalFooter>
</Form>
</Modal>
 )};

 export default UpdateOrderModal;