import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

function DeleteOrderModal (props: { children?:any
    deleteOrderModal: boolean | undefined, 
    deleteOrderToggle: ( (event: React.MouseEvent<any, MouseEvent>) => void),
    deleteOrder: () => void}) {
    return(            
    <Modal isOpen={props.deleteOrderModal} 
        toggle={props.deleteOrderToggle}>
        <ModalHeader toggle={props.deleteOrderToggle}>Delete Selected Orders</ModalHeader>
        <ModalBody>
            This will delete all selected orders. Are you sure?
        </ModalBody>
        <ModalFooter>
        <Button color="danger" onClick={() => props.deleteOrder()}><b>DELETE</b></Button>
        <Button color="secondary" onClick={props.deleteOrderToggle}><b>CANCEL</b></Button>
        </ModalFooter>
    </Modal>);
}

export default DeleteOrderModal;