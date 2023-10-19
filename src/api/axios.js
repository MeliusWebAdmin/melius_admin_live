import axios from "axios";

const api = axios.create({
    baseURL: "https://meliuswebsite.pythonanywhere.com/api",
});

export default api;

