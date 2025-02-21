import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PdfExportWithFormAndImage = ({ ticket }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const contentRef = useRef(null);

    const handleDownloadPdf = () => {
        const content = contentRef.current;
        if (content) {
            html2canvas(content).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pageWidth = pdf.internal.pageSize.getWidth();
                const imgWidth = pageWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save('form-and-image.pdf');
            });
        }
    };

    const handlePrint = () => {
        const content = contentRef.current;
        if (content) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(content.outerHTML);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div>
            {/* Button to Open Modal */}
            <button onClick={toggleModal}>Print</button>

            {/* Modal */}
            {isModalOpen && (
                <div className="pdf-overlay">
                    <div className="pdf-content">
                        <span className="close" onClick={toggleModal}>&times;</span>
                        <div ref={contentRef} style={{ padding: 20, border: '1px solid #ccc', backgroundColor: 'white' }}>
                            <h1>RDO Ref. No. {ticket.ticketNumber}</h1>

                            {/* Form Section */}
                            <form>
                                <div>
                                    <label><b>Title:</b></label>
                                    <div>{ticket.documentTypeName}</div>
                                </div>
                                <div>
                                    <label><b>Description:</b></label>
                                    <div>{ticket.description}</div>
                                </div>
                                <div>
                                    <label><b>Status:</b></label>
                                    <div>{ticket.statusName}</div>
                                </div>
                                <div>
                                    <label><b>Date Filed:</b></label>
                                    <div>{ticket.calledInText}</div>
                                </div>
                                <div>
                                    <label><b>Due Date:</b></label>
                                    <div>{ticket.dueDateText}</div>
                                </div>
                                <div>
                                    <label><b>Section:</b></label>
                                    <div>{ticket.branchName}</div>
                                </div>
                                <div>
                                    <label><b>Assignee:</b></label>
                                    <div>{ticket.branchMemberAssigneeName}</div>
                                </div>
                                <div>
                                    <label><b>Reporter:</b></label>
                                    <div>{ticket.reporterText}</div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Buttons */}
                        <button onClick={handleDownloadPdf}>Download as PDF</button>
                        <button onClick={handlePrint} style={{ marginLeft: '10px' }}>Print</button>
                    </div>
                </div>
            )}

            {/* Modal Styling */}
            <style>{`
        .pdf-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .pdf-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          width: 600px;
          max-width: 90%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          position: relative;
        }
        .close {
          position: absolute;
          top: 0px;
          right: 10px;
          cursor: pointer;
          font-size: 24px;
          font-weight: bold;
        }
      `}</style>
        </div>
    );
};

export default PdfExportWithFormAndImage;
