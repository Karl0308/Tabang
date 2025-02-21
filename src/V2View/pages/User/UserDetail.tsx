
import React, { useState, useRef, useEffect } from 'react';
import { Branch } from '../../objects/Branch';
import { User } from '../../objects/User';
import { DepartmentBase } from '../../objects/enum';
interface ModalProps {
    selected: User | null;
    setSelected: React.Dispatch<React.SetStateAction<User | null>>;
    handleSave: () => void;
    branches: Branch[];
}

const UserDetail: React.FC<ModalProps> = ({ selected, setSelected, handleSave, branches }) => {
    // const [data, setData] = useState(selected ? selected.name : '');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const saveData = async () => {
        handleSave();
    };

    const handleClose = () => {
        setSelected(null);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {

                setSelected(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const departments = Object.entries(DepartmentBase)
        .filter(([key, value]) => isNaN(Number(key))) // Filter out reverse-mapped numbers
        .map(([key, value]) => ({ id: value as number, name: key }));

    return (
        <div
            ref={dropdownRef}
            className={`
    fixed top-0 left-0 h-screen w-full md:w-1/3 bg-white border border-gray-300 
    shadow-lg z-50 transform transition-transform duration-1000 
    ${selected ? 'translate-x-0' : '-translate-x-full'} 
    overflow-y-auto max-h-screen
  `}
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4 pb-6 bg-slate-200 p-4">
                    <h2 className="text-2xl font-bold underline">USER DETAILS</h2>
                    <button onClick={() => setSelected(null)} className="text-gray-600 hover:text-gray-800">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 font-semibold text-left">Full Name:</p>
                    <input type="text" className="w-full bg-gray-100 border border-gray-300 rounded-md py-1 px-3" value={selected ? selected.fullName : ''} onChange={(e) => {
                        if (selected) {
                            setSelected({ ...selected, fullName: e.target.value });
                        }
                    }} />
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 font-semibold text-left">Username:</p>
                    <input disabled={selected?.id === 0 ? false : true} type="text" className="w-full bg-gray-100 border border-gray-300 rounded-md py-1 px-3" value={selected ? selected.userName : ''} onChange={(e) => {
                        if (selected) {
                            setSelected({ ...selected, userName: e.target.value });
                        }
                    }} />
                </div>
                <div className="mb-4" hidden={selected?.id === 0 ? false : true}>
                    <p className="text-gray-700 font-semibold text-left">Password:</p>
                    <input type="password" className="w-full bg-gray-100 border border-gray-300 rounded-md py-1 px-3" value={selected ? selected.password : ''} onChange={(e) => {
                        if (selected) {
                            setSelected({ ...selected, password: e.target.value });
                        }
                    }} />
                </div>
                <div className="mb-4" hidden={selected?.id === 0 ? false : true}>
                    <p className="text-gray-700 font-semibold text-left">Confirm Password:</p>
                    <input disabled={selected?.id === 0 ? false : true} type="password" className="w-full bg-gray-100 border border-gray-300 rounded-md py-1 px-3" value={selected ? selected.repassword : ''} onChange={(e) => {
                        if (selected) {
                            setSelected({ ...selected, repassword: e.target.value });
                        }
                    }} />
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 font-semibold text-left">Email:</p>
                    <input type="email" className="w-full bg-gray-100 border border-gray-300 rounded-md py-1 px-3" value={selected ? selected.email : ''} onChange={(e) => {
                        if (selected) {
                            setSelected({ ...selected, email: e.target.value });
                        }
                    }} />
                </div>

                <div className="mb-4">
                    <label className="text-gray-700 font-semibold text-left block mb-2">Branch:</label>
                    <select
                        className="w-full bg-gray-100 border border-gray-300 rounded-md py-1 px-3"
                        value={selected?.branchId || ""}
                        onChange={(e) => {
                            if (selected) {
                                setSelected({ ...selected, branchId: Number(e.target.value) });
                            }
                        }}
                    >
                        <option value="" disabled>Select a branch</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="text-gray-700 font-semibold text-left block mb-2">
                        Department:
                    </label>
                    <select
                        className="w-full bg-gray-100 border border-gray-300 rounded-md py-1 px-3"
                        value={selected?.departmentBase || ""}
                        onChange={(e) => {
                            if (selected) {
                                setSelected({ ...selected, departmentBase: Number(e.target.value) });
                            }
                        }}
                    >
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="mb-4">
                    <label className="text-gray-700 font-semibold text-left block mb-2">Position:</label>
                    <select
                        className="w-full bg-gray-100 border border-gray-300 rounded-md py-1 px-3"
                        value={selected?.role}
                        onChange={(e) => {
                            if (selected) {
                                setSelected({ ...selected, role: Number(e.target.value) });
                            }
                        }}
                    >
                        <option value={0}>Admin</option>
                        <option value={1}>Assignee</option>
                        <option value={2}>Reporter</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="text-gray-700 font-semibold text-left block mb-2">Status:</label>
                    <select
                        className="w-full bg-gray-100 border border-gray-300 rounded-md py-1 px-3"
                        value={selected?.active ? 'true' : 'false'}
                        onChange={(e) => {
                            if (selected) {
                                setSelected({ ...selected, active: e.target.value === 'true' });
                            }
                        }}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>


                <div className="flex justify-between">
                    <button onClick={() => setSelected(null)} className="flex-grow px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 m-2">Close</button>
                    <button
                        onClick={saveData}
                        className="flex-grow px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 m-2">Save</button>
                </div>
            </div>

        </div>

    );
};

export default UserDetail;