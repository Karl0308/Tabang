// const baseURL = process.env.REACT_APP_WEBSERVICE_URL;
// const baseURL = localStorage.getItem("baseurl");
const baseURL = "http://apps.everyone.ph/istestapi/";
// const baseURL = "http://dev.iloilosupermart.com/ugcapi/";
// const baseURL = "http://localhost/ugcapi/";
// const baseURL = "https://localhost:7171/";
// const baseURL = "http://localhost:5178/";
export const APIURLS = {
    ticket: {
        ticketBase: baseURL + 'api/Ticket/',
        getTickets: baseURL + 'api/ticket/gettickets',
        getTicketSearch: baseURL + 'api/ticket/getTicketSearch?search=',
        updateTicket: baseURL + 'api/Ticket/UpdateTicket',
        saveTicket: baseURL + 'api/Ticket/SaveTicket',
        getTicketNum: baseURL + 'api/Ticket/GetTicketNum?ticketNum=',
        getTicketHistoriesById: baseURL + 'api/Ticket/GetTicketHistoriesById?_ticketId=',
        getTicketCommentsById: baseURL + 'api/Ticket/GetTicketCommentsById?_ticketId=',
        getTicketRelatedIssuesById : baseURL + 'api/Ticket/getTicketRelatedIssuesById?_ticketId=',
        getTicketAttachmentById: baseURL + 'api/Ticket/getTicketAttachmentById?_ticketId=',
        getAttachmentById: baseURL + 'api/Ticket/getAttachmentById?_attachmentId=',
        saveTicketComment: baseURL + 'api/Ticket/SaveTicketComment',
        saveStarRating: baseURL + 'api/Ticket/SaveStarRating?',
        saveTicketProp: baseURL + 'api/Ticket/saveTicketProp?',
        saveTicketLink: baseURL + 'api/Ticket/addLinkTicket',
        editComment: baseURL + 'api/Ticket/EditComment?',
        deleteComment: baseURL + 'api/Ticket/DeleteComment?',
        catchup : baseURL + 'api/Ticket/Catchup?',
        getTicketCatchup: baseURL + 'api/Ticket/getTicketCatchup?ticketId=',

    },
    user: {
        getUsers: baseURL + 'api/User/GetUsers',
        getAllUserAssignees: baseURL + 'api/User/GetAllUserAssignees',
        saveUsers: baseURL + 'api/User/SaveUser',
        saveUser: baseURL + 'api/Auth/CreateUser',
        getUserId: baseURL + 'api/User/GetUserId?id=',
        login: baseURL + 'api/Auth/Login',
        loginEmail: baseURL + 'api/Auth/LoginEmail',
        updateUser: baseURL + 'api/Auth/UpdateUser',
        resetPassword: baseURL + 'api/Auth/ResetPassword',
        getUserSignature: baseURL + 'api/User/GetUserSignatureById?_userId=',
        getUsersSignatureOvertime: baseURL + 'api/User/GetUsersSignatureOvertime?id=',
        deleteUser: baseURL + 'api/Auth/Delete/',

    },
    branch: {
        getBranches: baseURL + 'api/branch/GetBranches?isAll=',
        saveBranch: baseURL + 'api/branch/SaveBranch',
        deleteBranch: baseURL + 'api/branch/Delete/',
        addBranchMember: baseURL + 'api/branch/SaveBranchMember/',
    },
    documenttype:{
        getDocumentTypes : baseURL + 'api/documentType/GetDocumentTypes?isAll=',
        saveDocumentType : baseURL + 'api/documentType/SaveDocumentType',
        deleteDocumentType: baseURL + 'api/documentType/Delete/',
    },
    notification: {
        getNotifications: baseURL + 'api/notification/GetNotifications?userId=',
        readNotifications: baseURL + 'api/notification/ReadNotification?notifId='
    },
    groups: {
        getSubDepartments: baseURL + 'api/department/GetSubDepartments',
        saveSaveSubDepartment: baseURL + 'api/department/SaveSubDepartment',
        addMember: baseURL + 'api/department/addMember',
        removeMember: baseURL + 'api/department/removeMember?_memberId=',
        setSupervisor: baseURL + 'api/department/setSupervisor?_memberId='
    },
    overtime: {
        getOvertimes: baseURL + 'api/overtime/GetOvertimes?_supId=',
        saveOvertime: baseURL + 'api/overtime/SaveOvertime',
        approveOvertime: baseURL + 'api/overtime/approveOvertime?',
    },
    appsetting: {
        saveAppSetting: baseURL + 'api/appsetting/SaveAppSetting',
        getAppSettings: baseURL + 'api/appsetting/GetAppSettings',
    },
    asset: {
        getAssets: baseURL + 'api/Assets/GetAssets',
        getAssetTags: baseURL + 'api/Assets/GetAssetTags',
        deleteAsset: baseURL + 'api/Assets/Delete/',
        getAssetById: baseURL + 'api/Assets/GetAsset/',
        addAsset: baseURL + 'api/Assets/AddAsset',
        editAsset: baseURL + 'api/Assets/EditAsset',
        getTicketAssetTags: baseURL + 'api/Assets/GetTicketAssetTags/',
        getAssetTagByTicketId: baseURL + 'api/Assets/GetAssetTagByTicketId/',
        deleteTicketAsset: baseURL + 'api/Assets/DeleteTicketAsset/'
        
        }

}

