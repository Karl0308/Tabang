import React, { Component, useState, useEffect, Children } from "react";
import { Container, Row, Col, Input, Label, Table } from "reactstrap";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import LoadingSpinner from "./LoadingSpinner";
import { APIURLS } from "./APIURLS";
import FlyingMessage from "./components/FlyingMessage"
import { confirmAlert } from 'react-confirm-alert';

const UserListNotEmail = (props) => {
    const initialState = {
        id: 0,
        userName: "",
        email: "",
        oldUserName: "",
        password: "",
        repassword: "",
        fullName: "",
        role: 0,
        active: true,
        roleText: "",
        activeText: "",
        branchId: 0
    };
    const [user, setUser] = useState(initialState);


    const [itemsData, setItems] = useState([]);
    const [allitemsData, setallItems] = useState([]);
    const [isOpenAddUser, setIsOpenAddUser] = React.useState(false);
    const [isOpenViewUser, setIsOpenViewUser] = React.useState(false);
    const [isOpenResetPassword, setIsOpenResetPassword] = React.useState(false);
    const [isOpenProcessing, setisOpenProcessing] = useState(false);
    const [isOpenProcessingTable, setisOpenProcessingTable] = useState(false);
    const [pages, setPages] = useState(0);
    const [isShowDescriptionError, setisShowDescriptionError] = useState("none")
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
    const [error, setError] = useState([]);
    const [save, setSave] = useState(false);
    const [branches, setBranches] = useState([]);
    const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 600);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const showModal = (data) => {
        setIsOpenAddUser(true);
        setUser(data);
        setSave(false);
    };

    const hideModal = () => {
        setIsOpenAddUser(false);
        setUser(initialState);
    };
    const showViewUserModal = (data) => {
        setIsOpenViewUser(true);
        data.oldUserName = data.userName;
        setUser(data);
        setSave(false);
    };

    const hideViewUserModal = () => {
        setIsOpenViewUser(false);
        setUser(initialState);
    };

    const showResetPasswordModal = (data) => {
        setIsOpenResetPassword(true);
        setUser(data);
        setSave(false);
    };

    const hideResetPasswordModal = () => {
        setIsOpenResetPassword(false);
        setUser(initialState);
        setError("");
    };




    useEffect(() => {
        FetchData();
        FetchBranches();
    }, []);

    const axiosInstanceGet = axios.create({
        baseURL: APIURLS.user.getUser,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    });

    const FetchData = () => {
        setisOpenProcessingTable(true);
        axiosInstanceGet.get(APIURLS.user.getUsers)
            .then(res => res.data)
            .then(
                (result) => {
                    setItems(result);
                    setallItems(result);
                    setPages((result.length / 10))
                    setisOpenProcessingTable(false);
                },
                (error) => {
                    setisOpenProcessingTable(false);
                }
            )
    }
    const FetchBranches = () => {
        setisOpenProcessingTable(true);
        axiosInstanceGet.get(APIURLS.branch.getBranches + 'false')
            .then(res => res.data)
            .then(
                (result) => {
                    setBranches(result);
                },
                (error) => {
                    console.log(error);
                }
            )
    }


    const onChange = (e) => {

        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const onChangeSelect = (e) => {
        setUser({
            ...user,
            [e.target.name]: parseInt(e.target.value)
        });
    };
    const onChangestatus = (e) => {
        setUser({
            ...user,
            [e.target.name]: (e.target.value == 0 ? false : true)
        });
    };
    const axiosInstanceAdd = axios.create({
        // baseURL: APIURLS.user.saveUser,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    });

    const submitFormAdd = (e) => {
        e.preventDefault();
        setisOpenProcessing(true);

        if (user.subDepartmentId == null && user.isSupervisor == true) {
            return;
        }
        if (user.branchId == null) {
            user.branchId = 0;
        }

        const formData = new FormData();
        formData.append('oldusername', user.oldUserName);
        formData.append('username', user.userName);
        formData.append('fullname', user.fullName);
        formData.append('email', user.email);
        formData.append('branch', user.branchId);
        formData.append('role', user.role);
        formData.append('active', user.active);
        formData.append('subDepartmentId', user.subDepartmentId);
        formData.append('password', user.password);
        formData.append('repassword', user.repassword);
        if (user.subDepartmentId == null && user.isSupervisor == true) {
            formData.append('isSupervisor', false);
        }
        else{
            formData.append('isSupervisor', user.isSupervisor);
        }
        axiosInstanceAdd.post(APIURLS.user.saveUser, formData)
            .then(res => {
                setisOpenProcessing(false);
                setIsOpenAddUser(false);
                FetchData();
                setUser(initialState);
                setSave(true);
                setError("");
            }).catch(function (errorr) {

                const errorMessage = errorr.response.data[""][0];
                alert(errorMessage);
                setError(errorMessage);
                console.log(error);
                setisOpenProcessing(false);
            });
    }

    const submitFormedit = (e) => {
        e.preventDefault();
        setisOpenProcessing(true);
        if (user.branchId == null) {
            user.branchId = 0;
        }

        const formData = new FormData();
        formData.append('oldusername', user.oldUserName);
        formData.append('username', user.userName);
        formData.append('fullname', user.fullName);
        formData.append('email', user.email);
        formData.append('branch', user.branchId);
        formData.append('role', user.role);
        formData.append('active', user.active);
        formData.append('subDepartmentId', user.subDepartmentId);
        formData.append('password', user.password);
        if (user.subDepartmentId == null && user.isSupervisor == true) {
            formData.append('isSupervisor', false);
        }
        else{
            formData.append('isSupervisor', user.isSupervisor);
        }   

        // axiosInstanceAdd.post(APIURLS.user.updateUser, user)
        axiosInstanceAdd.post(APIURLS.user.updateUser, formData)
            .then(res => {
                setisOpenProcessing(false);
                setIsOpenViewUser(false);
                FetchData();
                setUser(initialState);
                setSave(true);
                setError("");
            }).catch(function (error) {
                const errorMessage = error.response.data[""][0];
                alert(errorMessage);
                setError(errorMessage);
                setisOpenProcessing(false);
            });
    }

    const submitresetPassword = (e) => {
        e.preventDefault();
        setisOpenProcessing(true);
        if (user.branchId == null) {
            user.branchId = 0;
        }
        axiosInstanceAdd.post(APIURLS.user.resetPassword, user)
            .then(res => {
                setisOpenProcessing(false);
                setIsOpenResetPassword(false);
                FetchData();
                setUser(initialState);
                setSave(true);
                setError("");
            }).catch(function (error) {
                const errorMessage = error.response.data[""][0];
                setError(errorMessage);
                setisOpenProcessing(false);
            });
    }


    const componentStyle = {
        height: "100%",
        backgroundColor: "transparent"
    };
    const headerStyle = {
        fontSize: "25px",
        fontWeight: "bold",
        textDecoration: "underline",
        fontFamily: "sans-serif",
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "20px"
    };
    const h2Style = {
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: "sans-serif",
        paddingLeft: "20px",
        paddingRight: "20px"
    };

    const useSortableData = (items, config = null) => {
        const [sortConfig, setSortConfig] = React.useState(config);

        const sortedItems = React.useMemo(() => {
            let sortableItems = [...items];
            if (sortConfig !== null) {
                sortableItems.sort((a, b) => {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                });
            }
            return sortableItems;
        }, [items, sortConfig]);

        const requestSort = (key) => {
            let direction = 'ascending';
            if (
                sortConfig &&
                sortConfig.key === key &&
                sortConfig.direction === 'ascending'
            ) {
                direction = 'descending';
            }
            setSortConfig({ key, direction });
        };

        return { items: sortedItems, requestSort, sortConfig };
    };

    const { items, requestSort, sortConfig } = useSortableData(itemsData);

    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    const UserSearch = event => {
        setItems(allitemsData);
        if (event.target.value !== '') {
            const searchres = allitemsData.filter(item => item.fullName.toLowerCase().includes(event.target.value.toLowerCase()));
            setItems(searchres);
        }
        else { setItems(allitemsData); }
        // }

    };

    const axiosInstanceDelete = axios.create({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    });

    const deleteUser = (userId) => {
        return axiosInstanceDelete.delete(APIURLS.user.deleteUser + userId).then(res => {
            FetchData();
        }).catch(function (errorr) {
            alert('The User cannot be deleted because it is associated with ticket');
        });
    }


   const handleDeleteuser = (user) => {
        confirmAlert({
            title: 'Confirm remove',
            message: 'Are you sure to do delete user ' + user.fullName + "?",
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        deleteUser(user.id);
                    }
                },
                {
                    label: 'No'
                }
            ]
        });
    };



    if (isSmallScreen) {
        return (
            <div>
                <div style={componentStyle}>
                    <div style={{ paddingTop: "12px", paddingBottom: "6px", marginBottom: "20px", display: 'flex', justifyContent: 'space-between', borderBottom: "solid 1px black" }}>
                        <div className="d-flex flex-row">
                            <div className="p-2" style={{ fontSize: "3vw", marginTop: "8px" }}>Search:</div>
                            <div className="p-2">
                                <Input
                                    type="text"
                                    onChange={UserSearch}
                                    className="searchname"
                                    style={{ fontSize: "3vw" }}
                                /></div>
                        </div>
                        <div><Button style={{ fontSize: "3vw", marginTop: "8px" }} onClick={() => showModal(initialState)} variant="success">Add</Button></div>
                    </div>
                    <div>
                        <Table responsive hover>
                            <thead>

                            </thead>
                            <tbody>
                                {items.map((item) => {
                                    return (
                                        <tr key={item.id}>
                                            <div style={{ width: '100%', borderBottom: 'solid #D3D3D3 1px', padding: '20px', marginTop: '5px', marginBottom: '5px', borderRadius: '0px', fontSize: '3.5vw' }}>
                                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingBottom: "10px" }}>
                                                    <div style={{ textAlign: "left", fontWeight: 'bold' }}>Full Name: <div style={{ fontWeight: "normal" }}>{"   " + item.fullName}</div></div>
                                                    <div style={{ textAlign: "right", color: 'gray' }}>{item.roleText}</div>
                                                </div>
                                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingBottom: "10px" }}>
                                                    {/* <div style={{ textAlign: "left", fontWeight: 'bold' }}>Email: {"   " + item.email}</div> */}
                                                    <div style={{ textAlign: "left", fontWeight: 'bold' }}>Username: {"   " + item.userName}</div>
                                                    <div style={{ height: "25px", border: "none", color: "#A4AEB7", borderRadius: "15px", fontSize: "3.5vw", fontWeight: "700", letterSpacing: "0.78px", color: item.activeText == "ACTIVE" ? "#10B981" : "#FF0000" }}>{item.activeText}</div>

                                                </div>
                                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingBottom: "30px" }}>
                                                    <div style={{ textAlign: "left", fontWeight: 'bold' }}>Section: {"   " + item.branchName}</div>
                                                </div>

                                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                                    <Button style={{ border: "1px solid #EDEDED", color: "#A4AEB7", paddingLeft: "4vw", paddingRight: "4vw", borderRadius: "15px", fontSize: "3.5vw", fontWeight: "500", letterSpacing: "0.78px", marginRight: "10px" }} variant="outline-secondary" onClick={() => showViewUserModal(item)} >View</Button>
                                                    <Button style={{ border: "1px solid #EDEDED", color: "#A4AEB7", padding: "5px", borderRadius: "15px", fontSize: "3.5vw", fontWeight: "500", letterSpacing: "0.78px" }} variant="outline-secondary" onClick={() => showResetPasswordModal(item)} >Reset Password</Button>
                                                    <Button style={{ border: "1px solid #EDEDED", color: "#A4AEB7", padding: "5px", borderRadius: "15px", fontSize: "3.5vw", fontWeight: "500", letterSpacing: "0.78px" }} variant="outline-secondary" onClick={() => handleDeleteuser(item)} >Delete</Button>
                                                </div>
                                            </div>
                                        </tr>
                                    )
                                })}
                            </tbody>

                        </Table>
                        {isOpenProcessingTable ? <LoadingSpinner /> : <div />}
                    </div>
                </div>
                {/* add User */}
                <>
                    <Modal show={isOpenAddUser} >
                        <Modal.Header style={{ border: "none" }}>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Full Name:</div>
                            <Input
                                type="text"
                                name="fullName"
                                id="fullName"
                                onChange={onChange}
                                value={user.fullName === null ? "" : user.fullName}
                                required
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('fullname') && user.fullName.length == 0 ? false : true}>required!</div>

                        </Modal.Body>
                        {/* <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Email:</div>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                onChange={onChange}
                                value={user.email === null ? "" : user.email}
                                required
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('email') ? false : true}>required or must have (@iloilosupermart.team).</div>

                        </Modal.Body> */}

                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Username:</div>
                            <Input
                                type="text"
                                name="userName"
                                id="userName"
                                onChange={onChange}
                                value={user.userName === null ? "" : user.userName}
                            />

                            {/* <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.includes('username') ? false : true}>required!</div> */}
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('taken') ? false : true}>Username exist!</div>

                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Password:</div>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                onChange={onChange}
                                value={user.password === null ? "" : user.password}
                                autocomplete="new-password"
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('passwords') ? false : true}>Required 6 character or more!</div>
                            {/* <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('password') ? false : true}>required</div> */}
                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Confirmation Password:</div>
                            <Input
                                type="password"
                                name="repassword"
                                id="repassword"
                                onChange={onChange}
                                value={user.repassword === null ? "" : user.repassword}
                                autocomplete="new-password"
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('match') ? false : true}>Password doesn't match!</div>
                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Section:</div>
                            <Form.Select name={"branchId"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChangeSelect}>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={0} selected={user.branchId == 0 ? true : false}>Unassigned</option>
                                {branches.map((item) => {
                                    return (
                                        <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={item.id} selected={user.branchId == item.id ? true : false}>{item.name}</option>
                                    )
                                })}
                            </Form.Select>
                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Position:</div>
                            <Form.Select name={"role"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChangeSelect}>
                                <option style={{ letterSpacing: ".5px", marginBottom: "20px" }} value={0} selected={user.role == 0 ? true : false}> Revenue District Officer  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={1} selected={user.role == 1 ? true : false}>Asst. Revenue District Officer  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={2} selected={user.role == 2 ? true : false}>Chief Assessment Section     </option>
                                <option style={{ letterSpacing: ".5px", marginBottom: "20px" }} value={3} selected={user.role == 3 ? true : false}> Chief Collection Section  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={4} selected={user.role == 4 ? true : false}>Chief ClientSupport System  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={5} selected={user.role == 5 ? true : false}>Chief Compliance Section     </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={6} selected={user.role == 6 ? true : false}>Chief Admin     </option>
                            </Form.Select>
                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Status:</div>
                            <Form.Select name={"active"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChangestatus}>
                                <option style={{ letterSpacing: ".5px", marginBottom: "20px" }} value={1} selected={user.active == 1 ? true : false}>ACTIVE</option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={0} selected={user.active == 0 ? true : false}>INACTIVE</option>
                            </Form.Select>
                        </Modal.Body>
                        <Modal.Footer style={{ border: "none" }}>
                            <Button style={{ background: "#F43030", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px" }} variant="outline-danger" onClick={hideModal}>Cancel</Button>
                            <Button style={{ background: "#3B82F6", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px" }} variant="outline-primary" onClick={submitFormAdd}>Save</Button>
                        </Modal.Footer>

                        {isOpenProcessing ? <LoadingSpinner /> : <div />}
                    </Modal>
                    {save ? <FlyingMessage message="Successfully saved!" /> : ""}
                </>


                {/* update user */}
                <>
                    <Modal show={isOpenViewUser} >
                        <Modal.Header style={{ border: "none" }}>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Full Name:</div>
                            <Input
                                type="text"
                                name="fullName"
                                id="fullName"
                                onChange={onChange}
                                value={user.fullName === null ? "" : user.fullName}
                                required
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('fullname') && user.fullName.length == 0 ? false : true}>required!</div>

                        </Modal.Body>
                        {/* <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Email:</div>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                onChange={onChange}
                                value={user.email === null ? "" : user.email}
                                required
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('email') ? false : true}>required or must have (@iloilosupermart.team).</div>

                        </Modal.Body> */}
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Username:</div>
                            <Input
                                type="text"
                                name="userName"
                                id="userName"
                                onChange={onChange}
                                value={user.userName === null ? "" : user.userName}
                            />
                            <div>{error}</div>
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.includes('username') ? false : true}>required!</div>
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('already taken') ? false : true}>Username exist!</div>

                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Section:</div>
                            <Form.Select name={"branchId"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChangeSelect}>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={0} selected={user.branchId == 0 ? true : false}>Unassigned</option>
                                {branches.map((item) => {
                                    return (
                                        <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={item.id} selected={user.branchId == item.id ? true : false}>{item.name}</option>
                                    )
                                })}
                            </Form.Select>
                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Position:</div>
                            <Form.Select name={"role"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChangeSelect}>
                                <option style={{ letterSpacing: ".5px", marginBottom: "20px" }} value={0} selected={user.role == 0 ? true : false}> Revenue District Officer  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={1} selected={user.role == 1 ? true : false}>Asst. Revenue District Officer  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={2} selected={user.role == 2 ? true : false}>Chief Assessment Section     </option>
                                <option style={{ letterSpacing: ".5px", marginBottom: "20px" }} value={3} selected={user.role == 3 ? true : false}> Chief Collection Section  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={4} selected={user.role == 4 ? true : false}>Chief ClientSupport System  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={5} selected={user.role == 5 ? true : false}>Chief Compliance Section     </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={6} selected={user.role == 6 ? true : false}>Chief Admin     </option>
                            </Form.Select>
                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Status:</div>
                            <Form.Select name={"active"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChangestatus}>
                                <option style={{ letterSpacing: ".5px", marginBottom: "20px" }} value={1} selected={user.active == 1 ? true : false}>ACTIVE</option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={0} selected={user.active == 0 ? true : false}>INACTIVE</option>
                            </Form.Select>
                        </Modal.Body>
                        <Modal.Footer style={{ border: "none" }}>
                            <Button style={{ background: "#F43030", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px" }} variant="outline-danger" onClick={hideViewUserModal}>Cancel</Button>
                            <Button style={{ background: "#3B82F6", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px" }} variant="outline-primary" onClick={submitFormedit}>Save</Button>
                        </Modal.Footer>

                        {isOpenProcessing ? <LoadingSpinner /> : <div />}
                    </Modal>
                    {save ? <FlyingMessage message="Successfully saved!" /> : ""}
                </>


                {/* reset user password */}
                <>
                    <Modal show={isOpenResetPassword} >
                        <Modal.Header style={{ border: "none" }}>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Full Name:</div>
                            <Input
                                type="text"
                                name="fullName"
                                id="fullName"
                                onChange={onChange}
                                value={user.fullName === null ? "" : user.fullName}
                                required
                                readOnly={true}
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('fullname') && user.fullName.length == 0 ? false : true}>required!</div>

                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Password:</div>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                onChange={onChange}
                                value={user.password === null ? "" : user.password}
                                autocomplete="new-password"
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('passwords') ? false : true}>Required 6 character or more!</div>
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('password') ? false : true}>required</div>
                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Confirmation Password:</div>
                            <Input
                                type="password"
                                name="repassword"
                                id="repassword"
                                onChange={onChange}
                                value={user.repassword === null ? "" : user.repassword}
                                autocomplete="new-password"
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('match') ? false : true}>Password doesn't match!</div>
                        </Modal.Body>
                        <Modal.Footer style={{ border: "none" }}>
                            <Button style={{ background: "#F43030", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px" }} variant="outline-danger" onClick={hideResetPasswordModal}>Cancel</Button>
                            <Button style={{ background: "#3B82F6", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px" }} variant="outline-primary" onClick={submitresetPassword}>Save</Button>
                        </Modal.Footer>

                        {isOpenProcessing ? <LoadingSpinner /> : <div />}
                    </Modal>
                    {save ? <FlyingMessage message="Successfully saved!" /> : ""}
                </>
                {/* {save ? <FlyingMessage message="Successfully saved!" /> : ""} */}
            </div>
        )
    }
    else {
        return (

            <div>
                <div style={componentStyle}>
                    {/* <div style={{ position: "relative", textAlign: "center", marginTop: "16px", padding: "10px", border: "1px solid none", borderRadius: "10px", backgroundColor: "#10B981", color: "white" }}>
                        <div style={{ fontSize: "30px", fontWeight: "bold" }}>USER LIST</div>
                    </div> */}
                    <div style={{ paddingTop: "20px", paddingBottom: "10px", marginBottom: "20px", display: 'flex', justifyContent: 'space-between', borderBottom: "solid 1px black" }}>
                        <div className="d-flex flex-row">
                            <div className="p-2" style={{ fontSize: "18px", marginTop: "6px" }}>Search:</div>
                            <div className="p-2">
                                <Input
                                    type="text"
                                    onChange={UserSearch}
                                    className="searchname"
                                /></div>
                        </div>
                        <div><Button onClick={() => showModal(initialState)} variant="success" >Add User</Button></div>
                    </div>
                    <div>
                        <Table responsive hover>
                            <thead>
                                <tr style={{ backgroundColor: "white" }}>
                                    <th style={{ minWidth: "160px" }}>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('fullName')}
                                            className={getClassNamesFor('fullName')}
                                        >
                                            Full Name
                                        </Button>
                                    </th>
                                    {/* <th style={{ minWidth: "160px" }}>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('email')}
                                            className={getClassNamesFor('email')}
                                        >
                                            Email
                                        </Button>
                                    </th> */}
                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('userName')}
                                            className={getClassNamesFor('userName')}
                                        >
                                            Username
                                        </Button>
                                    </th>
                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('branchName')}
                                            className={getClassNamesFor('branchName')}
                                        >
                                            Section
                                        </Button>
                                    </th>
                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('roleText')}
                                            className={getClassNamesFor('roleText')}
                                        >
                                            Position
                                        </Button>
                                    </th>
                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('activeText')}
                                            className={getClassNamesFor('activeText')}
                                        >
                                            Status
                                        </Button>
                                    </th>

                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('action')}
                                            className={getClassNamesFor('action')}
                                        >
                                            Action
                                        </Button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => {
                                    return (
                                        <tr key={item.id}>
                                            <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.fullName}</td>
                                            {/* <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.email}</td> */}
                                            <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.userName}</td>
                                            <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.branchName}</td>
                                            <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.roleText}</td>
                                            <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word", color: item.activeText == "ACTIVE" ? "#10B981" : "#FF0000" }}>{item.activeText}</td>
                                            <td>
                                                <Button style={{ width: "72px", height: "25px", border: "1px solid #EDEDED", color: "#A4AEB7", padding: "0px", borderRadius: "15px", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", marginRight: "10px" }} variant="outline-secondary" onClick={() => showViewUserModal(item)} >View</Button>
                                                <Button style={{ width: "140px", height: "25px", border: "1px solid #EDEDED", color: "#A4AEB7", padding: "0px", borderRadius: "15px", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px" }} variant="outline-secondary" onClick={() => showResetPasswordModal(item)} >Reset Password</Button>
                                                <Button style={{ width: "140px", height: "25px", border: "1px solid #EDEDED", color: "#A4AEB7", padding: "0px", borderRadius: "15px", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px" }} variant="outline-secondary" onClick={() => handleDeleteuser(item)} >Delete</Button>
                                           
                                            </td>

                                        </tr>
                                    )
                                })}
                            </tbody>

                        </Table>
                        {isOpenProcessingTable ? <LoadingSpinner /> : <div />}
                    </div>
                </div>

                {/* add User */}
                <>
                    <Modal show={isOpenAddUser} >
                        <Modal.Header style={{ border: "none" }}>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Full Name:</div>
                            <Input
                                type="text"
                                name="fullName"
                                id="fullName"
                                onChange={onChange}
                                value={user.fullName === null ? "" : user.fullName}
                                required
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('fullname') && user.fullName.length == 0 ? false : true}>required!</div>

                        </Modal.Body>
                        {/* <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Email:</div>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                onChange={onChange}
                                value={user.email === null ? "" : user.email}
                                required
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('email') ? false : true}>required or must have (@iloilosupermart.team).</div>

                        </Modal.Body>
                        
                        {/*<Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Username:</div>
                            <Input
                                type="text"
                                name="userName"
                                id="userName"
                                onChange={onChange}
                                value={user.userName === null ? "" : user.userName}
                            />

                            {/* <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.includes('username') ? false : true}>required!</div> */}
                        {/* <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('taken') ? false : true}>Username exist!</div>

                        </Modal.Body> */}


                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Username:</div>
                            <Input
                                type="text"
                                name="userName"
                                id="userName"
                                onChange={onChange}
                                value={user.userName === null ? "" : user.userName}
                            />

                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.includes('username') ? false : true}>required!</div>
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('taken') ? false : true}>Username exist!</div>

                        </Modal.Body>



                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Password:</div>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                onChange={onChange}
                                value={user.password === null ? "" : user.password}
                                autocomplete="new-password"
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('passwords') ? false : true}>Required 6 character or more!</div>
                            {/* <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('password') ? false : true}>required</div> */}
                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Confirmation Password:</div>
                            <Input
                                type="password"
                                name="repassword"
                                id="repassword"
                                onChange={onChange}
                                value={user.repassword === null ? "" : user.repassword}
                                autocomplete="new-password"
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('match') ? false : true}>Password doesn't match!</div>
                        </Modal.Body>

                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Section:</div>
                            <Form.Select name={"branchId"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChangeSelect}>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={0} selected={user.branchId == 0 ? true : false}>Unassigned</option>
                                {branches.map((item) => {
                                    return (
                                        <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={item.id} selected={user.branchId == item.id ? true : false}>{item.name}</option>
                                    )
                                })}
                            </Form.Select>
                        </Modal.Body>

                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Position:</div>
                            <Form.Select name={"role"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChangeSelect}>
                                <option style={{ letterSpacing: ".5px", marginBottom: "20px" }} value={0} selected={user.role == 0 ? true : false}> Revenue District Officer  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={1} selected={user.role == 1 ? true : false}>Asst. Revenue District Officer  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={2} selected={user.role == 2 ? true : false}>Chief Assessment Section     </option>
                                <option style={{ letterSpacing: ".5px", marginBottom: "20px" }} value={3} selected={user.role == 3 ? true : false}> Chief Collection Section  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={4} selected={user.role == 4 ? true : false}>Chief ClientSupport System  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={5} selected={user.role == 5 ? true : false}>Chief Compliance Section     </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={6} selected={user.role == 6 ? true : false}>Chief Admin     </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={100} selected={user.role == 100 ? true : false}>Admin     </option>
                            </Form.Select>
                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Status:</div>
                            <Form.Select name={"active"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChangestatus}>
                                <option style={{ letterSpacing: ".5px", marginBottom: "20px" }} value={1} selected={user.active == 1 ? true : false}>ACTIVE</option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={0} selected={user.active == 0 ? true : false}>INACTIVE</option>
                            </Form.Select>
                        </Modal.Body>
                        <Modal.Footer style={{ border: "none" }}>
                            <Button style={{ background: "#F43030", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px" }} variant="outline-danger" onClick={hideModal}>Cancel</Button>
                            <Button style={{ background: "#3B82F6", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px" }} variant="outline-primary" onClick={submitFormAdd}>Save</Button>
                        </Modal.Footer>

                        {isOpenProcessing ? <LoadingSpinner /> : <div />}
                    </Modal>
                    {save ? <FlyingMessage message="Successfully saved!" /> : ""}
                </>


                {/* update user */}
                <>
                    <Modal show={isOpenViewUser} >
                        <Modal.Header style={{ border: "none" }}>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Full Name:</div>
                            <Input
                                type="text"
                                name="fullName"
                                id="fullName"
                                onChange={onChange}
                                value={user.fullName === null ? "" : user.fullName}
                                required
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('fullname') && user.fullName.length == 0 ? false : true}>required!</div>

                        </Modal.Body>
                        {/* <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Email:</div>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                onChange={onChange}
                                value={user.email === null ? "" : user.email}
                                required
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('email') ? false : true}>required or must have (@iloilosupermart.team).</div>

                        </Modal.Body> */}
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Username:</div>
                            <Input
                                type="text"
                                name="userName"
                                id="userName"
                                onChange={onChange}
                                value={user.userName === null ? "" : user.userName}
                            />
                            <div>{error}</div>
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.includes('username') ? false : true}>required!</div>
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('already taken') ? false : true}>Username exist!</div>

                        </Modal.Body>

                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Section:</div>
                            <Form.Select name={"branchId"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChangeSelect}>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={0} selected={user.branchId == 0 ? true : false}>Unassigned</option>
                                {branches.map((item) => {
                                    return (
                                        <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={item.id} selected={user.branchId == item.id ? true : false}>{item.name}</option>
                                    )
                                })}
                            </Form.Select>
                        </Modal.Body>

                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Position:</div>
                            <Form.Select name={"role"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChangeSelect}>
                            <option style={{ letterSpacing: ".5px", marginBottom: "20px" }} value={0} selected={user.role == 0 ? true : false}> Revenue District Officer  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={1} selected={user.role == 1 ? true : false}>Asst. Revenue District Officer  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={2} selected={user.role == 2 ? true : false}>Chief Assessment Section     </option>
                                <option style={{ letterSpacing: ".5px", marginBottom: "20px" }} value={3} selected={user.role == 3 ? true : false}> Chief Collection Section  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={4} selected={user.role == 4 ? true : false}>Chief ClientSupport System  </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={5} selected={user.role == 5 ? true : false}>Chief Compliance Section     </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={6} selected={user.role == 6 ? true : false}>Chief Admin     </option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={100} selected={user.role == 100 ? true : false}>Admin     </option>
                            </Form.Select>
                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Status:</div>
                            <Form.Select name={"active"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChangestatus}>
                                <option style={{ letterSpacing: ".5px", marginBottom: "20px" }} value={1} selected={user.active == 1 ? true : false}>ACTIVE</option>
                                <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={0} selected={user.active == 0 ? true : false}>INACTIVE</option>
                            </Form.Select>
                        </Modal.Body>
                        <Modal.Footer style={{ border: "none" }}>
                            <Button style={{ background: "#F43030", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px" }} variant="outline-danger" onClick={hideViewUserModal}>Cancel</Button>
                            <Button style={{ background: "#3B82F6", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px" }} variant="outline-primary" onClick={submitFormedit}>Save</Button>
                        </Modal.Footer>

                        {isOpenProcessing ? <LoadingSpinner /> : <div />}
                    </Modal>
                    {save ? <FlyingMessage message="Successfully saved!" /> : ""}
                </>


                {/* reset user password */}
                <>
                    <Modal show={isOpenResetPassword} >
                        <Modal.Header style={{ border: "none" }}>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Full Name:</div>
                            <Input
                                type="text"
                                name="fullName"
                                id="fullName"
                                onChange={onChange}
                                value={user.fullName === null ? "" : user.fullName}
                                required
                                readOnly={true}
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('fullname') && user.fullName.length == 0 ? false : true}>required!</div>

                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Password:</div>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                onChange={onChange}
                                value={user.password === null ? "" : user.password}
                                autocomplete="new-password"
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('passwords') ? false : true}>Required 6 character or more!</div>
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('password') ? false : true}>required</div>
                        </Modal.Body>
                        <Modal.Body>
                            <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Confirmation Password:</div>
                            <Input
                                type="password"
                                name="repassword"
                                id="repassword"
                                onChange={onChange}
                                value={user.repassword === null ? "" : user.repassword}
                                autocomplete="new-password"
                            />
                            <div style={{ color: "red", fontSize: "12px" }} hidden={typeof error === 'string' && error.toLowerCase().includes('match') ? false : true}>Password doesn't match!</div>
                        </Modal.Body>
                        <Modal.Footer style={{ border: "none" }}>
                            <Button style={{ background: "#F43030", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px" }} variant="outline-danger" onClick={hideResetPasswordModal}>Cancel</Button>
                            <Button style={{ background: "#3B82F6", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px" }} variant="outline-primary" onClick={submitresetPassword}>Save</Button>
                        </Modal.Footer>

                        {isOpenProcessing ? <LoadingSpinner /> : <div />}
                    </Modal>
                    {save ? <FlyingMessage message="Successfully saved!" /> : ""}
                </>

            </div>
        )
    }
}
export default UserListNotEmail
