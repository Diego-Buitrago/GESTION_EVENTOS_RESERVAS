import axios from "axios";

const axiosApi = axios.create({
    // baseURL: 'http://localhost:5000',
    baseURL: '/',
})

export { axiosApi };