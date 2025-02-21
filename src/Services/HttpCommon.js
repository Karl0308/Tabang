import axios from "axios";
const BASE_URLx = "http://localhost:42429/StockValuationReport";
const api = axios.create({
  baseURL: BASE_URLx,
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export default api;
