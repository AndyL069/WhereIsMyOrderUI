import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Hero from './Hero';

interface order {
    id: number,
    company: string,
    title: string,
    arrival: Date,
    link: string
}

const Home = () => {
    const {
        user,
        isAuthenticated
    } = useAuth0();

    const [orders, setOrders] = useState<order[]>([]);

    useEffect(() => {
        fetch(`/api/GetOrdersForUser/${user.name}`)
            .then(res => res.json())
            .then(setOrders)
            .catch(console.error);
    }, [user.name]);

    const createOrder = async (newOrder: order) => {
        await fetch(`/api/CreateOrderForUser/${user.name}`, {
            method: 'POST',
            body: JSON.stringify({ newOrder }),
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => console.log(err));
    };

    const [newOrderModal, setNewOrderModal] = useState(false);
    const newOrderToggle = () => setNewOrderModal(!newOrderModal);
    const handleFormSubmit = async (event: any) => {
        event.preventDefault();
        const data = new FormData(event.target);
        let orderCompany = data.get('orderCompany')?.toString();
        let zipCode = data.get('zipCode')?.toString();
        let orderArrival = data.get('orderArrival')?.toString();
        let orderTitle = data.get('orderTitle')?.toString();
        let trackingNumber = data.get('trackingNumber')?.toString();
        let orderLink = `http://nolp.dhl.de/nextt-online-public/track.do?zip=${zipCode}&idc=${trackingNumber}&lang=de`;
        let newOrder : order = { id: 0, company: orderCompany ? orderCompany : "" , title: orderTitle ? orderTitle : "", arrival: orderArrival ? new Date(orderArrival) : new Date(), link: orderLink ? orderLink : ""};
        await createOrder(newOrder);
        window.location.reload(false);
    }

    const deleteOrder = async (orderId: number) => {
        await fetch(`/api/DeleteOrder/${orderId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => console.log(err));
        window.location.reload(false);
    }

    return (
        <Container>
            {!isAuthenticated && (<Hero></Hero>)}
            {isAuthenticated && (
                <>
                    <a className="btn btn-primary float-right" id="orderButton" onClick={newOrderToggle}><b><FontAwesomeIcon icon={faPlus} /> NEW ORDER</b></a>
                    <Modal isOpen={newOrderModal} toggle={newOrderToggle}>
                        <Form onSubmit={handleFormSubmit}>
                            <ModalHeader toggle={newOrderToggle}>Create New Order</ModalHeader>
                            <ModalBody>
                                <FormGroup>
                                    <Label for="orderTitle">Title</Label>
                                    <Input name="orderTitle" id="orderTitle" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="orderArrival">Arrival</Label>
                                    <Input type="date" name="orderArrival" id="orderArrival" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="orderCompany">Shipping Company</Label>
                                    <Input
                                        type="select"
                                        name="orderCompany"
                                        id="orderCompanySelectMulti"
                                        multiple>
                                        <option>DHL</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="zipCode">Zip Code</Label>
                                    <Input name="zipCode" id="zipCode" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="trackingNumber">Tracking number</Label>
                                    <Input name="trackingNumber" id="trackingNumber" />
                                </FormGroup>
                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" color="primary" onClick={newOrderToggle}><b>SAVE</b></Button>
                                <Button color="secondary" onClick={newOrderToggle}><b>CANCEL</b></Button>
                            </ModalFooter>
                        </Form>
                    </Modal>
                    <Table responsive striped className="text-center mt-md-3">
                        <thead>
                            <tr>
                                <th scope="col">Description</th>
                                <th scope="col">Estimated Arrival</th>
                                <th scope="col">Tracking link</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders.map((order: order, index) => (
                                <tr key={index}>
                                    <td>
                                        <p>{order.title} ({order.company})</p>
                                    </td>
                                    <td>
                                        <p>{new Date(order.arrival).toLocaleDateString()}</p>
                                    </td>
                                    <td><a className="btn btn-secondary" href={order.link} target="_blank"><b>SHOW DETAILS</b></a></td>
                                    <td><Button color="danger" onClick={() => deleteOrder(order.id)} ><b><FontAwesomeIcon icon={faTrashAlt}/></b></Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </Container>
    );
}

export default Home;