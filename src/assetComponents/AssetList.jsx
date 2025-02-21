import React, { useEffect, useState } from 'react'
import Table from "../common/Table"
import { Container, Row as RowReact, Col as ColReact, Input, Label, Table as TableReact } from "reactstrap";
import RPaginate from '../common/RPaginate';
import { Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { Link } from "react-router-dom"
import { confirmAlert } from 'react-confirm-alert';
import axios from "axios"
import { keepPreviousData, useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { APIURLS } from "../APIURLS";
import { toast } from 'react-toastify';
import { FaLandmark } from 'react-icons/fa';
const axiosInstanceGet = axios.create({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("token")}`
  }
});
const getAssets = async (params) => {
  axiosInstanceGet.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
  const response = await axiosInstanceGet.get(
    APIURLS.asset.getAssets, { params }
  );
  return response.data;
};

const deleteAsset = (assetId) => {
  axiosInstanceGet.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
  return axiosInstanceGet.delete(APIURLS.asset.deleteAsset + assetId);
}

const AssetList = () => {
  const queryClient = useQueryClient()

  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [sortColumn, setSortColumn] = useState({
    path: "code",
    order: "asc",
  });

  const requery = () => {
    queryClient.invalidateQueries({ queryKey: ['getAssets'] });
  };

  useEffect(() => {
    requery();
  }, [searchTerm, currentPage, sortColumn]);
  const deleteAssetMutation = useMutation({
    mutationFn: deleteAsset,
    onSuccess: (data, variables, context) => {
      toast("Asset Deleted!");
      requery();
    }
  });

  const queryObject = {
    searchTerm: searchTerm,
    totalCount: totalCount,
    currentPage: currentPage,
    pageSize: pageSize,
    sortColumnPath: sortColumn.path,
    sortColumnOrder: sortColumn.order
  };

  const {
    data: dataFromAPI,
    isError,
    error,
    isPending,
    status,
  } = useQuery({
    queryKey: ['getAssets', queryObject],
    queryFn: () => getAssets(queryObject),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (status === "success") {
      setSearchTerm(dataFromAPI.searchTerm);
      setTotalCount(dataFromAPI.totalCount);
      setCurrentPage(dataFromAPI.currentPage);
      setPageSize(dataFromAPI.pageSize);
      setSortColumn({
        path: dataFromAPI.sortColumnPath,
        order: dataFromAPI.sortColumnOrder
      });
    }
  }, [dataFromAPI]);
  if (isPending) return <div>Fetching data...</div>;
  if (isError) return <div>An error occurred: {error.message}</div>;



      const columns = [        
        { path: "code", label: "Asset Tag" },
        { path: "name", label: "Description" },
        { path: "branch", label: "Branch" },
        { path: "equipment", label: "Category" },        
        {key:"Actions", label: "Actions", content: (e) => {            
         return <div><Link to={"/asset/" + e.id} className='btn btn-warning btn-sm'>Edit</Link><Button onClick={() => handleRemoveAsset(e)} className="m-2" variant="danger" size="sm">Remove</Button><Button onClick={() => getTicketAsset(e.id)} variant="primary" size="sm">View Ticket</Button></div> }}
      ];

  const handleRemoveAsset = (asset) => {
    confirmAlert({
      title: 'Confirm remove',
      message: 'Are you sure to do remove asset ' + asset.code + "?",
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deleteAssetMutation.mutate(asset.id);
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const handleSort = (pSortColumn) => {
    setSortColumn(pSortColumn);
  };

  const handlePageChange = (event) => {
    setCurrentPage(event.selected + 1);
  };

  const handleFilter = (event) => {
    if (internalSearchTerm) {
      setSearchTerm(internalSearchTerm);
    }
    else {
      requery();
    }
  };

  const handleRefresh = (event) => {
    setInternalSearchTerm("");
    setSearchTerm("");
  };

      const getTicketAsset = async (assetId) => {
        setShow(true);
        setIsLoading(true);
        axiosInstanceGet.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
        const response = await axiosInstanceGet.get(APIURLS.asset.getTicketAssetTags + assetId);
        setTickets(response.data);
        setIsLoading(false);
        // console.log(response.data);
      }
    
          
      /* Remove if server side: */
      /*
      let offset = (currentPage - 1) * pageSize;
      let pagedItems = _.drop(dataFromAPI.assets, offset).slice(0, pageSize);

  const sorted = _.orderBy(
    pagedItems,
    [sortColumn.path],
    [sortColumn.order]
  );

  const dataList = sorted.map((row) => ({ ...row, _id: row.code }));
  */
  /**********/
  return (
    <div className='mt-3'>
        <h3 className="text-start">Assets</h3>
        <Form className='my-2'>
            <Row>                
                <Col>                
                <Form.Control value={internalSearchTerm} onChange={(e) => setInternalSearchTerm(e.target.value)} type="text" maxLength={50} placeholder="Search..." />                                    
                </Col>
                <Col>
                  <div className="d-flex justify-content-start">
                    <Button style={{ position: "relative", top: "5px"}} onClick={handleFilter} variant="primary" type="button" size="sm">
                        Filter
                    </Button>
                    <Button style={{ position: "relative", top: "5px"}} onClick={handleRefresh} className='ms-2' variant="success" type="button" size="sm">
                        Refresh
                    </Button>
                    </div>
                </Col>                
            </Row>        
        </Form>
        <div className="d-flex justify-content-start">
          <Link to={"/asset/"} className='btn btn-success my-1'>Create New</Link>
        </div>
        <Table columns={columns} sortColumn={sortColumn} onSort={handleSort} data={dataFromAPI.assets} />
        <br />
        <RPaginate onPageChange={handlePageChange} totalCount={totalCount} currentPage={currentPage - 1} pageSize={pageSize} />

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tickets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <h3>Fetching Data.....</h3>
          ) : (
            <TableReact responsive hover >
              <thead>
                <tr>
                  <th style={{ minWidth: "160px" }}>
                    <Button
                      style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                      size="lg"
                      type="button"
                    >
                      RDO Ref. No.
                    </Button>
                  </th>
                  <th>
                    <Button
                      style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                      size="lg"
                      type="button"
                    >
                      Title
                    </Button>
                  </th>
                  <th>
                    <Button
                      style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                      size="lg"
                      type="button"
                    >
                      Section
                    </Button>
                  </th>

                  <th>
                    <Button
                      style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                      size="lg"
                      type="button"
                    >
                      Assignee
                    </Button>
                  </th>
                  <th>
                    <Button
                      style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                      size="lg"
                      type="button"
                    >
                      Status
                    </Button>
                  </th>
                  <th>
                    <Button
                      style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                      size="lg"
                      type="button"
                    >
                      Priority
                    </Button>
                  </th>
                  <th>
                    <Button
                      style={{ backgroundColor: "transparent", color: "#3B82F6", border: "none", fontSize: "16px", letterSpacing: "1px" }}
                      size="lg"
                      type="button"
                    >
                      Action
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>
                        {item.ticketNumber}
                      </td>
                      <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.title}</td>
                      <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.branchName}</td>
                      <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.assigneeText}</td>
                      <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.statusName}</td>
                      <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>{item.priorityName}</td>
                      <td style={{ color: "##000000", fontSize: "14px", fontWeight: "500", letterSpacing: "0.78px", whiteSpace: "normal", overflowWrap: "break-word", wordWrap: "break-word" }}>
                        <Button onClick={() => window.open(window.location.origin + "/ugc/ticketview/" + item.ticketNumber, '_blank')}>View</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </TableReact>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default AssetList