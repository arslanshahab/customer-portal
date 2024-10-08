import axios from "axios";
import { BASE_API_URL } from "../constants";

export const httpService = axios.create({
    baseURL: BASE_API_URL,
    timeout: 60000,
});