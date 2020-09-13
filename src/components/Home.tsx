import React, { useState, useEffect } from 'react';
import { Container, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Badge } from 'reactstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faFileExport, faPen, faTruckMoving } from '@fortawesome/free-solid-svg-icons';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import ContentLoader, { Facebook } from 'react-content-loader'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import moment from 'moment';
import Hero from './Hero';
import dhlLogo from '../dhllogo.png';
import hermesLogo from '../hermeslogo.jpg';
import glsLogo from '../glslogo.jpg';
import upsLogo from '../upslogo.png';
import dpdLogo from '../dpdlogo.jpg';

const MyLoader = (props: any) => (
    <ContentLoader 
    speed={2}
    width={1100}
    height={460}
    viewBox="0 0 1100 460"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <circle cx="31" cy="31" r="15" /> 
    <rect x="58" y="18" rx="2" ry="2" width="1100" height="10" /> 
    <rect x="58" y="34" rx="2" ry="2" width="1100" height="10" />
    <rect x="0" y="60" rx="2" ry="2" width="1100" height="400" />
  </ContentLoader>
  )

interface Order {
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

let dt: DataTable | null;
let baseUrl: string;

if(process.env.NODE_ENV === 'development') {
    baseUrl = ''
  }
  
  if(process.env.NODE_ENV === 'production') {
    baseUrl = 'https://whereismyorderapi.azurewebsites.net'
  }

const Home = () => {
    const {
        user,
        isAuthenticated
    } = useAuth0();

    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetch(`${baseUrl}/api/GetOrdersForUser?userId=${user.name}`)
        .then(res => res.json())
        // .then(setOrders)
        .catch(console.error);
    }, [user.name]);

    const [shippingCompany, setShippingCompany] = useState<string>("DHL");
    const [shippingStatus, setShippingStatus] = useState<string>("SHIPPING");
    const [orderTitle, setOrderTitle] = useState<string>("");
    const [orderZipCode, setOrderZipCode] = useState<string>("");
    const [orderTrackingNumber, setOrderTrackingNumber] = useState<string>("");
    const [orderArrivalDate, setOrderArrivalDate] = useState<string>("");
    const [orderId, setOrderId] = useState<number>(0);

    const getOrders = async() => {
        await fetch(`${baseUrl}/api/GetOrdersForUser?userId=${user.name}`)
        .then(res => res.json())
        .then(setOrders)
        .catch(console.error);
        setShippingCompany("DHL");
        setShippingStatus("SHIPPING");
        setOrderTitle("");
        setOrderZipCode("");
        setOrderTrackingNumber("");
        setOrderArrivalDate("");
        setOrderId(0);
    };

    const createOrder = async (newOrder: Order) => {
        await fetch(`${baseUrl}/api/CreateOrder`, {
            method: 'POST',
            body: JSON.stringify({ newOrder }),
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => console.log(err));
    };

    const updateOrder = async (newOrder: Order) => {
        await fetch(`${baseUrl}/api/UpdateOrder`, {
            method: 'PUT',
            body: JSON.stringify({ newOrder }),
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => console.log(err));
    };

    const deleteOrder = async (orderId: number) => {
        await fetch(`${baseUrl}/api/DeleteOrder?orderId=${orderId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => console.log(err));
        await getOrders();
    };

    const [newOrderModal, setNewOrderModal] = useState(false);
    const newOrderToggle = () => setNewOrderModal(!newOrderModal);
    const [updateOrderModal, setUpdateOrderModal] = useState(false);
    const updateOrderToggle = () => setUpdateOrderModal(!updateOrderModal);

    const handleFormSubmit = async (event: any) => {
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
            arrival:  new Date(orderArrivalDate),
            link: orderLink,
            userId: user.name,
            zipCode: orderZipCode,
            trackingNumber: orderTrackingNumber
        };
        await createOrder(newOrder);
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

        await updateOrder(updatedOrder);
        await getOrders();
    }

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
            case "DPD": companyLogo = dpdLogo;
                break;
            case "GLS": companyLogo = glsLogo;
                break;
            case "UPS": companyLogo = upsLogo;
                break;
        }
        return (
            <img src={companyLogo} alt={rowData.company} className="product-image" />
        );
    }

    const arrivalColumnTemplate = (rowData: Order) => {
        return (
            <Label>{new Date(rowData.arrival).toLocaleDateString()}</Label>
        );
    }

    const trackingLinkTemplate = (rowData: Order) => {
        return (
            <>
                <a className="btn btn-success" href={rowData.link} target="_blank" rel="noopener noreferrer"><b><FontAwesomeIcon icon={faTruckMoving} /> TRACK</b></a>
            </>
        );
    }

    const actionsTemplate = (rowData: Order) => {
        return (
            <>
                <Button className="rounded-circle" color="warning" onClick={() => toggleUpdateOrder(rowData)}><b><FontAwesomeIcon icon={faPen} /></b></Button>
                <Button className="rounded-circle ml-1" color="danger" onClick={() => deleteOrder(rowData.id)} ><b><FontAwesomeIcon icon={faTrashAlt} /></b></Button>
            </>
        );
    }

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button color="primary" onClick={newOrderToggle}><b><FontAwesomeIcon icon={faPlus} /> NEW</b></Button>
                <Button color="danger" className="ml-1" disabled={!selectedOrders || !selectedOrders.length} onClick={deleteSelectedProducts}><b><FontAwesomeIcon icon={faTrashAlt} /> DELETE</b></Button>
            </>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <>
                <Button color="secondary" onClick={exportCSV}><b><FontAwesomeIcon icon={faFileExport} /> EXPORT</b></Button>
            </>
        )
    }

    const statusBodyTemplate = (rowData: Order) => {
        let badgeColor;
        switch (rowData.status) {
            case "SHIPPING": badgeColor = "primary";
                break;
            case "SHIPPED": badgeColor = "secondary";
                break;
        }

        return (<Badge color={badgeColor}>{rowData.status}</Badge>);
    }

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

    const deleteSelectedProducts = () => {
        let filteredOrders = orders.filter(val => !selectedOrders.includes(val));
        setOrders(filteredOrders);
        selectedOrders.forEach(filteredOrder => deleteOrder(filteredOrder.id));
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

    const exportCSV = () => {
        dt?.exportCSV();
    }

    return (
        <>
            <Container>
                {!isAuthenticated && (<Hero></Hero>)}
                {isAuthenticated && (
                    <>
                        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        <div className="datatable-responsive">
                        { orders.length == 0 ? (<MyLoader></MyLoader>) : (
                            <DataTable ref={(el) => dt = el} 
                                value={orders} 
                                selection={selectedOrders} 
                                onSelectionChange={(e) => setSelectedOrders(e.value)}
                                className="p-datatable-responsive"
                                dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                                header={header}
                                globalFilter={globalFilter}>
                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                <Column field="title" header="Title" sortable body={descriptionColumnTemplate}></Column>
                                <Column field="company" header="Company" sortable body={shippingCompanyTemplate}></Column>
                                <Column field="arrival" header="Arrival" sortable body={arrivalColumnTemplate}></Column>
                                <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
                                <Column field="link" header="Tracking Link" body={trackingLinkTemplate} ></Column>
                                <Column field="edit" body={actionsTemplate}></Column>
                            </DataTable>
                            )
                        }
                        </div>
                    </>
                )}
            </Container>
            <Modal isOpen={newOrderModal} toggle={newOrderToggle}>
                <Form onSubmit={handleFormSubmit}>
                    <ModalHeader toggle={newOrderToggle}>Create New Order</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="orderTitle">Title</Label>
                            <Input name="orderTitle" id="orderTitle" value={orderTitle} onChange={(event) => setOrderTitle(event.currentTarget.value)}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="orderArrival">Arrival</Label>
                            <Input type="date" name="orderArrival" id="orderArrival" value={orderArrivalDate} onChange={(event) => setOrderArrivalDate(event.currentTarget.value)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="orderCompany">Shipping Company</Label>
                            <Input
                                type="select"
                                name="orderCompany"
                                id="orderCompanySelect"
                                value={shippingCompany}
                                onChange={(event) => setShippingCompany(event.currentTarget.value)}>
                                <option>DHL</option>
                                <option>Hermes</option>
                                <option>DPD</option>
                                <option>GLS</option>
                                <option>UPS</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="zipCode">Zip Code</Label>
                            <Input name="zipCode" id="zipCode" value={orderZipCode} onChange={(event) => setOrderZipCode(event.currentTarget.value)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="trackingNumber">Tracking number</Label>
                            <Input name="trackingNumber" id="trackingNumber" value={orderTrackingNumber} onChange={(event) => setOrderTrackingNumber(event.currentTarget.value)} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary" onClick={newOrderToggle}><b>SAVE</b></Button>
                        <Button color="secondary" onClick={newOrderToggle}><b>CANCEL</b></Button>
                    </ModalFooter>
                </Form>
            </Modal>
            <Modal isOpen={updateOrderModal} toggle={updateOrderToggle}>
                <Form onSubmit={handleUpdateSubmit}>
                    <ModalHeader toggle={updateOrderToggle}>Update Order</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="orderTitle">Title</Label>
                            <Input name="orderTitle" id="orderTitle" value={orderTitle} onChange={(event) => setOrderTitle(event.currentTarget.value)}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="orderArrival">Arrival</Label>
                            <Input type="date" name="orderArrival" id="orderArrival" value={orderArrivalDate} onChange={(event) => setOrderArrivalDate(event.currentTarget.value)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="orderCompany">Shipping Company</Label>
                            <Input
                                type="select"
                                name="orderCompany"
                                id="orderCompanySelect"
                                value={shippingCompany}
                                onChange={(event) => setShippingCompany(event.currentTarget.value)}>
                                <option>DHL</option>
                                <option>Hermes</option>
                                <option>DPD</option>
                                <option>GLS</option>
                                <option>UPS</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="zipCode">Zip Code</Label>
                            <Input name="zipCode" id="zipCode" value={orderZipCode} onChange={(event) => setOrderZipCode(event.currentTarget.value)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="trackingNumber">Tracking number</Label>
                            <Input name="trackingNumber" id="trackingNumber" value={orderTrackingNumber} onChange={(event) => setOrderTrackingNumber(event.currentTarget.value)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="status">Status</Label>
                            <Input type="select"
                                name="status"
                                id="orderTrackingNumberSelect"
                                value={shippingStatus}
                                onChange={(event) => setShippingStatus(event.currentTarget.value)}>
                                <option>SHIPPING</option>
                                <option>SHIPPED</option>
                            </Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary" onClick={updateOrderToggle}><b>SAVE</b></Button>
                        <Button color="secondary" onClick={updateOrderToggle}><b>CANCEL</b></Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </>
    );
}

export default Home;