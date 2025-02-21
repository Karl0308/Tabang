import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import TicketList from "./TicketList"
import UserList from "./UserList"
import LoadingSpinner from './LoadingSpinner';
import NoPage from './NoPage'
import Layout from './Layout';
import TicketView from './TicketView';
import Login from './Login';

import axios from 'axios';
import './Login.css'; // Import your CSS file
import Loading from './components/Loading';
import { APIURLS } from "./APIURLS";

import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { Container, Button } from 'react-bootstrap';
import { PageLayout } from './components/PageLayout';
import { IdTokenData } from './components/DataDisplay';
import { loginRequest } from './authConfig';
import { NavigationBar } from './components/NavigationBar';
import BranchList from './BranchList';
import ViewTicketLink from './ticketcomponents/ViewTicketLink';
import SubDepartmentList from '../src/SubDepartmentList';
import OvertimeList from './OvertimeList';
import AppSettings from './AppSettings';
import AssetList from './assetComponents/AssetList';
import AssetForm from './assetComponents/AssetForm';
import { ToastContainer } from 'react-toastify';
import UserListNotEmail from './UserListNotEmail';
import logo from './img/BIRLogo.png';
import DocumentTypeList from './modules/DocumentTypeModules/DocumentTypeList';
import LoginV2 from './V2View/Login';
import Main from './V2View/Main';
import Branches from './V2View/pages/Branch/Branches';
import DocumentTypes from './V2View/pages/DocumentType/DocumentTypes';
import Users from './V2View/pages/User/Users';
import Assets from './V2View/pages/Asset/Assets';
import Home from './V2View/Home';
import Tickets from './V2View/pages/Ticket/Tickets';
import TicketEntry from './V2View/pages/Ticket/TicketEntry';

const MainContent = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const [username, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [iserror, setisError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const baseName = "/istest";

  return (
    <div className="App">
          <BrowserRouter basename={baseName}>
              <Routes>
                <Route path="/submitticket" element={<TicketEntry />}>
                </Route>
                <Route path="/" element={localStorage.getItem('token') != null || localStorage.getItem('token') != undefined ? <Main /> :<LoginV2 /> }>
                {/* this is V1 */}
                {/* <Route path="/" element={localStorage.getItem('token') != null || localStorage.getItem('token') != undefined ? <Layout /> :<LoginV2 /> }> */} 
                  <Route index element={<Tickets idTokenClaims={activeAccount ? activeAccount.idTokenClaims : ""} />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/ticketentry" element={<TicketEntry />} />
                  <Route path="/" element={<Tickets />} />
                  <Route path="/:ticketNum" element={<Tickets />} />
                  <Route path="/ticketview/:ticketNum" element={<ViewTicketLink />} />
                  {/* <Route path="/userold" element={<UserListNotEmail />} /> */}
                  <Route path="/userold" element={<UserList />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/branches" element={<Branches />} />
                  <Route path="/documenttypes" element={<DocumentTypes />} />
                  <Route path="/groups" element={<SubDepartmentList />} />
                  <Route path="/overtime" element={<OvertimeList />} />
                  <Route path="/settings" element={<AppSettings />} />
                  <Route path="/assets" element={<Assets />} />
                  <Route path="/documenttype" element={<DocumentTypes />} />
                  {/* <Route path="/assets" element={<AssetList />} />
                  <Route path="/asset/:assetid?" element={<AssetForm />} /> */}
                  <Route path="*" element={<NoPage />} />
                  
                </Route>
              </Routes>
            </BrowserRouter>
    </div>
  );
};

const App = ({ instance, baseURL }) => {
  return (
    <MsalProvider instance={instance}>
      {/* <PageLayout> */}
      <MainContent />
      {/* </PageLayout> */}
    </MsalProvider>
  );
};

export default App;
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);

