import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import TicketDetail from './TicketDetail';
import LoadComponent from '../../component/LoadComponent';
import { Link } from 'react-router-dom';
import { Ticket } from '../../objects/Ticket';
import TicketViewPopup from './TicketViewPopup';
import axios from "axios";
import { APIURLS } from '../../../APIURLS';
import { Branch } from '../../objects/Branch';
import { DocumentType } from '../../objects/DocumentType';
import { User } from '../../objects/User';
import CopyButton from '../../../components/CopyButton';
import Select, { MultiValue, ActionMeta } from 'react-select';
import { DepartmentBase } from '../../objects/enum';

const ITEMS_PER_PAGE = 10;

type FilterSearch = {
    value: string | number;
};

interface FilterStatus {
    value: number;
    label: string;
}
interface FilterPriority {
    value: number;
    label: string;
}
interface FilterAssignee {
    value: string | number | null;
    label: string;
}
interface FilterBranch {
    value: string | number;
    label: string;
}


type FilterState = {
    search: string;
    status: MultiValue<FilterStatus>;
    userOption: MultiValue<FilterAssignee>;
    branches: MultiValue<FilterBranch>;
    priority: MultiValue<FilterPriority>;
};


const Tickets = () => {

    const { ticketNum } = useParams();

    const [data, setData] = useState<Ticket[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderBy, setOrderBy] = useState('');
    const [orderDesc, setOrderDesc] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [timeStamp, setTimeStamp] = useState<Date | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [documentType, setDocumentTypes] = useState<DocumentType[]>([]);
    const [users, setUsers] = useState<User[]>([]);



    const filterStatusInitialState: FilterStatus = { value: 1, label: 'Pending' };
    const [filter, setFilter] = useState<FilterState>({
        search: '',
        status: [filterStatusInitialState],
        userOption: [],
        branches: [],
        priority: []
    });
    const StatusList = [
        { value: 4, label: 'ALL' },
        { value: 1, label: 'OPEN' },
        { value: 2, label: 'ON HOLD' },
        { value: 3, label: 'IN PROGRESS' },
        { value: 0, label: 'DONE' }
    ];

    const PriorityList = [
        { value: 1, label: 'Low' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'High' },
        { value: 4, label: 'Critical' },
    ];

    const AssigneeList = [
        { value: 'ALL', label: 'ALL' },
        { value: localStorage.getItem('id'), label: 'Current User' }, // Default to '0' if 'id' is null
        { value: 'Unassigned', label: 'Unassigned' },
        ...users.filter(x => x.role !== 2)
            .sort((a, b) => a.fullName.localeCompare(b.fullName))
            .map((user) => ({ value: user.id, label: user.fullName }))
    ];
    const BranchList = [
        { value: 'ALL', label: 'ALL' },
        { value: 'Unassigned', label: 'Unassigned' },
        ...branches.sort((a, b) => a.name.localeCompare(b.name))
            .map((branch) => ({ value: branch.id, label: branch.name }))

    ];

    const axiosInstance = axios.create({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    });

    const getUser = (id: number) => {
        const reporter = users.find(x => x.id == id);
        if (reporter == undefined) { return "Unassigned"; }
        else { return reporter.fullName; }

    };
    const getBranch = (id: number) => {
        const branch = branches.find(x => x.id == id);
        if (branch == undefined) { return "Unassigned"; }
        else { return branch.name; }

    };
    const getDocumentType = (id: number) => {
        const document = documentType.find(x => x.id == id);
        if (document == undefined) { return "Unassigned"; }
        else { return document.name; }

    };

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

                }
            )
    }
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
    const FetchDocumentTypes = () => {
        setIsLoading(true);
        axiosInstance.get(APIURLS.documenttype.getDocumentTypes + "true")
            .then(res => res.data)
            .then(
                (result) => {
                    setDocumentTypes(result);
                    setIsLoading(false);
                },
                (error) => {
                    console.log(error);
                }
            )
    }


    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCounter(counter + 1);
            fetchData();
        }, 60000);

        return () => {
            clearTimeout(timeout);
        };
    }, [counter]);

    // useEffect(() => {
    //     if (selectedTicket === null) {
    //         fetchData();
    //     }
    // }, [selectedTicket]);

    const fetchData = () => {
        setIsLoading(true);
        axiosInstance.get(APIURLS.ticket.getTickets + (timeStamp === null ? "" : "?_timeStamp=" + timeStamp))
            .then(res => res.data)
            .then(
                (result) => {

                    if (result && Array.isArray(result)) {
                        const tickets: Ticket[] = result; // Explicitly cast to Ticket array

                        if (tickets.length > 0) {
                            const lastDate = (result
                                .sort((a: Ticket, b: Ticket) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime())[0])
                                .timeStamp;

                            setTimeStamp(lastDate);
                        }
                    }

                    if (result.length > 0) { setData(result); }



                    setIsLoading(false);

                    if (ticketNum !== undefined) {
                        fetchDataFromTicketNum();
                    }
                },
                (error) => {
                    setIsLoading(false);
                }
            )
    }

    const FetchDataSearch = (value: string) => {

        setIsLoading(true);
        axiosInstance.get(APIURLS.ticket.getTicketSearch + value)
            .then(res => res.data)
            .then(
                (result) => {
                    setData(result);
                    setIsLoading(false);
                    // setisOpenProcessingTable(false);
                    // if (result.length > 0) {
                    //     const lastDate = (result.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))[0]).timeStamp;
                    //     setTimeStamp(lastDate);

                    //     const sortedResults = result.sort((a, b) => {
                    //         if (a.priority !== b.priority) {
                    //             return b.priority - a.priority;
                    //         }
                    //         return new Date(a.timestamp) - new Date(b.timestamp);
                    //     });
                    //     setItems(sortedResults);
                    //     setAllItems(sortedResults);
                    //     setPages((sortedResults.length / 10))
                    // }
                },
                (error) => {
                    setIsLoading(false);
                }
            )
    }

    const fetchDataFromTicketNum = () => {
        if (selectedTicket !== null) { return; };

        setIsLoading(true);
        axiosInstance
            .get(APIURLS.ticket.getTicketNum + ticketNum)
            .then((res) => {
                const result = res.data; // Adjust based on actual API response
                const normalizedResult = Array.isArray(result) ? result : [result];

                setData((prevData) => [...prevData, ...normalizedResult]);

                if (Array.isArray(normalizedResult) && ticketNum) {
                    const selectedTicket = normalizedResult.find(ticket => ticket.ticketNumber === ticketNum);

                    if (selectedTicket) {

                        setSelectedTicket(selectedTicket); // Assuming single ticket selection
                    }
                }

                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    };



    useEffect(() => {

        FetchUsers();
        FetchBranches();
        FetchDocumentTypes();
        fetchData();

    }, []);

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

    let filteredData = data.filter(item =>
        item.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (orderBy) {
        filteredData.sort((a, b) => {
            const aValue = typeof a[orderBy as keyof typeof a] === 'string' ? (a[orderBy as keyof typeof a] as string).toLowerCase() : String(a[orderBy as keyof typeof a]);
            const bValue = typeof b[orderBy as keyof typeof b] === 'string' ? (b[orderBy as keyof typeof b] as string).toLowerCase() : String(b[orderBy as keyof typeof b]);

            if (orderDesc) {
                return bValue.localeCompare(aValue);
            } else {
                return aValue.localeCompare(bValue);
            }
        });
    }

    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        // setSearchQuery(event.target.value);
        // setCurrentPage(1);
        setFilter(filter => ({
            ...filter,
            search: event.target.value
        }));

        if (event.target.value.length > 3) {
            FetchDataSearch(event.target.value);
        }
    };

    const onChangeStatusFilter = (newValue: MultiValue<FilterStatus>, actionMeta: ActionMeta<FilterStatus>) => {

        setFilter((prevFilter) => ({
            ...prevFilter,
            status: newValue // newValue is the selected options array
        }));

        if (newValue.length === 0) {
            setFilter((prevFilter) => ({
                ...prevFilter,
                status: [filterStatusInitialState], // Reset to default status if no selection
            }));
        }
    };

    const onChangePriorityFilter = (newValue: MultiValue<FilterPriority>, actionMeta: ActionMeta<FilterPriority>) => {
        setFilter(filter => ({
            ...filter,
            priority: newValue
        }));
    };

    const onChangeUserFilter = (newValue: MultiValue<FilterAssignee>, actionMeta: ActionMeta<FilterAssignee>) => {
        setFilter(filter => ({
            ...filter,
            userOption: newValue
        }));
    };

    const onChangeBranchFilter = (newValue: MultiValue<FilterBranch>, actionMeta: ActionMeta<FilterBranch>) => {
        setFilter(filter => ({
            ...filter,
            branches: newValue
        }));

    };


    const handleOrder = (columnName: string) => {
        if (orderBy === columnName) {
            setOrderDesc(!orderDesc);
        } else {
            setOrderBy(columnName);
            setOrderDesc(false);
        }
    };

    const handleRowClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
    };

    const handleSave = () => {
        // Perform save functionality here
        console.log('Saving ticket:', selectedTicket);
        // Close the modal after saving
        setSelectedTicket(null);
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'OPEN':
                return 'bg-yellow-400 text-white';
            case 'ON HOLD':
                return 'bg-red-400 text-white';
            case 'IN PROGRESS':
                return 'bg-blue-400 text-white';
            case 'DONE':
                return 'bg-green-400 text-white';
            default:
                return 'bg-gray-300 text-white';
        }
    };

    const formatTimeDifference = (from: string, to: string) => {
        const currentDate = new Date(from);
        const creationDate = new Date(to);


        const timeDifference = currentDate.getTime() - creationDate.getTime();

        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m ago`;
        } else if (hours > 0) {
            return `${hours}h ${minutes % 60}m ago`;
        } else {
            return `${minutes}m ago`;
        }
    };

    const matchesStatus = (x: Ticket) => {
        if (filter.status.length === 0) return true;
        if (filter.status.some(option => option.value === 4)) return true;
        return filter.status.some(option => option.value === x.status);
    };

    const matchesSearch = (x: Ticket) => {
        if (!filter.search) return true;
        const searchText = filter.search.toLowerCase();
        return (
            x.ticketNumber?.toLowerCase().includes(searchText) ||
            x.title?.toLowerCase().includes(searchText) ||
            x.description?.toLowerCase().includes(searchText) ||
            x.branchName?.toLowerCase().includes(searchText) ||
            x.reporterText?.toLowerCase().includes(searchText)
        );
    };

    const matchesUserOption = (x: Ticket) => {
        if (filter.userOption.length === 0) return true;
        if (filter.userOption.some((option: FilterAssignee) => option.label === "ALL")) return true;
        if (
            filter.userOption.some(
                (option: FilterAssignee) => option.label === "Unassigned" && x.assigneeId === null
            )
        )
            return true;
        return filter.userOption.some((option: FilterAssignee) => option.value === x.assigneeId);
    };

    const matchesBranches = (x: Ticket) => {
        if (filter.branches.length === 0) return true;
        if (filter.branches.some((branch: FilterBranch) => branch.value === "ALL")) return true;
        if (filter.branches.some((branch: FilterBranch) => branch.value === "Unassigned" && x.branchId === null)) return true;
        return filter.branches.some((branch: FilterBranch) => branch.value === x.branchId);
    };

    const departmentBase = parseInt(localStorage.getItem("departmentbase") || "0", 10);

    const filteredItems = currentItems
        .filter((x: Ticket) =>
            matchesStatus(x) &&
            matchesSearch(x) &&
            matchesUserOption(x) &&
            matchesBranches(x) &&
            (filter.priority.length === 0 ? true :
                filter.priority.some(option => option.value === x.priority)
            ) &&
            (departmentBase === 0 || x.departmentBase === departmentBase)
        )
        .sort((a, b) => {
            if (a.priority !== b.priority) {
                return b.priority - a.priority;
            }
            return new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime();
        })
        .filter((item, index, self) =>
            index === self.findIndex((t) => t.ticketNumber === item.ticketNumber)
        );



    return (
        <div className="container mx-auto mt-4">
            {/* <h1 className="mt-6 text-3xl font-bold text-gray-600 text-left">TICKETS</h1> */}
            <div className="flex justify-between mt-4">
                <div className="flex space-x-4">
                    {/* Search Field */}
                    <div className="flex flex-col items-start">
                        <label
                            htmlFor="search-input"
                            className="text-gray-700 font-medium mb-2"
                        >
                            Search
                        </label>
                        <input
                            id="search-input"
                            type="text"
                            className="w-full max-w-xs border border-gray-300 rounded-md p-2"
                            placeholder="Search..."
                            value={filter.search}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="flex flex-col items-start">
                        <label
                            htmlFor="status-input"
                            className="text-gray-700 font-medium mb-2"
                        >
                            Status
                        </label>
                        <Select
                            isMulti
                            options={StatusList}
                            onChange={onChangeStatusFilter}
                            value={filter.status}
                            className={filter.status.length > 1 ? '' : 'w-52'}
                        />
                    </div>

                    <div className="flex flex-col items-start">
                        <label
                            htmlFor="assignee-input"
                            className="text-gray-700 font-medium mb-2"
                        >
                            Assignee
                        </label>
                        <Select
                            isMulti
                            options={AssigneeList}
                            onChange={onChangeUserFilter} // Adjust this as necessary
                            // value={filter.userOption} // Ensure this matches the correct type
                            className={filter.userOption.length > 1 ? '' : 'w-52'}
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <label
                            htmlFor="assignee-input"
                            className="text-gray-700 font-medium mb-2"
                        >
                            Branch
                        </label>
                        <Select
                            isMulti
                            options={BranchList}
                            onChange={onChangeBranchFilter}
                            // value={filter.status}
                            className={filter.branches.length > 1 ? '' : 'w-52'}
                        />
                    </div>

                    <div className="flex flex-col items-start">
                        <label
                            htmlFor="priority-input"
                            className="text-gray-700 font-medium mb-2"
                        >
                            Priotity
                        </label>

                        <Select isMulti
                            options={PriorityList}
                            onChange={onChangePriorityFilter}
                            value={filter.priority}
                            className={filter.priority.length > 1 ? '' : 'w-52'}
                        />
                    </div>

                </div>

                {/* Create Button (commented out) */}
                {/* <Link to="/ticketentry">
                    <button className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">
                        Create
                    </button>
                </Link> */}
            </div>





            <div className="overflow-x-auto mt-4">
                <table className="min-w-full">
                    <thead>
                        <tr>

                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('ticketNumber')}>
                                Ticket Number {orderBy === 'ticketNumber' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('calledIn')}>
                                Called In {orderBy === 'calledIn' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('elapsed')}>
                                Duration {orderBy === 'elapsed' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('title')}>
                                Title {orderBy === 'title' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('branch')}>
                                Branch {orderBy === 'branch' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('branch')}>
                                Department {orderBy === 'departmentBase' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('reporter')}>
                                Reporter {orderBy === 'reporter' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('assignee')}>
                                Assignee {orderBy === 'assignee' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('priorityName')}>
                                Priority {orderBy === 'priorityName' && (orderDesc ? '↓' : '↑')}
                            </th>

                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('status')}>
                                Status {orderBy === 'status' && (orderDesc ? '↓' : '↑')}
                            </th>

                            {/* <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item, index) => (
                            <tr onClick={() => handleRowClick(item)} key={item.ticketNumber} className={`hover:bg-gray-200 ${index !== currentItems.length - 1 ? 'border-b border-gray-300' : ''}`}>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 flex items-center space-x-2">
                                    <CopyButton text={item.ticketNumber} />
                                    <span>{item.ticketNumber}</span>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500"> {item.calledIn
                                    ? new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    }).format(new Date(item.calledIn))
                                    : ''}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{item.status === 0 ? formatTimeDifference(item.timeStamp.toString(), item.calledIn.toString()) : formatTimeDifference(new Date().toString(), item.calledIn.toString())}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{item.title}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{getBranch(item.branchId)}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-left">
                                    {item.departmentBase === DepartmentBase.Default ? "All" : DepartmentBase[item.departmentBase]}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{getUser(item.reporterId)}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{item.assigneeText}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{item.priorityName}</td>
                                <td className="px-3 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(item.statusName.toString())}`}>
                                        {item.statusName}
                                    </span>
                                </td>


                                {/* <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                    <button onClick={() => handleRowClick(item)} className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold px-2 rounded">
                                        View
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
                </p>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {[...Array(Math.ceil(filteredData.length / ITEMS_PER_PAGE))].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => paginate(index + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === index + 1 ? 'z-10 bg-gray-100' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === Math.ceil(filteredData.length / ITEMS_PER_PAGE) ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={currentPage === Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
                        >
                            Next
                        </button>
                    </nav>
                </div>
            </div>


            <TicketViewPopup selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} handleSave={handleSave} isTicketView={false} documentTypes={documentType} users={users} branches={branches} />
            <LoadComponent loading={isLoading} />
        </div>
    );
};

export default Tickets;