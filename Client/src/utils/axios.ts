import axios from 'axios'

// Export API_BASE_URL so it can be used in other files
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Helper function to get the full image URL from a relative path
 * @param imagePath - The image path from the API (e.g., "uploads/user/image.jpg")
 * @param fallback - Fallback image if imagePath is empty or undefined
 * @returns Full URL to the image
 */
export const getImageUrl = (imagePath: string | undefined | null, fallback: string = "/logo/profile-default.png"): string => {
    if (!imagePath || imagePath.trim() === "") {
        return fallback;
    }
    // If it's already an absolute URL (http/https) or starts with /, return as-is
    // Note: If it starts with / but isn't a public asset, it might still need API_BASE_URL, 
    // but usually "uploads/" paths come without leading slash from this API.
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("/")) {
        return imagePath;
    }
    // Otherwise, prefix with API base URL
    return `${API_BASE_URL}/${imagePath}`;
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

export default api
