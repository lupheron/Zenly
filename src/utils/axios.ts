import axios from 'axios'

const api = axios.create({
    baseURL: 'http://zenlyserver.test/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

export default api
