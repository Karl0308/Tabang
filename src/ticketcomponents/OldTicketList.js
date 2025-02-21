import React, { Component, useState, useEffect, Children } from "react";
import { Container, Row, Col, Input, Label, Table } from "reactstrap";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import LoadingSpinner from "./LoadingSpinner";
import { APIURLS } from "./APIURLS";
import CopyButton from "./components/CopyButton";
import DrawerMenu from "./DrawerMenu";
import Select from 'react-select'
import FileInputComponent from "./components/FileInputComponent";
// import ModalViewImage from "./components/ModalViewImage"


import { useMsal } from '@azure/msal-react';
import ViewTicket from "./ticketcomponents/ViewTicket";
// import { createClaimsTable } from '../utils/claimUtils';
const TicketList = (props) => {

    // const tokenClaims = createClaimsTable(props.idTokenClaims);

    const initialTicketState = {
        id: 0,
        ticketNumber: "",
        calledIn: "2023-07-06T05:54:23.098Z",
        title: "",
        description: "",
        status: 0,
        assigneeId: 0,
        reporterId: 0,
        branchId: 0,
        currentUserId: localStorage.getItem("id"),
        file: []
    };
    const [ticket, setTicket] = useState({
        id: 0,
        ticketNumber: "",
        calledIn: "2023-07-06T05:54:23.098Z",
        title: "",
        description: "",
        status: 0,
        assigneeId: 0,
        reporterId: 0,
        branchId: 0,
        currentUserId: localStorage.getItem("id"),
        file: []
    });

    const [ticketComment, setTicketComment] = useState({
        id: 0,
        comment: "",
        created: "2023-09-08T07:51:31.050Z",
        ticketId: 0,
        userId: 0
    });

    const [filter, setFilter] = useState({
        search: "",
        status: 1,
        userOption: []
    });


    const [users, setUsers] = useState([]);

    const [itemsData, setItems] = useState([]);
    const [ticketHistories, setTicketHistories] = useState([]);
    const [ticketComments, setTicketComments] = useState([]);
    const [ticketAttachments, setTicketAttachments] = useState([]);
    const [allitemsData, setAllItems] = useState([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isOpenHistory, setIsOpenHistory] = React.useState(false);
    const [isOpenComment, setIsOpenComment] = React.useState(false);
    const [isOpenCommentAndHistory, setIsOpenCommentAndHistory] = React.useState(false);
    const [isOpenProcessing, setisOpenProcessing] = useState(false);
    const [isLoadingComment, setisLoadingComment] = useState(false);
    const [isOpenProcessingTable, setisOpenProcessingTable] = useState(false);
    const [pages, setPages] = useState(0);
    const [statusColor, setStatusColor] = useState("#F5A314");
    const [isShowDescriptionError, setisShowDescriptionError] = useState("none")
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
    const [showResolution, setshowResolution] = useState(false);
    const [resolution, setResolution] = useState("");
    // const [statusFilter, setStatusFilter] = useState(1);
    const [branches, setBranches] = useState([]);
    const [lastTicketStatus, setLastTicketStatus] = useState();

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 600);
    };

    const AssigneeList = [
        { value: 'ALL', label: 'ALL' },
        { value: (parseInt(localStorage.getItem('id'))), label: 'Current User' },
        { value: 'Unassigned', label: 'Unassigned' },
        ...users.filter(x => x.role !== 2)
            .sort((a, b) => a.fullName.localeCompare(b.fullName))
            .map((user) => ({ value: user.id, label: user.fullName }))

    ];

    const onChangeUserFilter = (e) => {

        setFilter(filter => ({
            ...filter,
            userOption: e
        }));

        // setItems(allitemsData);
        // if (e.some(option => option.value === 'ALL') || e.length == 0) {
        //     setItems(allitemsData);
        // }
        // else {

        //     const filterValues = e.map(option => option.value);

        //     const filter = allitemsData.filter(item => filterValues.includes(item.assigneeId));

        //     let combinedFilter = filter;

        //     if (e.some(option => option.value === 'Unassigned')) {
        //         const filter2 = allitemsData.filter(item => item.assigneeId == null);
        //         combinedFilter = combinedFilter.concat(filter2);
        //     }

        //     if (e.some(option => option.value === 'CurrentUser')) {
        //         const filter3 = allitemsData.filter(item => item.assigneeId == localStorage.getItem('id'));
        //         combinedFilter = combinedFilter.concat(filter3);
        //     }

        //     // Remove duplicates from the combinedFilter array
        //     const uniqueCombinedFilter = Array.from(new Set(combinedFilter));

        //     setItems(uniqueCombinedFilter);
        // }

    };

    // const handleFileOpen = (file) => {
    //     if (file.contentType.startsWith('image/')) {
    //         // Display image
    //         const img = new Image();
    //         img.src = `data:${file.contentType};base64,${file.content}`;
    //         const newWindow = window.open();
    //         newWindow.document.write('<html><head><title>File Preview</title></head><body></body></html>');
    //         newWindow.document.body.appendChild(img);


    //     } else {
    //         // Provide a download link for other types of files
    //         const blob = new Blob([Uint8Array.from(atob(file.content), c => c.charCodeAt(0))], { type: file.contentType });
    //         const fileUrl = URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = fileUrl;
    //         a.download = file.fileName;
    //         a.target = '_blank';
    //         document.body.appendChild(a);
    //         a.click();
    //         document.body.removeChild(a);
    //         URL.revokeObjectURL(fileUrl);
    //     }
    // };

    const handleFileOpen = (file) => {
        if (file.contentType.startsWith('image/')) {
            //   // Display image
            //   const img = new Image();
            //   img.src = `data:${file.contentType};base64,${file.content}`;
            //   const newWindow = window.open();
            //   newWindow.document.write('<html><head><title>File Preview</title></head><body></body></html>');
            //   newWindow.document.body.appendChild(img);

            const modalContainer = document.createElement('div');
            modalContainer.style.position = 'fixed';
            modalContainer.style.top = '0';
            modalContainer.style.left = '0';
            modalContainer.style.width = '100%';
            modalContainer.style.height = '100%';
            modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            modalContainer.style.display = 'flex';
            modalContainer.style.alignItems = 'center';
            modalContainer.style.justifyContent = 'center';
            modalContainer.style.zIndex = '9999';

            const modalImage = new Image();
            modalImage.src = `data:${file.contentType};base64,${file.content}`;
            modalImage.style.maxWidth = '90%';
            modalImage.style.maxHeight = '90%';

            modalContainer.appendChild(modalImage);

            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.background = 'none';
            closeButton.style.border = 'none';
            closeButton.style.cursor = 'pointer';
            closeButton.addEventListener('click', () => {
                document.body.removeChild(modalContainer);
            });

            modalContainer.appendChild(closeButton);

            document.body.appendChild(modalContainer);

        } else if (file.contentType.startsWith('video/')) {
            // Display video
            const modalContainer = document.createElement('div');
            modalContainer.style.position = 'fixed';
            modalContainer.style.top = '0';
            modalContainer.style.left = '0';
            modalContainer.style.width = '100%';
            modalContainer.style.height = '100%';
            modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            modalContainer.style.display = 'flex';
            modalContainer.style.alignItems = 'center';
            modalContainer.style.justifyContent = 'center';
            modalContainer.style.zIndex = '9999';

            if (file.contentType.startsWith('image/')) {
                // Display image
                const modalImage = new Image();
                modalImage.src = `data:${file.contentType};base64,${file.content}`;
                modalImage.style.maxWidth = '90%';
                modalImage.style.maxHeight = '90%';
                modalContainer.appendChild(modalImage);
            } else if (file.contentType.startsWith('video/')) {
                // Display video
                const modalVideo = document.createElement('video');
                modalVideo.src = `data:${file.contentType};base64,${file.content}`;
                modalVideo.style.maxWidth = '90%';
                modalVideo.style.maxHeight = '90%';
                modalVideo.controls = true; // Enable video controls
                modalContainer.appendChild(modalVideo);
            }

            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.background = 'none';
            closeButton.style.border = 'none';
            closeButton.style.cursor = 'pointer';
            closeButton.addEventListener('click', () => {
                document.body.removeChild(modalContainer);
            });

            modalContainer.appendChild(closeButton);

            document.body.appendChild(modalContainer);
        } else {
            // Provide a download link for other types of files
            const blob = new Blob([Uint8Array.from(atob(file.content), c => c.charCodeAt(0))], { type: file.contentType });
            const fileUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = file.fileName;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(fileUrl);
        }
    };

    const handleFileOpenComment = (file) => {
        const fileUrl = URL.createObjectURL(file);
        window.open(fileUrl, '_blank');
    };

    const { instance } = useMsal();
    async function getuserData() {
        try {
            const res = await axios.post(APIURLS.user.loginEmail + '?email=' + props.idTokenClaims.preferred_username)

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('fullname', res.data.fullName);
            localStorage.setItem('email', props.idTokenClaims.preferred_username);
            localStorage.setItem('roletext', res.data.roleText);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('id', res.data.id);
            localStorage.setItem('enhancement', "enhancement");
            FetchData();
            FetchUsers();
            FetchBranches();
        } catch (error) {
            console.log(error);
            // alert(error);
            localStorage.setItem('errorlogin', "Email not registered. Contact your administrator!");
        }
    }

    const showModal = (data) => {
        FetchTicketHistories(data.id);
        FetchTicketComments(data.id);
        FetchTicketAttachments(data.id);
        setIsOpen(true);
        data.oldStatus = data.status;
        data.currentUserId = localStorage.getItem("id");
        setTicket(data);
        ticketComment.comment = "";
        ticketComment.ticketId = data.id;
        ticketComment.userId = data.currentUserId;
        if (data.status == 0) {
            setStatusColor("#10B981")
        }
        if (data.status == 1) {
            setStatusColor("#F5A314")
        }
        if (data.status == 2) {
            setStatusColor("#FF0000")
        }
        if (data.status == 3) {
            setStatusColor("#67A8E3")
        }
    };

    const hideModal = () => {
        setIsOpen(false);
        setIsOpenComment(false);
        setIsOpenHistory(false);
        setIsOpenCommentAndHistory(false);
        setTicket(initialTicketState);
        // setTicketAttachments([]);
    };

    const showCommentModal = () => {
        setLastTicketStatus(parseInt(ticket.status));
        setIsOpenComment(true);
        setIsOpenCommentAndHistory(true);
    };
    const showHistoryModal = () => {
        setLastTicketStatus(parseInt(ticket.status));
        setIsOpenHistory(true);
        setIsOpenCommentAndHistory(true);
    };

    const showAttachmentModal = () => {
        setIsOpenHistory(true);
        setIsOpenCommentAndHistory(true);
    };


    const BackToTicketView = () => {
        setIsOpenHistory(false);
        setIsOpenComment(false);
        setshowResolution(false);
        setIsOpenCommentAndHistory(false);
        if (lastTicketStatus == 0) {
            setStatusColor("#10B981")
        }
        if (lastTicketStatus == 1) {
            setStatusColor("#F5A314")
        }
        if (lastTicketStatus == 2) {
            setStatusColor("#FF0000")
        }
        if (lastTicketStatus == 3) {
            setStatusColor("#67A8E3")
        }

        setTicket({
            ...ticket,
            status: lastTicketStatus
        });
    };


    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!localStorage.getItem("enhancement")) {
            localStorage.clear();
        }
        if (localStorage.getItem('id') == null) {
            getuserData();
        }
        setFilter(filter => ({
            ...filter,
            status: localStorage.getItem('roletext') == 'reporter' ? 4 : 1,
        }));

        FetchData();
        FetchUsers();
        FetchBranches();
    }, []);
    // const config = {
    //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    // };

    const axiosInstanceGet = axios.create({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    });
    const FetchData = () => {

        axiosInstanceGet.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`;

        setisOpenProcessingTable(true);
        axiosInstanceGet.get(APIURLS.ticket.getTickets)
            .then(res => res.data)
            .then(
                (result) => {
                    setItems(result);
                    setAllItems(result);
                    setPages((result.length / 10))
                    setisOpenProcessingTable(false);
                },
                (error) => {
                    if (error.response.status === 401) {
                        getuserData();
                    }
                    console.log(error);
                    setisOpenProcessing(false);
                }
            )
    }

    const FetchBranches = () => {
        setisOpenProcessingTable(true);
        axiosInstanceGet.get(APIURLS.branch.getBranches)
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
    const FetchTicketHistories = (id) => {
        setisOpenProcessingTable(true);
        axiosInstanceGet.get(APIURLS.ticket.getTicketHistoriesById + id)
            .then(res => res.data)
            .then(
                (result) => {
                    setTicketHistories(result);
                    setisOpenProcessingTable(false);
                },
                (error) => {
                    console.log(error);
                    setisOpenProcessing(false);
                }
            )
    }

    const FetchTicketComments = (id) => {
        setisOpenProcessingTable(true);
        axiosInstanceGet.get(APIURLS.ticket.getTicketCommentsById + id)
            .then(res => res.data)
            .then(
                (result) => {
                    setTicketComments(result);
                    setisOpenProcessingTable(false);
                },
                (error) => {
                    console.log(error);
                    setisOpenProcessing(false);
                }
            )
    }

    const FetchTicketAttachments = (id) => {
        setisOpenProcessingTable(true);
        setisOpenProcessing(true);
        axiosInstanceGet.get(APIURLS.ticket.getTicketAttachmentById + id)
            .then(res => res.data)
            .then(
                (result) => {
                    setTicketAttachments(result);
                    setisOpenProcessing(false);
                    setisOpenProcessingTable(false);
                },
                (error) => {
                    console.log(error);
                    setisOpenProcessing(false);
                    setisOpenProcessing(false);
                }
            )
    }

    const FetchUsers = () => {
        setisOpenProcessingTable(true);
        axiosInstanceGet.get(APIURLS.user.getUsers)
            .then(res => res.data)
            .then(
                (result) => {
                    setUsers(result);
                    setisOpenProcessingTable(false);
                },
                (error) => {

                }
            )
    }


    const UpdateTicket = (e) => {
        if (isOpenProcessing) {
            return;
        }

        if (!resolution && e.target.id === "resolution") {
            return;
        }
        ticket.resolution = resolution;
        if (showResolution) {
            ticket.status = 0;
        }
        if (ticket.description == "") {
            setisShowDescriptionError("block")
            return;
        }
        else {

            setisShowDescriptionError("none")
        }
        e.preventDefault();
        setisOpenProcessing(true);
        ticket.file = [];
        axiosInstanceGet.post(APIURLS.ticket.updateTicket, ticket)
            .then(
                (result) => {
                    setIsOpen(false);
                    window.location.reload(false);
                },
                (error) => {
                    console.log(error);
                    alert(error);
                    setisOpenProcessing(false);
                }
            );
    }


    const handleFileChange = (filespick) => {
        setSelectedFiles(filespick);
    };

    const handleDeleteFile = (index) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);

        // Assuming you have an input element with the id 'fileInput'
        const fileInput = document.getElementById('attachment');

        if (fileInput) {
            // Create a new FileList excluding the deleted file
            const newFileList = new DataTransfer();
            updatedFiles.forEach((file) => newFileList.items.add(file));

            // Update the input element's files with the new FileList
            fileInput.files = newFileList.files;
        }
    };

    const addTicketComment = (e) => {
        e.preventDefault();
        if (isOpenProcessing) {
            return;
        }
        if (!ticketComment.comment && selectedFiles.length < 1) {
            return;
        }

        const formData = new FormData();

        selectedFiles.forEach((file) => {
            formData.append('files', file);
        });
        // Append other form data to formData
        formData.append('comment', ticketComment.comment);
        formData.append('created', ticketComment.created);
        formData.append('ticketId', ticketComment.ticketId.toString());
        formData.append('userId', ticketComment.userId.toString());
        // ... append other fields as needed ...


        setisOpenProcessing(true);
        axiosInstanceGet.post(APIURLS.ticket.saveTicketComment, formData)
            .then(
                (result) => {
                    result.data.userFullName = localStorage.getItem("fullname");
                    result.files = selectedFiles;
                    setTicketComments([...ticketComments, result.data]);
                    ticketComment.comment = "";
                    setisOpenProcessing(false);

                    // Reset the file input to its natural state
                    if (document.getElementById("attachment")) {
                        document.getElementById("attachment").value = '';
                    }

                    // Clear the selected files after submission
                    setSelectedFiles([]);

                    FetchTicketComments(ticket.id);
                },
                (error) => {
                    console.log(error);
                    setisOpenProcessing(false);
                }
            );
    }

    const onChange = (e) => {

        setTicket({
            ...ticket,
            [e.target.name]: e.target.value
        });
    };

    const onChangeTicketComment = (e) => {

        setTicketComment({
            ...ticketComment,
            [e.target.name]: e.target.value
        });
    };

    const ChangeStatusFilter = (e) => {

        setFilter(filter => ({
            ...filter,
            status: parseInt(e.target.value)
        }));


        // setItems(allitemsData);
        // if (parseInt(e.target.value) == 4) {
        //     setItems(allitemsData);
        // }
        // else {
        //     const filter = allitemsData.filter(item => item.status == parseInt(e.target.value));
        //     setItems(filter);
        // }

    };

    const onChangeSelect = (e) => {

        setLastTicketStatus(parseInt(ticket.status));
        if (e.target.name == "status") {
            if (parseInt(e.target.value) == 0) {
                setshowResolution(true);
                setIsOpenCommentAndHistory(true);
            }
            else {

                if (parseInt(e.target.value) == 0) {
                    setStatusColor("#10B981")
                }
                if (parseInt(e.target.value) == 1) {
                    setStatusColor("#F5A314")
                }
                if (parseInt(e.target.value) == 2) {
                    setStatusColor("#FF0000")
                }
                if (parseInt(e.target.value) == 3) {
                    setStatusColor("#67A8E3")
                }
            }
        }
        setTicket({
            ...ticket,
            [e.target.name]: parseInt(e.target.value)
        });
    };
    const onChangeResolution = (e) => {
        setResolution(e.target.value);
    };

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
    const TicketSearch = event => {

        setFilter(filter => ({
            ...filter,
            search: event.target.value
        }));

        // setItems(allitemsData);
        // if (event.target.value !== '') {
        //     const searchres = allitemsData.filter(item => item.ticketNumber.toLowerCase().includes(event.target.value.toLowerCase()));
        //     setItems(searchres);
        // }
        // else { setItems(allitemsData); }

    };

    const badgeStatus = (name) => {
        var statusname = 'success';
        var size = isSmallScreen ? "16vw" : "";
        var sizeLongText = isSmallScreen ? "18vw" : "";
        var sizeLonglongText = isSmallScreen ? "23vw" : "";
        if (name == 'Done') {
            statusname = 'success'
            return <div className="dot-container-done">Done</div>
        }
        else if (name == 'Open') {
            statusname = 'secondary'
            return <div className="dot-container-open">Open</div>
        }
        else if (name == 'On Hold') {
            statusname = 'secondary'
            return <div className="dot-container-onhold">On Hold</div>
        }
        else if (name == 'In Progress') {
            statusname = 'primary'
            return <div className="dot-container-inprogress">In Progress</div>
        }

    };

    const getTicketList = () => {
        if (localStorage.getItem("role") == 1) {
            return (
                items.filter
                    (x =>
                        (filter.status === 4 ? x.status !== filter.status : x.status === filter.status) &&
                        (filter.search !== "" ? x.ticketNumber.toLowerCase().includes(filter.search.toLowerCase()) : true) &&
                        (filter.userOption.length === 0 || filter.userOption.some(option => option.value === 'ALL') ? true :
                            // (
                            //     filter.userOption.some(option => option.value === 'CurrentUser') &&
                            //     (x.assigneeId === localStorage.getItem('id'))
                            // )
                            // ||
                            (
                                filter.userOption.some(option => option.value === 'Unassigned') &&
                                (x.assigneeId === null)
                            )
                            ||
                            (
                                filter.userOption.some(option => option.value && option.value === x.assigneeId)
                            )
                        )
                    )
                    .map((item) => {
                        return (
                            <tr key={item.id}>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>
                                    <CopyButton text={window.location.origin + "/ticketview/" + item.ticketNumber} />
                                    {item.ticketNumber}
                                </td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.calledInText}</td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.title}</td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.branchName}</td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{getUser(item.reporterId)}</td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{getUser(item.assigneeId)}</td>
                                <td style={{ textAlign: "center" }}>
                                    <div style={{ display: "inline-block" }}>
                                        {badgeStatus(item.statusName)}
                                    </div>
                                </td>
                                <td><Button style={{ width: "72px", height: "25px", border: "1px solid #EDEDED", color: "#A4AEB7", padding: "0px", borderRadius: "15px", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px" }} variant="outline-secondary" onClick={() => showModal(item)} >View</Button></td>
                            </tr>
                        )
                    }))
        }
        else if (localStorage.getItem("role") == 2) {
            return (
                items.filter
                    (x =>
                        (filter.status === 4 ? x.status !== filter.status : x.status === filter.status) &&
                        (filter.search !== "" ? x.ticketNumber.toLowerCase().includes(filter.search.toLowerCase()) : true) &&
                        (filter.userOption.length === 0 || filter.userOption.some(option => option.value === 'ALL') ? true :
                            // (
                            //     filter.userOption.some(option => option.value === 'CurrentUser') &&
                            //     (x.assigneeId === localStorage.getItem('id'))
                            // )
                            // ||
                            (
                                filter.userOption.some(option => option.value === 'Unassigned') &&
                                (x.assigneeId === null)
                            )
                            ||
                            (
                                filter.userOption.some(option => option.value && option.value === x.assigneeId)
                            )
                        )
                    )
                    .map((item) => {
                        return (
                            <tr key={item.id}>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>
                                    <CopyButton text={window.location.origin + "/ticketview/" + item.ticketNumber} />
                                    {item.ticketNumber}
                                </td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.calledInText}</td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.title}</td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.branchName}</td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{getUser(item.reporterId)}</td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{getUser(item.assigneeId)}</td>
                                <td style={{ textAlign: "center" }}>
                                    <div style={{ display: "inline-block" }}>
                                        {badgeStatus(item.statusName)}
                                    </div>
                                </td>
                                <td><Button style={{ width: "72px", height: "25px", border: "1px solid #EDEDED", color: "#A4AEB7", padding: "0px", borderRadius: "15px", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px" }} variant="outline-secondary" onClick={() => showModal(item)} >View</Button></td>
                            </tr>
                        )
                    }))
        }
        else {
            return (

                items.filter
                    (x =>
                        (filter.status === 4 ? x.status !== filter.status : x.status === filter.status) &&
                        (filter.search !== "" ? x.ticketNumber.toLowerCase().includes(filter.search.toLowerCase()) : true) &&
                        (filter.userOption.length === 0 || filter.userOption.some(option => option.value === 'ALL') ? true :
                            // (
                            //     filter.userOption.some(option => option.label === 'Current User') &&
                            //     (x.assigneeId === localStorage.getItem('id'))
                            // )
                            // ||
                            (
                                filter.userOption.some(option => option.value === 'Unassigned') &&
                                (x.assigneeId === null)
                            )
                            ||
                            (
                                filter.userOption.some(option => option.value && option.value === x.assigneeId)
                            )
                        )
                    )
                    .map((item) => {
                        return (
                            <tr key={item.id}>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>
                                    <CopyButton text={window.location.origin + "/ticketview/" + item.ticketNumber} />
                                    {item.ticketNumber}
                                </td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.calledInText}</td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.title}</td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.branchName}</td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{getUser(item.reporterId)}</td>
                                <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{getUser(item.assigneeId)}</td>
                                <td style={{ textAlign: "center" }}>
                                    <div style={{ display: "inline-block" }}>
                                        {badgeStatus(item.statusName)}
                                    </div>
                                </td>
                                <td><Button style={{ width: "72px", height: "25px", border: "1px solid #EDEDED", color: "#A4AEB7", padding: "0px", borderRadius: "15px", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px" }} variant="outline-secondary" onClick={() => showModal(item)} >View</Button></td>
                            </tr>
                        )
                    }))
        }

    };
    const getTicketList2 = () => {
        if (localStorage.getItem("role") == 1) {
            return (
                items.filter
                    (x =>
                        (filter.status === 4 ? x.status !== filter.status : x.status === filter.status) &&
                        (filter.search !== "" ? x.ticketNumber.toLowerCase().includes(filter.search.toLowerCase()) : true) &&
                        (filter.userOption.length === 0 || filter.userOption.some(option => option.value === 'ALL') ? true :
                            // (
                            //     filter.userOption.some(option => option.value === 'CurrentUser') &&
                            //     (x.assigneeId === localStorage.getItem('id'))
                            // )
                            // ||
                            (
                                filter.userOption.some(option => option.value === 'Unassigned') &&
                                (x.assigneeId === null)
                            )
                            ||
                            (
                                filter.userOption.some(option => option.value && option.value === x.assigneeId)
                            )
                        )
                    )
                    .map((item) => {
                        return (
                            <tr key={item.id} onClick={() => showModal(item)}>
                                <td style={{ color: "##000000", fontSize: "2.5vw", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>
                                    {/* <CopyButton text={window.location.origin + "/ticketview/" + item.ticketNumber} /> */}
                                    {item.ticketNumber}
                                </td>
                                <td style={{ color: "##000000", fontSize: "2.5vw", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.calledInText}</td>
                                <td style={{ color: "##000000", fontSize: "2.5vw", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.title}</td>
                                <td style={{ color: "##000000", fontSize: "2.5vw", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.branchName}</td>
                            </tr>
                        )
                    }))
        }
        else if (localStorage.getItem("role") == 2) {
            return (
                items.filter
                    (x =>
                        (filter.status === 4 ? x.status !== filter.status : x.status === filter.status) &&
                        (filter.search !== "" ? x.ticketNumber.toLowerCase().includes(filter.search.toLowerCase()) : true) &&
                        (filter.userOption.length === 0 || filter.userOption.some(option => option.value === 'ALL') ? true :
                            // (
                            //     filter.userOption.some(option => option.value === 'CurrentUser') &&
                            //     (x.assigneeId === localStorage.getItem('id'))
                            // )
                            // ||
                            (
                                filter.userOption.some(option => option.value === 'Unassigned') &&
                                (x.assigneeId === null)
                            )
                            ||
                            (
                                filter.userOption.some(option => option.value && option.value === x.assigneeId)
                            )
                        )
                    )
                    .map((item) => {
                        return (
                            <tr key={item.id} onClick={() => showModal(item)}>
                                <td style={{ color: "##000000", fontSize: "2.5vw", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>
                                    {/* <CopyButton text={window.location.origin + "/ticketview/" + item.ticketNumber} /> */}
                                    {item.ticketNumber}
                                </td>
                                <td style={{ color: "##000000", fontSize: "2.5vw", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.calledInText}</td>
                                <td style={{ color: "##000000", fontSize: "2.5vw", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.title}</td>
                                <td style={{ color: "##000000", fontSize: "2.5vw", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.branchName}</td>
                            </tr>
                        )
                    }))
        }
        else {
            return (

                items.filter
                    (x =>
                        (filter.status === 4 ? x.status !== filter.status : x.status === filter.status) &&
                        (filter.search !== "" ? x.ticketNumber.toLowerCase().includes(filter.search.toLowerCase()) : true) &&
                        (filter.userOption.length === 0 || filter.userOption.some(option => option.value === 'ALL') ? true :
                            // (
                            //     filter.userOption.some(option => option.label === 'Current User') &&
                            //     (x.assigneeId === localStorage.getItem('id'))
                            // )
                            // ||
                            (
                                filter.userOption.some(option => option.value === 'Unassigned') &&
                                (x.assigneeId === null)
                            )
                            ||
                            (
                                filter.userOption.some(option => option.value && option.value === x.assigneeId)
                            )
                        )
                    )
                    .map((item) => {
                        return (
                            <tr key={item.id} onClick={() => showModal(item)}>
                                <td style={{ color: "##000000", fontSize: "2.5vw", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>
                                    {/* <CopyButton text={window.location.origin + "/ticketview/" + item.ticketNumber} /> */}
                                    {item.ticketNumber}
                                </td>
                                <td style={{ color: "##000000", fontSize: "2.5vw", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.calledInText}</td>
                                <td style={{ color: "##000000", fontSize: "2.5vw", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.title}</td>
                                <td style={{ color: "##000000", fontSize: "2.5vw", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.branchName}</td>
                            </tr>
                        )
                    }))
        }

    };

    const getTicketListSmallScreen = () => {
        if (localStorage.getItem("role") == 1) {
            return (
                items.filter
                    (x =>
                        (filter.status === 4 ? x.status !== filter.status : x.status === filter.status) &&
                        (filter.search !== "" ? x.ticketNumber.toLowerCase().includes(filter.search.toLowerCase()) : true) &&
                        (filter.userOption.length === 0 || filter.userOption.some(option => option.value === 'ALL') ? true :
                            // (
                            //     filter.userOption.some(option => option.value === 'CurrentUser') &&
                            //     (x.assigneeId === localStorage.getItem('id'))
                            // )
                            // ||
                            (
                                filter.userOption.some(option => option.value === 'Unassigned') &&
                                (x.assigneeId === null)
                            )
                            ||
                            (
                                filter.userOption.some(option => option.value && option.value === x.assigneeId)
                            )
                        )
                    )
                    .map((item) => {
                        return (
                            <tr key={item.id}>
                                <div style={{ width: '100%', borderBottom: 'solid #D3D3D3 1px', padding: '20px', marginTop: '5px', marginBottom: '5px', borderRadius: '0px', fontSize: '3.5vw' }}>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ textAlign: "left", fontWeight: 'bold' }}>TICKET ID: {item.ticketNumber}</div>
                                        <div style={{ textAlign: "right", color: 'gray' }}>{item.calledInText}</div>
                                    </div>

                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: "10px" }}>
                                        <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", fontSize: '2.5vw' }}>Branch: {item.branchName}</td>
                                    </div>

                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: "30px" }}>
                                        <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", fontSize: '2.5vw' }}>Reporter: {getUser(item.reporterId)}</td>
                                        <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", fontSize: '2.5vw' }}>Assignee: {getUser(item.assigneeId)}</td>
                                    </div>

                                    <div style={{ marginTop: '16px', marginBottom: '20px', textAlign: 'left' }}>{item.description} </div>

                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingLeft: '10px', paddingRight: '10px' }}>
                                        {badgeStatus(item.statusName)}
                                        <Button style={{ width: "18vw", height: "25px", border: "1px solid #EDEDED", color: "#A4AEB7", padding: "0px", borderRadius: "15px", fontSize: "3.5vw", fontWeight: "700", letterSpacing: "0.78px" }} variant="outline-secondary" onClick={() => showModal(item)} >View</Button>
                                    </div>
                                </div>
                            </tr>
                        )
                    }))
        }
        else if (localStorage.getItem("role") == 2) {
            return (
                items.filter
                    (x =>
                        (filter.status === 4 ? x.status !== filter.status : x.status === filter.status) &&
                        (filter.search !== "" ? x.ticketNumber.toLowerCase().includes(filter.search.toLowerCase()) : true) &&
                        (filter.userOption.length === 0 || filter.userOption.some(option => option.value === 'ALL') ? true :
                            // (
                            //     filter.userOption.some(option => option.value === 'CurrentUser') &&
                            //     (x.assigneeId === localStorage.getItem('id'))
                            // )
                            // ||
                            (
                                filter.userOption.some(option => option.value === 'Unassigned') &&
                                (x.assigneeId === null)
                            )
                            ||
                            (
                                filter.userOption.some(option => option.value && option.value === x.assigneeId)
                            )
                        )
                    )
                    .map((item) => {
                        return (
                            <tr key={item.id}>
                                <div style={{ width: '100%', borderBottom: 'solid #D3D3D3 1px', padding: '20px', marginTop: '5px', marginBottom: '5px', borderRadius: '0px', fontSize: '3.5vw' }}>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ textAlign: "left", fontWeight: 'bold' }}>TICKET ID: {item.ticketNumber}</div>
                                        <div style={{ textAlign: "right", color: 'gray' }}>{item.calledInText}</div>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: "10px" }}>
                                        <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", fontSize: '2.5vw' }}>Branch: {item.branchName}</td>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: "30px" }}>
                                        <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", fontSize: '2.5vw' }}>Reporter: {getUser(item.reporterId)}</td>
                                        <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", fontSize: '2.5vw' }}>Assignee: {getUser(item.assigneeId)}</td>
                                    </div>


                                    <div style={{ marginTop: '16px', marginBottom: '20px', textAlign: 'left' }}>{item.description} </div>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingLeft: '10px', paddingRight: '10px' }}>
                                        {badgeStatus(item.statusName)}
                                        <Button style={{ width: "18vw", height: "25px", border: "1px solid #EDEDED", color: "#A4AEB7", padding: "0px", borderRadius: "15px", fontSize: "3.5vw", fontWeight: "700", letterSpacing: "0.78px" }} variant="outline-secondary" onClick={() => showModal(item)} >View</Button>
                                    </div>
                                </div>
                            </tr>
                        )
                    }))
        }
        else {
            return (
                items.filter
                    (x =>
                        (filter.status === 4 ? x.status !== filter.status : x.status === filter.status) &&
                        (filter.search !== "" ? x.ticketNumber.toLowerCase().includes(filter.search.toLowerCase()) : true) &&
                        (filter.userOption.length === 0 || filter.userOption.some(option => option.value === 'ALL') ? true :
                            // (
                            //     filter.userOption.some(option => option.value === 'CurrentUser') &&
                            //     (x.assigneeId === localStorage.getItem('id'))
                            // )
                            // ||
                            (
                                filter.userOption.some(option => option.value === 'Unassigned') &&
                                (x.assigneeId === null)
                            )
                            ||
                            (
                                filter.userOption.some(option => option.value && option.value === x.assigneeId)
                            )
                        )
                    )
                    .map((item) => {
                        return (
                            <Button style={{ background: "none", border: "none" }} onClick={() => showModal(item)} >
                                <tr key={item.id}>
                                    <div style={{ width: '100%', padding: '20px', marginTop: '5px', marginBottom: '5px', borderRadius: '0px', fontSize: '3.5vw' }}>
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                            <div style={{ textAlign: "left", fontWeight: 'bold' }}>{item.ticketNumber}</div>
                                            <div style={{ textAlign: "right", color: 'gray' }}>{item.calledInText}</div>
                                        </div>
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: "10px" }}>
                                            <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", fontSize: '2.5vw' }}>Branch: {item.branchName}</td>
                                        </div>
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: "30px" }}>
                                            <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", fontSize: '2.5vw' }}>Reporter: {getUser(item.reporterId)}</td>
                                            <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", fontSize: '2.5vw' }}>Assignee: {getUser(item.assigneeId)}</td>
                                        </div>

                                        <div style={{ marginTop: '16px', marginBottom: '20px', textAlign: 'left' }}>{item.title} </div>
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingLeft: '10px', paddingRight: '10px' }}>
                                            {badgeStatus(item.statusName)}
                                        </div>
                                    </div>
                                </tr>
                            </Button>

                            // <tr key={item.id}>
                            //     <div style={{ width: '100%', borderBottom: 'solid #D3D3D3 1px', padding: '20px', marginTop: '5px', marginBottom: '5px', borderRadius: '0px', fontSize: '3.5vw' }}>
                            //         <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                            //             <div style={{ textAlign: "left", fontWeight: 'bold' }}>TICKET ID: {item.ticketNumber}</div>
                            //             <div style={{ textAlign: "right", color: 'gray' }}>{item.calledInText}</div>
                            //         </div>
                            //         <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: "30px" }}>
                            //             <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", fontSize: '2.5vw' }}>Reporter: {getUser(item.reporterId)}</td>
                            //             <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", fontSize: '2.5vw' }}>Assignee: {getUser(item.assigneeId)}</td>
                            //         </div>

                            //         <div style={{ marginTop: '16px', marginBottom: '20px', textAlign: 'left' }}>{item.description} </div>
                            //         <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingLeft: '10px', paddingRight: '10px' }}>
                            //             {badgeStatus(item.statusName)}
                            //             <Button style={{ width: "18vw", height: "25px", border: "1px solid #EDEDED", color: "#A4AEB7", padding: "0px", borderRadius: "15px", fontSize: "3.5vw", fontWeight: "700", letterSpacing: "0.78px" }} variant="outline-secondary" onClick={() => showModal(item)} >View</Button>
                            //         </div>
                            //     </div>
                            // </tr>
                        )
                    }))
        }

    };

    const getUser = (id) => {
        const reporter = users.find(x => x.id == id);
        if (reporter == undefined) { return "Unassigned"; }
        else { return reporter.fullName; }

    };

    if (isSmallScreen) {
        return (

            <div>
                <div style={componentStyle}>
                    <div style={{ paddingTop: "12px", paddingBottom: "6px", marginBottom: "20px", borderBottom: "solid 1px black" }}>
                        <div className="d-flex flex-row">
                            <div className="p-2" style={{ fontSize: "3vw", marginTop: "8px" }}>Ticket:</div>
                            <div className="p-2" style={{ width: "100%" }}>
                                <Input
                                    type="text"
                                    onChange={TicketSearch}
                                    className="searchname"
                                    style={{ fontSize: "3vw" }}
                                /></div>
                        </div>
                        <div className="d-flex flex-row">

                            <div className="p-2" style={{ fontSize: "3vw", marginTop: "8px" }}>Status:</div>
                            <div className="p-2" style={{ width: "100%" }}>

                                <Form.Select value={filter.status} name={"status"}
                                    style={{ fontSize: "3vw", paddingLeft: "20px", letterSpacing: ".5px" }}
                                    onChange={ChangeStatusFilter}
                                >
                                    <option value={4} selected={filter.status == 4}>All</option>
                                    <option value={1} selected={filter.status == 1}>Open</option>
                                    <option value={2} selected={filter.status == 2}>On Hold</option>
                                    <option value={3} selected={filter.status == 3}>In Progress</option>
                                    <option value={0} selected={filter.status == 0}>Done</option>
                                </Form.Select>

                            </div>
                        </div><div className="d-flex flex-row">
                            <div className="p-2" style={{ fontSize: "3vw", marginTop: "10px", display: localStorage.getItem("roletext") === "reporter" ? "none" : "inline" }}>Assignee:</div>
                            <div className="p-2" style={{ fontSize: "3vw", marginTop: "px", width: "300px", width: "100%", display: localStorage.getItem("roletext") === "reporter" ? "none" : "inline" }}>

                                <Select isMulti options={AssigneeList}
                                    onChange={onChangeUserFilter}
                                />
                            </div>
                        </div>

                    </div>
                    <div>
                        <Table responsive>
                            <thead>
                                <tr style={{ backgroundColor: "white" }}>
                                    <th style={{ minWidth: "160px" }}>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "3.5vw", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('ticketNumber')}
                                            className={getClassNamesFor('ticketNumber')}
                                        >
                                            Ticket
                                        </Button>
                                    </th>
                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "3.5vw", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('id')}
                                            className={getClassNamesFor('id')}
                                        >
                                            Date
                                        </Button>
                                    </th>
                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "3.5vw", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('title')}
                                            className={getClassNamesFor('title')}
                                        >
                                            Title
                                        </Button>
                                    </th>

                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "3.5vw", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('branchName')}
                                            className={getClassNamesFor('branchName')}
                                        >
                                            Branch
                                        </Button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {getTicketList2()}
                            </tbody>

                        </Table>
                        {isOpenProcessingTable ? <LoadingSpinner /> : <div />}
                    </div>
                </div>
                <>
                    <Modal show={isOpen} >
                        {/* main view */}
                        <div style={{ display: isOpenCommentAndHistory == true ? "none" : "block" }}>
                            <Modal.Header style={{ border: "none", width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", paddingBottom: "0px" }}>
                                <Modal.Title style={{ color: "#FF0000", fontSize: "21px", letterSpacing: "0.36px", fontWeight: "500" }}>Ticket Details</Modal.Title>
                                <Button style={{ background: "#F43030", color: "white", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px" }} variant="outline-danger" onClick={hideModal}>X</Button>
                            </Modal.Header>

                            <Modal.Header style={{ paddingTop: "0px", paddingBottom: "0px" }}>
                                <div style={{ fontSize: "12px" }}>
                                    {window.location.origin + "/ticketview/" + ticket.ticketNumber}
                                    <CopyButton text={window.location.origin + "/ticketview/" + ticket.ticketNumber} />
                                </div>
                            </Modal.Header>
                            <Modal.Body style={{ fontSize: "3vw" }}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center", marginBottom: "10px" }}>
                                    <div style={{ float: 'left', padding: '10px', boxSizing: "border-box" }}>
                                        <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500", fontSize: "15px" }}>Ticket ID:</div>
                                        <div style={{ fontSize: "15px", color: "#223E58", fontWeight: "100", fontSize: "15px" }}>{ticket.ticketNumber}</div>
                                    </div>
                                    <div style={{ float: 'left', boxSizing: "border-box" }}>
                                        <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500", fontSize: "15px" }}>Branch:</div>
                                        <Form.Select name={"branchId"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px", fontSize: "15px", }} onChange={onChangeSelect}>
                                            <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={0} selected={ticket.branchId == 0 ? true : false}>Unassigned</option>
                                            {branches.map((item) => {
                                                return (
                                                    <option style={{ letterSpacing: ".5px", paddingBottom: "10px", fontSize: "19px", letterSpacing: ".5px", marginBottom: "20px", fontSize: "12px" }} value={item.id} selected={ticket.branchId == item.id ? true : false}>{item.name}</option>
                                                )
                                            })}
                                        </Form.Select>
                                    </div>
                                </div>

                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                                    <div style={{ float: 'left', padding: '10px', boxSizing: "border-box" }}>
                                        <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500", fontSize: "15px" }}>Called In:</div>
                                        <div style={{ fontSize: "15px", color: "#223E58", fontWeight: "100", fontSize: "15px" }}>{ticket.calledInText}</div>
                                    </div>
                                    <div style={{ float: 'right', boxSizing: "border-box", clear: "right" }}>
                                        <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500", fontSize: "15px" }}>Status:</div>
                                        <Form.Select value={ticket.status} name={"status"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px", fontSize: "15px", color: statusColor }} onChange={onChangeSelect} disabled={localStorage.getItem("role") == 2 ? true : false}>
                                            <option style={{ color: "#F5A314", fontSize: "19px", letterSpacing: ".5px", marginBottom: "20px", fontSize: "15px" }} value={1} selected={ticket.status == 1 ? true : false}>Open</option>
                                            <option style={{ color: "#FF0000", fontSize: "19px", letterSpacing: ".5px", paddingBottom: "10px", fontSize: "15px" }} value={2} selected={ticket.status == 2 ? true : false}>On Hold</option>
                                            <option style={{ color: "#67A8E3", fontSize: "19px", letterSpacing: ".5px", paddingBottom: "10px", fontSize: "15px" }} value={3} selected={ticket.status == 3 ? true : false}>In Progress</option>
                                            <option style={{ color: "#10B981", fontSize: "19px", letterSpacing: ".5px", paddingBottom: "10px", fontSize: "15px" }} value={0} selected={ticket.status == 0 ? true : false}>Done</option>
                                        </Form.Select>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Body>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500", fontSize: "15px" }}>Reporter:</div>
                                        <Form.Select name={"status"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px", fontSize: "12px" }} disabled={true}>
                                            <option style={{ fontSize: "19px", letterSpacing: ".5px", marginBottom: "20px" }} value={0} selected={ticket.reporterId == null ? true : false}>Unassigned</option>
                                            {users.filter(x => x.role == 2 || x.role == 0).map((item) => {
                                                return (
                                                    <option style={{ fontSize: "19px", letterSpacing: ".5px", marginBottom: "20px", fontSize: "12px" }} value={item.id} selected={ticket.reporterId == item.id ? true : false}>{item.fullName}</option>
                                                )
                                            })}
                                        </Form.Select>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500", fontSize: "15px" }}>Assignee:</div>
                                        <Form.Select name={"assigneeId"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px", fontSize: "12px" }} onChange={onChange} disabled={localStorage.getItem("role") == 0 ? false : true}>
                                            <option style={{ fontSize: "19px", letterSpacing: ".5px", marginBottom: "20px", fontSize: "12px" }} value={0} selected={ticket.assigneeId == null ? true : false}>Unassigned</option>
                                            {users.filter(x => x.role != 2).map((item) => {
                                                return (
                                                    <option style={{ fontSize: "19px", letterSpacing: ".5px", marginBottom: "20px", fontSize: "12px" }} value={item.id} selected={ticket.assigneeId == item.id ? true : false}>{item.fullName}</option>
                                                )
                                            })}
                                        </Form.Select>
                                    </div>

                                </div>
                            </Modal.Body>

                            <Modal.Body>
                                <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500", fontSize: "15px" }}>Title:</div>
                                <div>
                                    <Input
                                        style={{ height: '30px', resize: "none", fontSize: "15px", color: "#223E58", fontWeight: "100", fontSize: "15px" }}
                                        type="textarea"
                                        name="title"
                                        id="title"
                                        onChange={onChange}
                                        value={ticket.title === null ? "" : ticket.title}
                                        required
                                    />
                                    <label style={{ color: "red", display: isShowDescriptionError }}>Enter title.</label>
                                </div>
                            </Modal.Body>

                            <Modal.Body>
                                <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500", fontSize: "15px" }}>Description:</div>
                                <div>
                                    <Input
                                        style={{ height: '300px', resize: "none", fontSize: "15px", color: "#223E58", fontWeight: "100", fontSize: "15px" }}
                                        type="textarea"
                                        name="description"
                                        id="description"
                                        onChange={onChange}
                                        value={ticket.description === null ? "" : ticket.description}
                                        required
                                    />
                                    <label style={{ color: "red", display: isShowDescriptionError }}>Enter description.</label>
                                </div>
                            </Modal.Body>
                            <Modal.Body>
                                <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Attachments:</div>
                                {
                                    ticketAttachments.length > 0 ? (
                                        <div>
                                            {ticketAttachments.map((file, index) => (
                                                <div key={index + 1} style={{ textAlign: 'left', fontSize: '18px' }}>
                                                    <a href="#" onClick={() => handleFileOpen(file)}>
                                                        {file.fileName}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        isOpenProcessing ? (
                                            <div>Fetching Attachments....</div>
                                        ) : (
                                            <div>No attachments</div>
                                        )
                                    )
                                }

                            </Modal.Body>

                            <Modal.Footer style={{ border: "none", display: "inline" }}>

                                <div style={{ marginBottom: "30px" }}>
                                    <Button style={{ color: "white", width: "auto", height: "auto", letterSpacing: "0.5px", borderRadius: "8px", margin: "2px", fontSize: "15px" }} variant="info" onClick={showCommentModal}>Comments</Button>
                                    <Button style={{ color: "white", width: "auto", height: "auto", letterSpacing: "0.5px", borderRadius: "8px", margin: "2px", fontSize: "15px" }} variant="info" onClick={showHistoryModal}>History</Button>
                                </div>
                                <div>
                                    {/* <Button style={{ background: "#F43030", color: "white", width: "auto", height: "auto", letterSpacing: "0.5px", borderRadius: "8px", margin: "2px", fontSize: "15px" }} variant="outline-danger" onClick={hideModal}>Cancel</Button> */}
                                    <Button style={{ background: "#3B82F6", color: "white", width: "auto", height: "auto", letterSpacing: "0.5px", borderRadius: "8px", margin: "2px", fontSize: "15px" }} variant="outline-primary" onClick={UpdateTicket}>Save</Button>
                                </div>
                            </Modal.Footer>

                            {isOpenProcessing ? <LoadingSpinner /> : <div />}
                        </div>
                        {/* history */}
                        <div style={{ display: isOpenComment == true ? "block" : "none" }}>
                            <Modal.Header style={{ border: "none" }}>
                                <Modal.Title style={{ color: "#FF0000", fontSize: "21px", letterSpacing: "0.36px", fontWeight: "500" }}>Ticket Comments</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Add Comment:</div>
                                <div>
                                    <Input
                                        style={{ height: '150px', resize: "none", fontSize: "15px", color: "#223E58", fontWeight: "100" }}
                                        type="textarea"
                                        name="comment"
                                        id="comment"
                                        onChange={onChangeTicketComment}
                                        value={ticketComment.comment === null ? "" : ticketComment.comment}
                                        required
                                    />
                                    <label style={{ color: "red", display: isShowDescriptionError }}>Enter description.</label>
                                </div>

                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>

                                    <FileInputComponent selectedFiles={selectedFiles} onFileChange={handleFileChange} />

                                </div>

                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>

                                    {selectedFiles.length > 0 && (
                                        <div>
                                            {selectedFiles.map((file, index) => (
                                                <div key={index + 1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '18px' }}>
                                                    <div style={{ textAlign: 'left' }}>
                                                        <a href="#" onClick={() => handleFileOpenComment(file)}>
                                                            {file.name}
                                                        </a>
                                                        <button style={{ borderRadius: "100px", backgroundColor: "red", padding: "2px 8px", fontSize: "12px", marginLeft: "10px" }} onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteFile(index);
                                                        }}>x</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <Button style={{ background: "#3B82F6", color: "white", width: "auto", height: "auto", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px", fontSize: "15px" }} variant="outline-primary" onClick={addTicketComment}>Submit</Button>
                                    </div>
                                </div>

                                <Table responsive>
                                    <tbody>
                                        {ticketComments.map((item) => {
                                            return (
                                                <div style={{ borderBottom: "solid 1px black" }}>
                                                    <div style={{ width: '100%', display: 'inline' }}>
                                                        <div style={{ fontSize: "15px" }}>Comment by: {item.userFullName}</div>
                                                        <div style={{ fontSize: "15px" }}>{item.createdText}</div>
                                                    </div>
                                                    <div style={{ whiteSpace: 'pre-line' }}>{item.comment}</div>

                                                    {item.ticketAttachments.length > 0 ? (
                                                        <div>
                                                            {item.ticketAttachments.map((file, index) => (
                                                                <div key={index + 1} style={{ textAlign: 'left', fontSize: '18px' }}>
                                                                    <a href="#" onClick={() => handleFileOpen(file)}>
                                                                        {file.fileName}
                                                                    </a>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        isOpenProcessing ? (
                                                            <div>Fetching Attachments....</div>
                                                        ) : (
                                                            <div></div>
                                                        )
                                                    )
                                                    }
                                                </div>

                                            )
                                        })}
                                    </tbody>

                                </Table>
                            </Modal.Body>

                            <Modal.Footer style={{ border: "none" }}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <Button style={{ background: "#F43030", color: "white", width: "95px", height: "auto", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px", fontSize: "15px" }} variant="outline-danger" onClick={BackToTicketView}>Back</Button>
                                    </div>
                                </div>
                            </Modal.Footer>

                        </div>

                        <div style={{ display: isOpenHistory == true ? "block" : "none" }}>
                            <Modal.Header style={{ border: "none" }}>
                                <Modal.Title style={{ color: "#FF0000", fontSize: "21px", letterSpacing: "0.36px", fontWeight: "500" }}>Ticket History</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Table responsive>
                                    <tbody>
                                        {ticketHistories.map((item) => {
                                            return (
                                                <div key={item.id} style={{ borderBottom: "solid 1px black" }}>
                                                    <div style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px" }}>{item.createdText}</div>
                                                    <div style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px" }}>{item.fromStatusText == item.toStatusText ? "" : "From:" + item.fromStatusText}</div>
                                                    <div style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px" }}>{item.fromStatusText == item.toStatusText ? "Initial Status:" + item.toStatusText : "To:" + item.toStatusText}</div>
                                                    <div style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px" }}>{item.fromStatusText == item.toStatusText ? "Created By:" + item.userFullName : "Updated by:" + item.userFullName}</div>
                                                </div>
                                            )
                                        })}
                                    </tbody>

                                </Table>

                            </Modal.Body>

                            <Modal.Footer style={{ border: "none" }}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <Button style={{ background: "#F43030", color: "white", width: "95px", height: "auto", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px", fontSize: "15px" }} variant="outline-danger" onClick={BackToTicketView}>Back</Button>
                                    </div>
                                </div>
                            </Modal.Footer>

                        </div>
                        <div style={{ display: showResolution == true ? "block" : "none" }}>
                            <Modal.Header style={{ border: "none" }}>
                                <Modal.Title style={{ color: "#FF0000", fontSize: "21px", letterSpacing: "0.36px", fontWeight: "500" }}>Resolution</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    <Input
                                        style={{ height: '150px', resize: "none", fontSize: "15px", color: "#223E58", fontWeight: "100", fontSize: "15px" }}
                                        type="textarea"
                                        name="resolution"
                                        id="resolution"
                                        onChange={onChangeResolution}
                                        value={resolution === null ? "" : resolution}
                                        required
                                    />
                                    <label style={{ color: "red", display: isShowDescriptionError, fontSize: "15px" }}>Enter description.</label>
                                </div>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <Button style={{ background: "#3B82F6", color: "white", width: "95px", height: "auto", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px", fontSize: "15px" }} variant="outline-primary" onClick={UpdateTicket}>Submit</Button>
                                    </div>
                                </div>
                            </Modal.Body>

                            <Modal.Footer style={{ border: "none" }}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <Button style={{ background: "#F43030", color: "white", width: "95px", height: "auto", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px", fontSize: "15px" }} variant="outline-danger" onClick={BackToTicketView}>Back</Button>
                                    </div>
                                </div>
                            </Modal.Footer>

                        </div>
                    </Modal>
                </>

            </div>
        )
    }
    else {
        return (

            <div>
                <div style={componentStyle}>
                    <div style={{ paddingTop: "20px", paddingBottom: "10px", marginBottom: "20px", display: 'flex', borderBottom: "solid 1px black" }}>
                        <div className="d-flex flex-row">
                            <div className="p-2" style={{ fontSize: "18px", marginTop: "6px" }}>Search Ticket ID:</div>
                            <div className="p-2">
                                <Input
                                    type="text"
                                    onChange={TicketSearch}
                                    className="searchname"
                                /></div>
                        </div>
                        <div className="d-flex flex-row">
                            <div className="p-2" style={{ fontSize: "18px", marginTop: "6px", marginLeft: "30px" }}>Status:</div>
                            <div className="p-2">

                                <Form.Select value={filter.status} name={"status"}
                                    style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }}
                                    onChange={ChangeStatusFilter}
                                >
                                    <option value={4} selected={filter.status == 4}>All</option>
                                    <option value={1} selected={filter.status == 1}>Open</option>
                                    <option value={2} selected={filter.status == 2}>On Hold</option>
                                    <option value={3} selected={filter.status == 3}>In Progress</option>
                                    <option value={0} selected={filter.status == 0}>Done</option>
                                </Form.Select>
                            </div>
                        </div>
                        <div className="d-flex flex-row">
                            <div className="p-2" style={{ fontSize: "18px", marginTop: "6px", marginLeft: "30px", display: localStorage.getItem("roletext") === "reporter" ? "none" : "inline" }}>Assignee:</div>
                            <div className="p-2" style={{ fontSize: "18px", marginTop: "px", marginLeft: "30px", width: "300px", display: localStorage.getItem("roletext") === "reporter" ? "none" : "inline" }}>

                                <Select isMulti options={AssigneeList}
                                    onChange={onChangeUserFilter}
                                />
                                {/* {userFilter.map((uf) => {
                                        return (
                                            <div>{uf}</div>
                                        )
                                    })} */}
                                {/* <Form.Select value={statusFilter} name={"status"}
                                    style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }}
                                    onChange={ChangeStatusFilter}
                                >
                                    <option value={0}>ALL</option>
                                    <option value={0}>Current User</option>
                                    <option value={0}>Unassigned</option>

                                    {users.map((user) => {
                                        return (
                                            <option value={user.id}>{user.fullName}</option>
                                        )
                                    })}
                                </Form.Select> */}
                            </div>
                        </div>
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
                                            onClick={() => requestSort('ticketNumber')}
                                            className={getClassNamesFor('ticketNumber')}
                                        >
                                            Ticket ID
                                        </Button>
                                    </th>
                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('id')}
                                            className={getClassNamesFor('id')}
                                        >
                                            Called In
                                        </Button>
                                    </th>
                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('title')}
                                            className={getClassNamesFor('title')}
                                        >
                                            Title
                                        </Button>
                                    </th>
                                    {/* <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('description')}
                                            className={getClassNamesFor('description')}
                                        >
                                            Description
                                        </Button>
                                    </th> */}

                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('branchName')}
                                            className={getClassNamesFor('branchName')}
                                        >
                                            Branch
                                        </Button>
                                    </th>


                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('reporterText')}
                                            className={getClassNamesFor('reporterText')}
                                        >
                                            Reporter
                                        </Button>
                                    </th>

                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('assigneeText')}
                                            className={getClassNamesFor('assigneeText')}
                                        >
                                            Assignee
                                        </Button>
                                    </th>
                                    <th>
                                        <Button
                                            style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                                            size="lg"
                                            type="button"
                                            onClick={() => requestSort('statusName')}
                                            className={getClassNamesFor('statusName')}
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
                                {getTicketList()}
                            </tbody>

                        </Table>
                        {isOpenProcessingTable ? <LoadingSpinner /> : <div />}

                    </div>
                </div>
                <>
                <Modal show={isOpen} >
                        {/* main view */}
                        <div style={{ display: isOpenCommentAndHistory == true ? "none" : "block" }}>
                            <Modal.Header style={{ border: "none", width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                                <Modal.Title style={{ color: "#FF0000", fontSize: "21px", letterSpacing: "0.36px", fontWeight: "500" }}>Ticket Details</Modal.Title>

                                {/* <div>
                                    {window.location.origin + "/ticketview/" + ticket.ticketNumber}
                                    <CopyButton text={window.location.origin + "/ticketview/" + ticket.ticketNumber} />
                                </div> */}

                                <Button style={{ background: "#F43030", color: "white", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px" }} variant="outline-danger" onClick={hideModal}>X</Button>
                            </Modal.Header>
                            <Modal.Header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                                {/* <Modal.Title style={{ color: "#FF0000", fontSize: "21px", letterSpacing: "0.36px", fontWeight: "500" }}>Ticket Details</Modal.Title> */}

                                <div>
                                    {window.location.origin + "/ticketview/" + ticket.ticketNumber}
                                    <CopyButton text={window.location.origin + "/ticketview/" + ticket.ticketNumber} />
                                </div>
                            </Modal.Header>

                            <Modal.Body>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                                    <div style={{ float: 'left', padding: '10px', boxSizing: "border-box" }}>
                                        <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Ticket ID:</div>
                                        <div style={{ fontSize: "15px", color: "#223E58", fontWeight: "100" }}>{ticket.ticketNumber}</div>
                                    </div>

                                    {/* <div style={{ float: 'left', padding: '10px', boxSizing: "border-box" }}>
                                        <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Called In:</div>
                                        <div style={{ fontSize: "15px", color: "#223E58", fontWeight: "100" }}>{ticket.calledInText}</div>
                                    </div> */}
                                    <div style={{ float: 'right', padding: '10px', boxSizing: "border-box", clear: "right" }}>
                                        <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Status:</div>
                                        <Form.Select value={ticket.status} name={"status"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px", color: statusColor }} onChange={onChangeSelect} disabled={localStorage.getItem("role") == 2 ? true : false}>
                                            <option style={{ color: "#F5A314", fontSize: "19px", letterSpacing: ".5px", marginBottom: "20px" }} value={1} selected={ticket.status == 1 ? true : false}>Open</option>
                                            <option style={{ color: "#FF0000", fontSize: "19px", letterSpacing: ".5px", paddingBottom: "10px" }} value={2} selected={ticket.status == 2 ? true : false}>On Hold</option>
                                            <option style={{ color: "#67A8E3", fontSize: "19px", letterSpacing: ".5px", paddingBottom: "10px" }} value={3} selected={ticket.status == 3 ? true : false}>In Progress</option>
                                            <option style={{ color: "#10B981", fontSize: "19px", letterSpacing: ".5px", paddingBottom: "10px" }} value={0} selected={ticket.status == 0 ? true : false}>Done</option>
                                        </Form.Select>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Body>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ float: 'left', padding: '10px', boxSizing: "border-box" }}>
                                        <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Called In:</div>
                                        <div style={{ fontSize: "15px", color: "#223E58", fontWeight: "100" }}>{ticket.calledInText}</div>
                                    </div>

                                    <div style={{ float: 'left', padding: '10px', boxSizing: "border-box" }}>
                                        <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Branch:</div>
                                        <Form.Select name={"branchId"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChangeSelect}>
                                            <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={0} selected={ticket.branchId == 0 ? true : false}>Unassigned</option>
                                            {branches.map((item) => {
                                                return (
                                                    <option style={{ letterSpacing: ".5px", paddingBottom: "10px" }} value={item.id} selected={ticket.branchId == item.id ? true : false}>{item.name}</option>
                                                )
                                            })}
                                        </Form.Select>
                                    </div>

                                </div>
                            </Modal.Body>
                            <Modal.Body>

                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Reporter:</div>
                                        <Form.Select name={"status"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} disabled={true}>
                                            <option style={{ fontSize: "19px", letterSpacing: ".5px", marginBottom: "20px" }} value={0} selected={ticket.reporterId == null ? true : false}>Unassigned</option>
                                            {users.filter(x => x.role == 2 || x.role == 0).map((item) => {
                                                return (
                                                    <option style={{ fontSize: "19px", letterSpacing: ".5px", marginBottom: "20px" }} value={item.id} selected={ticket.reporterId == item.id ? true : false}>{item.fullName}</option>
                                                )
                                            })}
                                        </Form.Select>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Assignee:</div>
                                        <Form.Select name={"assigneeId"} style={{ fontSize: "19px", paddingLeft: "20px", letterSpacing: ".5px" }} onChange={onChange} disabled={localStorage.getItem("role") == 0 ? false : true}>
                                            <option style={{ fontSize: "19px", letterSpacing: ".5px", marginBottom: "20px" }} value={0} selected={ticket.assigneeId == null ? true : false}>Unassigned</option>
                                            {users.filter(x => x.role != 2).map((item) => {
                                                return (
                                                    <option style={{ fontSize: "19px", letterSpacing: ".5px", marginBottom: "20px" }} value={item.id} selected={ticket.assigneeId == item.id ? true : false}>{item.fullName}</option>
                                                )
                                            })}
                                        </Form.Select>
                                    </div>

                                </div>
                            </Modal.Body>

                            <Modal.Body>
                                <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Title:</div>
                                <div>
                                    <Input
                                        style={{ height: '30px', resize: "none", fontSize: "15px", color: "#223E58", fontWeight: "100" }}
                                        type="textarea"
                                        name="title"
                                        id="title"
                                        onChange={onChange}
                                        value={ticket.title === null ? "" : ticket.title}
                                        required
                                    />
                                    <label style={{ color: "red", display: isShowDescriptionError }}>Enter title.</label>
                                </div>

                            </Modal.Body>

                            <Modal.Body>
                                <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Description:</div>
                                {/* <div>{item.title}</div> */}
                                <div>
                                    <Input
                                        style={{ height: '300px', resize: "none", fontSize: "15px", color: "#223E58", fontWeight: "100" }}
                                        type="textarea"
                                        name="description"
                                        id="description"
                                        onChange={onChange}
                                        value={ticket.description === null ? "" : ticket.description}
                                        required
                                    />
                                    <label style={{ color: "red", display: isShowDescriptionError }}>Enter description.</label>
                                </div>

                            </Modal.Body>

                            <Modal.Body>
                                <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Attachments:</div>
                                {
                                    ticketAttachments.length > 0 ? (
                                        <div>
                                            {ticketAttachments.map((file, index) => (
                                                <div key={index + 1} style={{ textAlign: 'left', fontSize: '18px' }}>
                                                    <a href="#" onClick={() => handleFileOpen(file)}>
                                                        {file.fileName}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        isOpenProcessing ? (
                                            <div>Fetching Attachments....</div>
                                        ) : (
                                            <div>No attachments</div>
                                        )
                                    )
                                }
                            </Modal.Body>

                            <Modal.Footer style={{ border: "none" }}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <Button style={{ color: "white", width: "auto", height: "45px", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px" }} variant="info" onClick={showCommentModal}>Comments</Button>
                                        <Button style={{ color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px" }} variant="info" onClick={showHistoryModal}>History</Button>


                                    </div>
                                    <div>
                                        {/* <Button style={{ background: "#F43030", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px" }} variant="outline-danger" onClick={hideModal}>Cancel</Button> */}
                                        <Button style={{ background: "#3B82F6", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px" }} variant="outline-primary" onClick={UpdateTicket}>Save</Button>
                                    </div>
                                </div>
                            </Modal.Footer>

                            {isOpenProcessing ? <LoadingSpinner /> : <div />}
                        </div>
                        {/* history */}
                        <div style={{ display: isOpenComment == true ? "block" : "none" }}>
                            <Modal.Header style={{ border: "none" }}>
                                <Modal.Title style={{ color: "#FF0000", fontSize: "21px", letterSpacing: "0.36px", fontWeight: "500" }}>Ticket Comments</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Add Comment:</div>
                                {/* <div>{item.title}</div> */}
                                <div>
                                    <Input
                                        style={{ height: '150px', resize: "none", fontSize: "15px", color: "#223E58", fontWeight: "100" }}
                                        type="textarea"
                                        name="comment"
                                        id="comment"
                                        onChange={onChangeTicketComment}
                                        value={ticketComment.comment === null ? "" : ticketComment.comment}
                                        required
                                    />
                                    <label style={{ color: "red", display: isShowDescriptionError }}>Enter description.</label>
                                </div>


                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>

                                    <FileInputComponent selectedFiles={selectedFiles} onFileChange={handleFileChange} />

                                </div>

                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>

                                    {selectedFiles.length > 0 && (
                                        <div>
                                            {selectedFiles.map((file, index) => (
                                                <div key={index + 1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '18px' }}>
                                                    <div style={{ textAlign: 'left' }}>
                                                        <a href="#" onClick={() => handleFileOpenComment(file)}>
                                                            {file.name}
                                                        </a>
                                                        <button style={{ borderRadius: "100px", backgroundColor: "red", padding: "2px 8px", fontSize: "12px", marginLeft: "10px" }} onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteFile(index);
                                                        }}>x</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <Button style={{ background: "#3B82F6", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px" }} variant="outline-primary" onClick={addTicketComment}>Submit</Button>
                                    </div>
                                </div>

                                <Table responsive>
                                    <tbody>
                                        {ticketComments.map((item) => {
                                            return (
                                                <div style={{ borderBottom: "solid 1px black" }}>
                                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div>Comment by: {item.userFullName}</div>
                                                        <div>Date:{item.createdText}</div>
                                                    </div>
                                                    <div style={{ whiteSpace: 'pre-line' }}>{item.comment}</div>

                                                    {item.ticketAttachments.length > 0 ? (
                                                        <div>
                                                            {item.ticketAttachments.map((file, index) => (
                                                                <div key={index + 1} style={{ textAlign: 'left', fontSize: '18px' }}>
                                                                    <a href="#" onClick={() => handleFileOpen(file)}>
                                                                        {file.fileName}
                                                                    </a>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        isOpenProcessing ? (
                                                            <div>Fetching Attachments....</div>
                                                        ) : (
                                                            <div></div>
                                                        )
                                                    )
                                                    }
                                                </div>
                                            )
                                        })}

                                        {isOpenProcessingTable ? <LoadingSpinner /> : <div />}
                                    </tbody>

                                </Table>
                            </Modal.Body>

                            <Modal.Footer style={{ border: "none" }}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <Button style={{ background: "#F43030", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px" }} variant="outline-danger" onClick={BackToTicketView}>Back</Button>
                                    </div>
                                </div>
                            </Modal.Footer>

                        </div>

                        <div style={{ display: isOpenHistory == true ? "block" : "none" }}>
                            <Modal.Header style={{ border: "none" }}>
                                <Modal.Title style={{ color: "#FF0000", fontSize: "21px", letterSpacing: "0.36px", fontWeight: "500" }}>Ticket History</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Table responsive>
                                    <tbody>
                                        {ticketHistories.map((item) => {
                                            return (
                                                <tr key={item.id}>
                                                    <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px" }}>{item.createdText}</td>
                                                    <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px" }}>{item.fromStatusText == item.toStatusText ? "" : "From:" + item.fromStatusText}</td>
                                                    <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px" }}>{item.fromStatusText == item.toStatusText ? "Initial Status:" + item.toStatusText : "To:" + item.toStatusText}</td>
                                                    <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px" }}>{item.fromStatusText == item.toStatusText ? "Created By:" + item.userFullName : "Updated by:" + item.userFullName}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>

                                </Table>

                            </Modal.Body>

                            <Modal.Footer style={{ border: "none" }}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <Button style={{ background: "#F43030", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px" }} variant="outline-danger" onClick={BackToTicketView}>Back</Button>
                                    </div>
                                </div>
                            </Modal.Footer>

                        </div>
                        <div style={{ display: showResolution == true ? "block" : "none" }}>
                            <Modal.Header style={{ border: "none" }}>
                                <Modal.Title style={{ color: "#FF0000", fontSize: "21px", letterSpacing: "0.36px", fontWeight: "500" }}>Resolution</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {/* <div style={{ fontSize: "17px", color: "#223E58", fontWeight: "500" }}>Add Comment:</div> */}
                                {/* <div>{item.title}</div> */}
                                <div>
                                    <Input
                                        style={{ height: '150px', resize: "none", fontSize: "15px", color: "#223E58", fontWeight: "100" }}
                                        type="textarea"
                                        name="resolution"
                                        id="resolution"
                                        onChange={onChangeResolution}
                                        value={resolution === null ? "" : resolution}
                                        required
                                    />
                                    <label style={{ color: "red", display: isShowDescriptionError }}>Enter description.</label>
                                </div>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <Button style={{ background: "#3B82F6", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px" }} id="resolution" variant="outline-primary" onClick={UpdateTicket}>Submit</Button>
                                    </div>
                                </div>
                            </Modal.Body>

                            <Modal.Footer style={{ border: "none" }}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <Button style={{ background: "#F43030", color: "white", width: "95px", height: "45px", letterSpacing: "0.5px", borderRadius: "8px", margin: "6px" }} variant="outline-danger" onClick={BackToTicketView}>Back</Button>
                                    </div>
                                </div>
                            </Modal.Footer>

                        </div>
                    </Modal>  </>
            </div>
        )
    }
}

export default TicketList