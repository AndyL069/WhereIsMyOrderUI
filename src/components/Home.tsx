import React, { useState, useEffect } from 'react';
import { Container, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Badge } from 'reactstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faFileExport, faPen, faTruckMoving } from '@fortawesome/free-solid-svg-icons';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import ContentLoader from 'react-content-loader'
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

const MyLoader = (props: any) => {
    return (
    <ContentLoader 
    speed={2}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    width="100%"
    {...props}>
        <rect x="51" y="45" rx="3" ry="3" width="906" height="17" />
        <circle cx="879" cy="123" r="11" />
        <circle cx="914" cy="123" r="11" />
        <rect x="104" y="115" rx="3" ry="3" width="141" height="15" />
        <rect x="305" y="114" rx="3" ry="3" width="299" height="15" />
        <rect x="661" y="114" rx="3" ry="3" width="141" height="15" />
        <rect x="55" y="155" rx="3" ry="3" width="897" height="2" />
        <circle cx="880" cy="184" r="11" />
        <circle cx="915" cy="184" r="11" />
        <rect x="105" y="176" rx="3" ry="3" width="141" height="15" />
        <rect x="306" y="175" rx="3" ry="3" width="299" height="15" />
        <rect x="662" y="175" rx="3" ry="3" width="141" height="15" />
        <rect x="56" y="216" rx="3" ry="3" width="897" height="2" />
        <circle cx="881" cy="242" r="11" />
        <circle cx="916" cy="242" r="11" />
        <rect x="106" y="234" rx="3" ry="3" width="141" height="15" />
        <rect x="307" y="233" rx="3" ry="3" width="299" height="15" />
        <rect x="663" y="233" rx="3" ry="3" width="141" height="15" />
        <rect x="57" y="274" rx="3" ry="3" width="897" height="2" />
        <circle cx="882" cy="303" r="11" />
        <circle cx="917" cy="303" r="11" />
        <rect x="107" y="295" rx="3" ry="3" width="141" height="15" />
        <rect x="308" y="294" rx="3" ry="3" width="299" height="15" />
        <rect x="664" y="294" rx="3" ry="3" width="141" height="15" />
        <rect x="58" y="335" rx="3" ry="3" width="897" height="2" />
        <circle cx="881" cy="363" r="11" />
        <circle cx="916" cy="363" r="11" />
        <rect x="106" y="355" rx="3" ry="3" width="141" height="15" />
        <rect x="307" y="354" rx="3" ry="3" width="299" height="15" />
        <rect x="663" y="354" rx="3" ry="3" width="141" height="15" />
        <rect x="57" y="395" rx="3" ry="3" width="897" height="2" />
        <circle cx="882" cy="424" r="11" />
        <circle cx="917" cy="424" r="11" />
        <rect x="107" y="416" rx="3" ry="3" width="141" height="15" />
        <rect x="308" y="415" rx="3" ry="3" width="299" height="15" />
        <rect x="664" y="415" rx="3" ry="3" width="141" height="15" />
        <rect x="55" y="453" rx="3" ry="3" width="897" height="2" />
        <rect x="51" y="49" rx="3" ry="3" width="2" height="465" />
        <rect x="955" y="49" rx="3" ry="3" width="2" height="465" />
        <circle cx="882" cy="484" r="11" />
        <circle cx="917" cy="484" r="11" />
        <rect x="107" y="476" rx="3" ry="3" width="141" height="15" />
        <rect x="308" y="475" rx="3" ry="3" width="299" height="15" />
        <rect x="664" y="475" rx="3" ry="3" width="141" height="15" />
        <rect x="55" y="513" rx="3" ry="3" width="897" height="2" />
        <rect x="52" y="80" rx="3" ry="3" width="906" height="17" />
        <rect x="53" y="57" rx="3" ry="3" width="68" height="33" />
        <rect x="222" y="54" rx="3" ry="3" width="149" height="33" />
        <rect x="544" y="55" rx="3" ry="3" width="137" height="33" />
        <rect x="782" y="56" rx="3" ry="3" width="72" height="33" />
        <rect x="933" y="54" rx="3" ry="3" width="24" height="33" />
  </ContentLoader>);
  }

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
let toast: Toast | null;
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
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetch(`${baseUrl}/api/GetOrdersForUser?userId=${user.name}`)
        .then(res => res.json())
        .then(setOrders)
        .then(() => setOrdersLoading(false))
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
        toast?.show({ severity: 'success', summary: 'Successful', detail: 'Order Created', life: 3000 });
    };

    const updateOrder = async (newOrder: Order) => {
        await fetch(`${baseUrl}/api/UpdateOrder`, {
            method: 'PUT',
            body: JSON.stringify({ newOrder }),
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => console.log(err));
        toast?.show({ severity: 'success', summary: 'Successful', detail: 'Order Updated', life: 3000 });
    };

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

    const deleteOrder = async () => {
        await deleteOrderRequest(orderId);
        await getOrders();
        toast?.show({ severity: 'success', summary: 'Successful', detail: 'Order Deleted', life: 3000 });
    };

    const deleteOrderRequest = async (id: number) => {
        await fetch(`${baseUrl}/api/DeleteOrder?orderId=${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => console.log(err));
    };

    const deleteSelectedOrders = async () => {
        let orderCount = selectedOrders.length;
        let filteredOrders = orders.filter(val => !selectedOrders.includes(val));
        setOrders(filteredOrders);
        selectedOrders.forEach(filteredOrder => deleteOrderRequest(filteredOrder.id));
        toast?.show({ severity: 'success', summary: 'Successful', detail: `${orderCount} Order(s) Deleted`, life: 3000 });
    }

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
            <Modal isOpen={deleteSelectedOrdersModal} 
                toggle={deleteSelectedOrdersToggle}>
                <ModalHeader toggle={deleteSelectedOrdersToggle}>Delete Selected Orders</ModalHeader>
                <ModalBody>
                    This will delete all selected orders. Are you sure?
                </ModalBody>
                <ModalFooter>
                <Button color="danger" onClick={() => {deleteSelectedOrders(); deleteSelectedOrdersToggle();}}><b>DELETE</b></Button>{' '}
                <Button color="secondary" onClick={deleteSelectedOrdersToggle}><b>CANCEL</b></Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={deleteOrderModal} 
                toggle={deleteOrderToggle}>
                <ModalHeader toggle={deleteOrderToggle}>Delete Order</ModalHeader>
                <ModalBody>
                    This order will be deleted. Are you sure?
                </ModalBody>
                <ModalFooter>
                <Button color="danger" onClick={() => {deleteOrder(); deleteOrderToggle();}}><b>DELETE</b></Button>{' '}
                <Button color="secondary" onClick={deleteOrderToggle}><b>CANCEL</b></Button>
                </ModalFooter>
            </Modal>
            <Toast ref={(el) => toast = el} />
            <Container>
                {!isAuthenticated && (<Hero></Hero>)}
                {isAuthenticated && (
                    <>
                        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        <div className="datatable-responsive">
                        { ordersLoading ? (<><MyLoader/><MyLoader/><MyLoader/></>) : (
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