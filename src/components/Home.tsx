import React, { useState, useEffect } from 'react';
import { Button, Container } from 'reactstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import moment from 'moment';
import UpdateOrderModal from './UpdateOrderModal';
import DeleteSelectedOrdersModal from './DeleteSelectedOrdersModal';
import DeleteOrderModal from './DeleteOrderModal';
import NewOrderModal from './NewOrderModal';
import OrderTable from './OrderTable';
import { faPlus, faTrashAlt, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ActionBar from './ActionBar';

export interface Order {
    id: number,
    company: string,
    title: string,
    arrival: Date,
    link: string,
    status: string,
    userId: string,
    zipCode: string,
    trackingNumber: string
}

let toast: Toast | null;
let baseUrl: string;

if (process.env.NODE_ENV === 'development') {
    baseUrl = ''
}

if (process.env.NODE_ENV === 'production') {
    baseUrl = 'https://whereismyorderapi.azurewebsites.net'
}

const Home = () => {
    const {
        user,
        getAccessTokenSilently
    } = useAuth0();

    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);

    useEffect(() => {
        async function getUsers() {
            const token = await getAccessTokenSilently();
            await fetch(`${baseUrl}/api/GetOrdersForUser?userId=${user.name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(setOrders)
                .then(() => setOrdersLoading(false))
                .catch(console.error);
        }
        getUsers();
    }, [user.name]);

    const [shippingCompany, setShippingCompany] = useState<string>("DHL");
    const [shippingStatus, setShippingStatus] = useState<string>("SHIPPING");
    const [orderTitle, setOrderTitle] = useState<string>("");
    const [orderZipCode, setOrderZipCode] = useState<string>("");
    const [orderTrackingNumber, setOrderTrackingNumber] = useState<string>("");
    const [orderArrivalDate, setOrderArrivalDate] = useState<string>("");
    const [orderId, setOrderId] = useState<number>(0);

    const getOrders = async () => {
        const token = await getAccessTokenSilently();
        await fetch(`${baseUrl}/api/GetOrdersForUser?userId=${user.name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(setOrders)
            .catch(console.error);
        setShippingCompany("DHL");
        setShippingStatus("OPEN");
        setOrderTitle("");
        setOrderZipCode("");
        setOrderTrackingNumber("");
        setOrderArrivalDate("");
        setOrderId(0);
    };

    //////////////////////////////// Requests
    const createOrderRequest = async (newOrder: Order) => {
        const token = await getAccessTokenSilently();
        await fetch(`${baseUrl}/api/CreateOrder`, {
            method: 'POST',
            body: JSON.stringify({ newOrder }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.status === 200 ? toast?.show({ severity: 'success', summary: 'Successful', detail: 'Order Created', life: 3000 }) :
            toast?.show({ severity: 'error', summary: 'Error', detail: 'Create failed', life: 3000 }))
            .catch(err => console.log(err));
    };

    const updateOrderRequest = async (newOrder: Order) => {
        const token = await getAccessTokenSilently();
        await fetch(`${baseUrl}/api/UpdateOrder`, {
            method: 'PUT',
            body: JSON.stringify({ newOrder }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.status === 200 ? toast?.show({ severity: 'success', summary: 'Successful', detail: 'Order Updated', life: 3000 }) :
            toast?.show({ severity: 'error', summary: 'Error', detail: 'Update failed', life: 3000 }))
            .catch(err => console.log(err));
    };

    const deleteOrderRequest = async (id: number) => {
        const token = await getAccessTokenSilently();
        await fetch(`${baseUrl}/api/DeleteOrder?orderId=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.status === 200 ? toast?.show({ severity: 'success', summary: 'Successful', detail: 'Order Deleted', life: 3000 }) :
            toast?.show({ severity: 'error', summary: 'Error', detail: 'Delete failed', life: 3000 }))
            .catch(err => console.log(err));
    };

    const deleteOrdersRequest = async (ids: string) => {
        const token = await getAccessTokenSilently();
        let orderCount = selectedOrders.length;
        await fetch(`${baseUrl}/api/DeleteOrders?orderIds=${ids}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.status === 200 ? toast?.show({ severity: 'success', summary: 'Successful', detail: `${orderCount} Order(s) Deleted`, life: 3000 }) :
            toast?.show({ severity: 'error', summary: 'Error', detail: 'Delete failed', life: 3000 }))
            .catch(err => console.log(err));
    };

    const deleteOrder = async () => {
        deleteOrderToggle();
        var response = await deleteOrderRequest(orderId);
        await getOrders();
        return (response);
    };

    const deleteSelectedOrders = async () => {
        deleteSelectedOrdersToggle();
        let filteredOrders = orders.filter(val => !selectedOrders.includes(val));
        setOrders(filteredOrders);
        deleteOrdersRequest(selectedOrders.map(item => { return item.id }).toString());
    }

    const [deleteOrderModal, setDeleteOrderModal] = useState(false);
    const deleteOrderToggle = () => {
        setDeleteOrderModal(!deleteOrderModal);
    }

    const [deleteSelectedOrdersModal, setDeleteSelectedOrdersModal] = useState(false);
    const deleteSelectedOrdersToggle = () => {
        setDeleteSelectedOrdersModal(!deleteSelectedOrdersModal);
    }

    const confirmDeleteSingleProduct = (orderId: number) => {
        setOrderId(orderId);
        deleteOrderToggle();
    }

    const confirmDeleteSelectedProducts = () => {
        deleteSelectedOrdersToggle();
    }

    const [newOrderModal, setNewOrderModal] = useState(false);
    const newOrderToggle = () => setNewOrderModal(!newOrderModal);
    const [updateOrderModal, setUpdateOrderModal] = useState(false);
    const updateOrderToggle = () => setUpdateOrderModal(!updateOrderModal);

    const handleCreateSubmit = async (event: any) => {
        event.preventDefault();
        let orderLink = "";
        switch (shippingCompany) {
            case "DHL": orderLink = `http://nolp.dhl.de/nextt-online-public/track.do?zip=${orderZipCode}&idc=${orderTrackingNumber}&lang=de`;
                break;

            case "Hermes": orderLink = `https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation/?wt_cc1=sendungsnummer&wt_mc=re_pa1#${orderTrackingNumber}`;
                break;

            case "DPD": orderLink = `https://tracking.dpd.de/parcelstatus?query=${orderTrackingNumber}&locale=de_DE`;
                break;

            case "GLS": orderLink = `https://gls-group.eu/DE/de/paketverfolgung?match=${orderTrackingNumber}`;
                break;

            case "UPS": orderLink = `http://wwwapps.ups.com/ietracking/tracking.cgi?tracknum=${orderTrackingNumber}&IATA=de&Lang=ger`;
                break;
        }

        let newOrder: Order = {
            id: 0,
            company: shippingCompany,
            title: orderTitle,
            status: shippingStatus,
            arrival: new Date(orderArrivalDate),
            link: orderLink,
            userId: user.name,
            zipCode: orderZipCode,
            trackingNumber: orderTrackingNumber
        };
        await createOrderRequest(newOrder);
        await getOrders();
    }

    const handleUpdateSubmit = async (event: any) => {
        event.preventDefault();
        let orderLink = "";
        switch (shippingCompany) {
            case "DHL": orderLink = `http://nolp.dhl.de/nextt-online-public/track.do?zip=${orderZipCode}&idc=${orderTrackingNumber}&lang=de`;
                break;

            case "Hermes": orderLink = `https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation/?wt_cc1=sendungsnummer&wt_mc=re_pa1#${orderTrackingNumber}`;
                break;

            case "DPD": orderLink = `https://tracking.dpd.de/parcelstatus?query=${orderTrackingNumber}&locale=de_DE`;
                break;

            case "GLS": orderLink = `https://gls-group.eu/DE/de/paketverfolgung?match=${orderTrackingNumber}`;
                break;

            case "UPS": orderLink = `http://wwwapps.ups.com/WebTracking/processInputRequest?sort_by=status&tracknums_displayed=1&TypeOfInquiryNumber=T&loc=de_DE&InquiryNumber1=${orderTrackingNumber}&track.x=0&track.y=0`;
                break;
        }

        let updatedOrder: Order = {
            id: orderId,
            company: shippingCompany,
            title: orderTitle,
            status: shippingStatus,
            arrival: new Date(orderArrivalDate),
            link: orderLink,
            userId: user.name,
            zipCode: orderZipCode,
            trackingNumber: orderTrackingNumber
        };

        await updateOrderRequest(updatedOrder);
        await getOrders();
    }

    const toggleUpdateOrder = (rowData: Order) => {
        setShippingCompany(rowData.company);
        setShippingStatus(rowData.status);
        setOrderTitle(rowData.title);
        setOrderZipCode(rowData.zipCode);
        setOrderTrackingNumber(rowData.trackingNumber);
        setOrderId(rowData.id);
        let dateString = moment(new Date(rowData.arrival)).format('YYYY-MM-DD');
        setOrderArrivalDate(dateString);
        updateOrderToggle();
    };

    const actionsTemplate = (rowData: Order) => {
        return (
            <>
                <Button className="rounded-circle" color="warning" onClick={() => toggleUpdateOrder(rowData)}><b><FontAwesomeIcon icon={faPen} /></b></Button>
                <Button className="rounded-circle ml-1" color="danger" onClick={() => confirmDeleteSingleProduct(rowData.id)} ><b><FontAwesomeIcon icon={faTrashAlt} /></b></Button>
            </>
        );
    }

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button color="primary" onClick={newOrderToggle}><b><FontAwesomeIcon icon={faPlus} /> NEW</b></Button>
                <Button color="danger" className="ml-1" disabled={!selectedOrders || !selectedOrders.length} onClick={() => confirmDeleteSelectedProducts()}><b><FontAwesomeIcon icon={faTrashAlt} /> DELETE</b></Button>
            </>
        )
    }

    return (
        <>
            <NewOrderModal newOrderModal={newOrderModal}
                handleFormSubmit={handleCreateSubmit}
                newOrderToggle={newOrderToggle}
                orderTitle={orderTitle}
                setOrderTitle={setOrderTitle}
                orderArrivalDate={orderArrivalDate}
                setOrderArrivalDate={setOrderArrivalDate}
                shippingCompany={shippingCompany}
                setShippingCompany={setShippingCompany}
                orderZipCode={orderZipCode}
                setOrderZipCode={setOrderZipCode}
                orderTrackingNumber={orderTrackingNumber}
                setOrderTrackingNumber={setOrderTrackingNumber}>
            </NewOrderModal>
            <UpdateOrderModal updateOrderModal={updateOrderModal}
                handleUpdateSubmit={handleUpdateSubmit}
                updateOrderToggle={updateOrderToggle}
                orderTitle={orderTitle}
                setOrderTitle={setOrderTitle}
                orderArrivalDate={orderArrivalDate}
                setOrderArrivalDate={setOrderArrivalDate}
                shippingCompany={shippingCompany}
                setShippingCompany={setShippingCompany}
                orderZipCode={orderZipCode}
                setOrderZipCode={setOrderZipCode}
                orderTrackingNumber={orderTrackingNumber}
                setOrderTrackingNumber={setOrderTrackingNumber}
                shippingStatus={shippingStatus}
                setShippingStatus={setShippingStatus}
            ></UpdateOrderModal>
            <DeleteSelectedOrdersModal
                deleteSelectedOrdersModal={deleteSelectedOrdersModal}
                deleteSelectedOrdersToggle={deleteSelectedOrdersToggle}
                deleteSelectedOrders={deleteSelectedOrders}>
            </DeleteSelectedOrdersModal>
            <DeleteOrderModal deleteOrderModal={deleteOrderModal}
                deleteOrderToggle={deleteOrderToggle}
                deleteOrder={deleteOrder}>
            </DeleteOrderModal>
            <Toast ref={(el) => toast = el} />
            <Container>
                <>
                    <ActionBar leftToolbarTemplate={leftToolbarTemplate}>
                    </ActionBar>
                    <OrderTable ordersLoading={ordersLoading}
                        orders={orders}
                        selectedOrders={selectedOrders}
                        setSelectedOrders={setSelectedOrders}
                        actionsTemplate={actionsTemplate}>
                    </OrderTable>
                </>
            </Container>
        </>
    );
}

export default Home;