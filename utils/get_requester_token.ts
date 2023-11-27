import axios from "axios";

export default async function getRequesterToken() {
    const response = await axios.get("http://172.16.132.25:8090/requester-token");
    return `Bearer ${response?.data?.data}`
}