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
                    </Modal>