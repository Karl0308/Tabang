import React, { useState, useEffect } from 'react';
import UserDetail from './UserDetail';
import LoadComponent from '../../component/LoadComponent';
import { User } from '../../objects/User';
import axios from "axios";
import { APIURLS } from '../../../APIURLS';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Branch } from '../../objects/Branch';
import { DepartmentBase } from '../../objects/enum';

const ITEMS_PER_PAGE = 10;

const Users = () => {

    const [dataInitialState, setDatainitialState] = useState<User>({ id: 0, fullName: '', userName: '', password: '', repassword: '', email: '', branchId: 0, branchName: '', active: true, activeText: '', role: 0, roleText: '', departmentBase: DepartmentBase.Default });
    const [data, setData] = useState<User[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderBy, setOrderBy] = useState('');
    const [orderDesc, setOrderDesc] = useState(false);
    const [selected, setSelected] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const axiosInstance = axios.create({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    });
    const notifyError = (message: string) => toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    });


    const fetchData = () => {
        setIsLoading(true);
        axiosInstance.get(APIURLS.user.getUsers)
            .then(res => res.data)
            .then(
                (result) => {
                    setData(result);
                    setIsLoading(false);
                },
                (error) => {
                    setIsLoading(false);
                }
            )
    }
    const fetchBranches = () => {
        setIsLoading(true);
        axiosInstance.get(APIURLS.branch.getBranches + 'false')
            .then(res => res.data)
            .then(
                (result) => {
                    setBranches(result);
                    setIsLoading(false);
                },
                (error) => {
                    setIsLoading(false);
                }
            )
    }
    useEffect(() => {
        fetchBranches();
        fetchData();
    }, []);

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

    let filteredData = data.filter(item =>
        item.fullName.toLowerCase().includes(searchQuery.toLowerCase())
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
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleOrder = (columnName: string) => {
        if (orderBy === columnName) {
            setOrderDesc(!orderDesc);
        } else {
            setOrderBy(columnName);
            setOrderDesc(false);
        }
    };

    const handleRowClick = (data: User) => {
        setSelected(data);
    };

    const handleDelete = (data: User) => {
        const deletePromise = axiosInstance.delete(APIURLS.branch.deleteBranch + data.id)
            .then(res => {
                setData(prevData => prevData.filter(item => item.id !== data.id));
                setSelected(null);
            });

        toast.promise(
            deletePromise,
            {
                pending: "Deleting Branch...",
                success: "Branch Deleted!",
                error: "Error Deleting Branch."
            },
            {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light"
            }
        );
    };

    const AddData = () => {
        setSelected(dataInitialState);
    };

    const handleSave = (selected: any) => {
        if (selected.fullName.length < 1 || selected.email.length < 1 || selected.userName.length < 1) {
            notifyError("Please complete all fields!")
            return;
        }
        if (selected.password !== null && selected.password.length < 1) {
            notifyError("Please complete all fields!")
            return;
        }
        if (selected.id == 0) {
            if (selected.password !== selected.repassword) {
                notifyError("Password doesnt match!")
                return;
            }
        }

        let isAdd = selected.id === 0 ? true : false;
        console.log(selected);

        const AddPromise = axiosInstance.post(APIURLS.user.saveUsers, selected)
            .then(res => {
                res.data.branchName = branches.find(branch => branch.id === res.data.branchId)?.name;
                setData(prevData =>
                    isAdd
                        ? [...prevData, res.data]
                        : prevData.map(item => item.id === res.data.id ? res.data : item)
                );
                setSelected(null);
            });

        toast.promise(
            AddPromise,
            {
                pending: selected.id === 0 ? "Adding User..." : "Updating User...",
                success: selected.id === 0 ? "User Added!" : "User Updated!",
                error: "Error Saving User!"
            },
            {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light"
            }
        );
    };

    return (
        <div className="container">
            {/* <h1 className="mt-6 text-3xl font-bold text-gray-600">BRANCH LIST</h1> */}
            <div className="flex justify-between items-center mt-4">
                <input
                    type="text"
                    className="w-full max-w-xs border border-gray-300 rounded-md p-2 mr-2"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <button onClick={() => AddData()} className="flex items-center justify-center bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">
                    Add User
                </button>

            </div>
            <div className="overflow-x-auto mt-4">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('fullName')}>
                                Full Name {orderBy === 'fullName' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('userName')}>
                                Username {orderBy === 'userName' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('email')}>
                                Email {orderBy === 'email' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('branchName')}>
                                Branch {orderBy === 'branchName' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('branchName')}>
                                Department {orderBy === 'departmentBase' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('roleText')}>
                                Position {orderBy === 'roleText' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleOrder('activeText')}>
                                Status {orderBy === 'activeText' && (orderDesc ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={item.id} className={`hover:bg-gray-200 ${index !== currentItems.length - 1 ? 'border-b border-gray-300' : ''}`}>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-left">{item.fullName}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-left">{item.userName}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-left">{item.email}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-left">{item.branchName}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-left">
                                    {item.departmentBase === DepartmentBase.Default ? "All" : DepartmentBase[item.departmentBase]}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-left">{item.roleText}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-left">{item.activeText}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-left">
                                    {/* <button onClick={() => handleRowClick(item)} className="text-blue-500 hover:text-blue-700 mr-2">View</button> */}
                                    <button onClick={() => handleRowClick(item)} className="mx-2 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold px-2 rounded">
                                        View
                                    </button>
                                </td>
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

            <UserDetail selected={selected} setSelected={setSelected} handleSave={() => handleSave(selected)} branches={branches} />
            <LoadComponent loading={isLoading} />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default Users;