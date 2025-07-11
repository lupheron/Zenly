import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_API_URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default api
