import axios from "axios";

export default async function getRespondentToken() {
    const response = await axios.get("http://172.16.132.25:8090/respondent-token");
    return `Bearer ${response?.data?.data}`
}