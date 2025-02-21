
import React, { useRef, useState } from 'react';
// import Altcha from './Altcha';
import 'altcha'
import './App.css'; // Make sure to have some basic styles for the popup
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container, Row, Col, Input, Label, Table } from "reactstrap";

const PopupForm = ({ onClose, onCaptchaComplete, ticketId }) => {
    const altchaRef = useRef(null);
    const [comment, setCommment] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();

        onCaptchaComplete({ comment, captchaValue: altchaRef.current?.value, ticketId });
        onClose();
    };
    return (

        <div style={{ padding: "10px" }} >
            <div style={{ marginLeft: "6px", fontSize: "24px", color: "#223E58", fontWeight: "500" }}>Catch Up:</div>

            <form onSubmit={handleSubmit}>
                <fieldset>
                    {/* <Altcha ref={altchaRef} /> */}
                    <altcha-widget
                        ref={altchaRef}
                        style={{
                            '--altcha-max-width': '100%',
                        }}
                        debug
                        test
                    ></altcha-widget>
                </fieldset>
                <div style={{ marginTop: "10px" }} >
                    <Button type="submit" style={{ fontWeight: 'bold', fontSize: '16px', marginRight: "10px" }}>
                        Submit
                    </Button>
                    <Button variant="outline-danger" onClick={onClose} style={{ fontWeight: 'bold', fontSize: '16px' }} active>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>

    );
};

function AltchaCaptcha({ ticketId, onCaptchaComplete }) {
    const [isOpen, setIsOpen] = useState(false);

    const openPopup = () => setIsOpen(true);
    const closePopup = () => setIsOpen(false);

    return (

        <div >
            <Button
                className="w-full bg-blue-300 font-bold text-xl border border-blue-300 rounded-md py-4 px-4 appearance-none text-center"
                onClick={openPopup}
            >
                Catch Up
            </Button>
            <Modal show={isOpen} onHide={closePopup} >
                <PopupForm onClose={closePopup} onCaptchaComplete={onCaptchaComplete} ticketId={ticketId} />
            </Modal>
        </div>
    );
}

export default AltchaCaptcha;
