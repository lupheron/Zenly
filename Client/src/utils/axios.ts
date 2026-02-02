import axios from 'axios'

// Export API_BASE_URL so it can be used in other files
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Helper function to get the full image URL from a relative path
 * @param imagePath - The image path from the API (e.g., "uploads/user/image.jpg")
 * @param fallback - Fallback image if imagePath is empty or undefined
 * @returns Full URL to the image
 */
export function getImageUrl(imagePath: string | undefined | null, fallback: string = "/logo/profile-default.png"): string {
    if (!imagePath || imagePath.trim() === "") {
        return fallback;
    }

    // If it's already an absolute URL (http/https), return as-is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }

    // If it's a known public frontend asset (like /logo/), return as-is
    if (imagePath.startsWith("/logo/")) {
        return imagePath;
    }

    // Ensure no double slash when joining
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

    // Prefix with API base URL for uploads or other backend paths
    return `${API_BASE_URL}/${cleanPath}`;
}

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
