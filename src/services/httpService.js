import axios from "axios";

const BASE_URL = "http://localhost:5296/api";

export const httpService = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
});