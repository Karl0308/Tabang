import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fileIcon from '../../../img/file.png';
import LoadComponent from '../../component/LoadComponent';
import { Branch, BranchMember } from '../../objects/Branch';
import { DocumentType } from '../../objects/DocumentType';
import axios from 'axios';
import { APIURLS } from '../../../APIURLS';
import { Ticket } from '../../objects/Ticket';
import TicketModal from '../Ticket/TicketModal'
import { User } from '../../objects/User';
import { useAccordionButton } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { DepartmentBase } from '../../objects/enum';

const TicketEntry = () => {

    const history = useNavigate();
    const initialTicketState: Ticket = {
        id: 0,
        ticketNumber: "",
        calledIn: new Date(),
        dueDate: null,
        timeStamp: new Date(),
        title: "",
        description: "Reporter: \nIP Address: \nLocation: \nAsset tag: \nProblem Concern Details: ",
        branchName: "",
        reporterName: "",
        assigneeText: "",
        priorityName: "",
        priority: 0,
        status: 0,
        ticketLink: "",
        starRate: 0,
        documentTypeId: 0,
        branchId: 0,
        reporterId: Number(localStorage.getItem("id")),
        assigneeId: 0,
        branchMemberAssigneeName: "",
        statusName: "",
        oldStatus: 0,
        resolution: "",
        currentUserId: 0,
        branchMemberAssigneeId: 0,
        reporterText: '',
        timestamp: new Date(),
        ticketAssetsString: "",
        departmentBase: DepartmentBase.Default,
    };
    const [title, setTitle] = useState<string>('');
    const [ticket, setTicket] = useState<Ticket | null>(initialTicketState);

    const [saveTicket, setSaveTicket] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [ticketAssets, setTicketAssets] = useState([]);

    const axiosInstance = axios.create({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    });

    const FetchBranches = () => {
        setIsLoading(true);
        axiosInstance.get(APIURLS.branch.getBranches)
            .then(res => res.data)
            .then(
                (result) => {
                    setBranches(result);
                    setIsLoading(false);
                },
                (error) => {
                    console.log(error);
                }
            )
    }
    const FetchUsers = () => {
        setIsLoading(true);
        axiosInstance.get(APIURLS.user.getUsers)
            .then(res => res.data)
            .then(
                (result) => {
                    setUsers(result);
                    setIsLoading(false);
                },
                (error) => {
                    console.log(error);
                }
            )
    }


    useEffect(() => {
        FetchBranches();
        FetchUsers();
    }, []);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            if (selectedFiles) {
                const newFiles: File[] = Array.from(files).filter(file => {
                    for (let i = 0; i < selectedFiles.length; i++) {
                        if (file.name === selectedFiles[i].name) {
                            return false;
                        }
                    }
                    return true;
                });
                const newFileList = new DataTransfer();
                Array.from(selectedFiles).forEach(file => newFileList.items.add(file));
                newFiles.forEach(file => newFileList.items.add(file));
                setSelectedFiles(newFileList.files);
            } else {
                setSelectedFiles(files);
            }
        }
    };

    const handleOpenCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            console.log('Camera opened successfully:', mediaStream);
        } catch (error) {
            console.error('Error opening camera:', error);
        }
    };


    // const handleSave = () => {
    //     const filesDescription = selectedFiles ? Array.from(selectedFiles).map(file => `Unknown image file: ${file.name}`).join('\n') : '';
    //     const finalDescription = description ? `${description}\n${filesDescription}` : filesDescription;
    //     console.log('Ticket saved:', { title, description: finalDescription });
    //     // history.push('/tickets'); // Navigate to the tickets page after saving
    // };
    const handleSave = () => {
        if (isLoading) {
            return;
        }
        // if (!selectedFiles) {
        //     console.error("No files selected!");
        //     return;
        // }
        if (!ticket) {
            console.error("No files selected!");
            return;
        }

        // e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();

        if (selectedFiles !== null) {
            if (selectedFiles.length > 0) {
                Array.from(selectedFiles).forEach((file) => {
                    formData.append("files", file);
                });
            }

        }

        // Append other form data to formData
        formData.append('title', ticket.title);
        formData.append('description', ticket.description);
        formData.append('status', ticket.status.toString());
        formData.append('oldStatus', ticket.oldStatus.toString());
        formData.append('resolution', ticket.resolution);
        formData.append('branchId', ticket.branchId.toString());
        formData.append('documentTypeId', ticket.documentTypeId.toString());
        formData.append('assigneeId', ticket.assigneeId.toString());
        formData.append('currentUserId', ticket.currentUserId.toString());
        formData.append('reporterId', ticket.reporterId.toString());
        formData.append('branchMemberAssigneeId', ticket.branchMemberAssigneeId.toString());
        formData.append('ticketAssetsString', JSON.stringify(ticketAssets));

        // ... append other fields as needed ...

        axiosInstance.post(APIURLS.ticket.saveTicket, formData)
            .then(res => res.data)
            .then((res) => {
                setSaveTicket(res.ticketNumber);
                setTicket(initialTicketState);
                setSelectedFiles(null);

                setTicketAssets([]);
                setIsLoading(false);
                setIsModalOpen(true);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    };

    const handleDeleteFile = (index: number) => {
        if (selectedFiles) {
            const filesArray = Array.from(selectedFiles);
            filesArray.splice(index, 1);
            const newFileList = new DataTransfer();
            filesArray.forEach(file => newFileList.items.add(file));
            setSelectedFiles(newFileList.files);
        }
    };


    const handleAssetOnChange = (selectedOption: any) => {
        setTicketAssets(selectedOption);

    };
    const filterAssetsOptions = (inputValue: any, callback: any) => {
        const searchTermParam = inputValue != null ? inputValue : "";
        axiosInstance.get(`${APIURLS.ticket.ticketBase}GetAssets?searchTerm=${searchTermParam}`)
            .then((response) => {
                const options: any[] = [];
                response.data.forEach((asset: any) => {
                    options.push({
                        label: `${asset.code} - ${asset.name}`,
                        value: asset.id,
                    });
                });
                callback(options);
            })
    }


    return (
        <div className="flex flex-col h-full mx-auto w-2/2">
            <div className="container mx-auto flex-grow overflow-auto">
                <div className="p-6">

                    {/* <div className="mb-4 p-4 bg-gray-200 rounded-md">
    <h1 className="text-3xl font-bold text-center">Submit a Ticket</h1>
</div> */}
                    <div className="mb-4 p-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-md">
                        <h1 className="text-3xl font-bold text-center text-white">Submit a Ticket</h1>
                    </div>
                    {/* <div className="mb-4">
                        <p className="text-gray-700 font-bold text-left mb-0">Title:</p>
                        <input
                            type="text"
                            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:bg-white"
                            placeholder="Enter Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div> */}

                    <div className="mb-4">
                        <p className="text-gray-700 font-bold text-left mb-0">Title:</p>
                        {/* <select
                            className="w-full bg-gray-200 font-semibold border border-gray-300 rounded-md py-1 px-3 appearance-none text-center"
                            value={ticket ? ticket.documentTypeId : ''}
                            onChange={(e) => {
                                if (ticket) {
                                    setTicket({ ...ticket, documentTypeId: Number(e.target.value) });
                                }
                            }}
                        >

                            <option key={0} value={0}>Unassigned</option>
                            {documentType.map((obj) => (
                                <option key={obj.id} value={obj.id}>
                                    {obj.name}
                                </option>
                            ))}

                        </select> */}
                        <input
                            type="text"
                            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:bg-white"
                            placeholder="Enter Title"
                            value={ticket?.title}
                            onChange={(e) => {
                                if (ticket) {
                                    setTicket({ ...ticket, title: e.target.value });
                                }
                            }}
                        />
                    </div>

                    <div className="mb-4">
                        <p className="text-gray-700 font-bold text-left mb-0">Description:</p>
                        <textarea
                            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 resize-none focus:outline-none focus:bg-white"
                            placeholder="Enter Description"
                            value={ticket?.description}
                            // onChange={(e) => setDescription(e.target.value)}
                            onChange={(e) => {
                                if (ticket) {
                                    setTicket({ ...ticket, description: e.target.value })
                                }
                            }}
                            rows={Math.max(6, description.split('\n').length + 1)}
                        />
                    </div>

                    {/* <div className="mb-4">
                        <p className="text-gray-700 font-bold text-left mb-0">Assets:</p>
                        <AsyncSelect
                            isMulti
                            value={ticketAssets}
                            placeholder="Assign assets...."
                            defaultOptions
                            onChange={handleAssetOnChange}
                            loadOptions={filterAssetsOptions}

                        />
                    </div> */}
                    <div className="mb-4">
                        <p className="text-gray-700 font-bold text-left mb-0">Branch:</p>
                        <select
                            className="w-full bg-gray-200 font-semibold border border-gray-300 rounded-md py-1 px-3 appearance-none text-center"
                            value={ticket ? ticket.branchId : ''}
                            onChange={(e) => {
                                if (ticket) {
                                    setTicket({ ...ticket, branchId: Number(e.target.value) });
                                }
                            }}
                        >

                            <option key={0} value={0}>Unassigned</option>
                            {branches.map((obj) => (
                                <option key={obj.id} value={obj.id}>
                                    {obj.name}
                                </option>
                            ))}

                        </select>
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-700 font-bold text-left mb-0">Assignee:</p>
                        <select
                            className="w-full bg-gray-200 font-semibold border border-gray-300 rounded-md py-1 px-3 appearance-none text-center"
                            value={ticket ? ticket.assigneeId : ''}
                            onChange={(e) => {
                                if (ticket) {
                                    setTicket({ ...ticket, assigneeId: Number(e.target.value) });
                                }
                            }}
                        >

                            <option key={0} value={0}>Unassigned</option>
                            {users.map((obj) => (
                                <option key={obj.id} value={obj.id}>
                                    {obj.fullName}
                                </option>
                            ))}

                        </select>
                    </div>

                    <div className="mb-4 flex">
                        <label htmlFor="file-upload" className="flex-1 block text-sm font-semibold text-gray-700 cursor-pointer border border-gray-300 rounded-md p-2 flex items-center justify-center hover:bg-gray-100 mr-2">
                            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Choose Files
                            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} multiple />
                        </label>
                        {/* <label htmlFor="camera-upload" className="flex-1 block text-sm font-semibold text-gray-700 cursor-pointer border border-gray-300 rounded-md p-2 flex items-center justify-center hover:bg-gray-100 mr-2">
                            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.793C21 16.757 20.157 17.5 19.111 17.5H4.889C3.843 17.5 3 16.757 3 15.793V9.5c0-.964.843-1.5 1.889-1.5h1.475l.788-1.256A1.5 1.5 0 018.48 6.5H15.52a1.5 1.5 0 011.328.744l.787 1.256h1.476c1.046 0 1.889.536 1.889 1.5v6.293z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.964 9.132a3 3 0 10-7.929 0m7.929 0h-7.929M12 14.5a2 2 0 100-4 2 2 0 000 4z"></path>
                            </svg>
                            Open Camera
                            <input id="camera-upload" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleOpenCamera} />
                        </label> */}
                    </div>
                    {selectedFiles && (
                        <div className="mb-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {Array.from(selectedFiles).map((file, index) => (
                                    <div key={index} className="bg-gray-100 p-2 rounded-md text-center relative pt-10">
                                        {file.type.startsWith('image/') ? (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Image"
                                                className="w-20 h-20 mx-auto mb-2 object-cover rounded-md"
                                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                                            />
                                        ) : (
                                            <img src={fileIcon} alt="File Icon" className="w-10 h-10- mx-auto mb-2" />
                                        )}
                                        <p className="text-sm break-all">{file.name}</p>
                                        <button className="absolute top-0 right-0 m-1 p-1 text-gray-500 rounded-full hover:text-gray-600" onClick={() => handleDeleteFile(index)}>X</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>


            </div>
            <button
                onClick={handleSave}
                className="mx-auto w-2/5 bg-blue-500 text-white rounded-md py-2 mb-4 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
            >
                Submit
            </button>
            <LoadComponent loading={isLoading} />
            {isModalOpen && (
                <TicketModal
                    isOpen={isModalOpen}
                    ticketNumber={saveTicket}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default TicketEntry;
