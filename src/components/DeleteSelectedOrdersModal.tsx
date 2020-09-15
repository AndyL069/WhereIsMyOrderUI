import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

function DeleteSelectedOrdersModal (props: { children?:any,
    deleteSelectedOrdersModal: boolean | undefined, 
    deleteSelectedOrdersToggle: ( (event: React.MouseEvent<any, MouseEvent>) => void),
    deleteSelectedOrders: () => void}) {
    return(            
    <Modal isOpen={props.deleteSelectedOrdersModal} 
        toggle={props.deleteSelectedOrdersToggle}>
        <ModalHeader toggle={props.deleteSelectedOrdersToggle}>Delete Selected Orders</ModalHeader>
        <ModalBody>
            This will delete all selected orders. Are you sure?
        </ModalBody>
        <ModalFooter>
        <Button color="danger" onClick={() => props.deleteSelectedOrders()}><b>DELETE</b></Button>
        <Button color="secondary" onClick={props.deleteSelectedOrdersToggle}><b>CANCEL</b></Button>
        </ModalFooter>
    </Modal>);
}

export default DeleteSelectedOrdersModal;