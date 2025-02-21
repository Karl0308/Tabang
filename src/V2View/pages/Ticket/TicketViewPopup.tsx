import React, { useState } from 'react';
import { Ticket } from '../../objects/Ticket';
import StarRating from '../../component/StarRating';
import fileIcon from '../images/file.png';
import QRCode from 'react-qr-code';
import applogo from '../images/applogo.png'
import TicketDetail from './TicketDetail';
import { DocumentType } from '../../objects/DocumentType';
import { User } from '../../objects/User';
import { Branch } from '../../objects/Branch';


interface TicketDetailsProps {
    selectedTicket: Ticket | null;
    setSelectedTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
    handleSave: () => void;
    isTicketView : boolean | true;
    documentTypes : DocumentType[];
    users: User[];
    branches: Branch[];
}

const TicketViewPopup = ({ selectedTicket, setSelectedTicket, handleSave , isTicketView, documentTypes, users, branches }: TicketDetailsProps) => {
    return (
        <div className={`fixed top-0 left-0 h-full w-full md:w-[80%] bg-white border border-gray-300 shadow-lg z-50 transform transition-transform duration-1000 ${selectedTicket ? 'translate-x-0' : '-translate-x-full'} p-4`}>
            <TicketDetail selected={selectedTicket} setSelected={setSelectedTicket} handleSave={handleSave} isTicketView={false} documentTypes={documentTypes} users={users} branches={branches}/>
        </div>
    );
};

export default TicketViewPopup;
