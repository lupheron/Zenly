/**
 * Centralized Google Maps API loader
 * Ensures the Google Maps API is loaded only once across the entire application
 */

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        google: any;
        googleMapsLoadPromise?: Promise<void>;
    }
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBcWHnpjwWA7Ju8-ZKL98uVb5QjYorrQsQ'
const GOOGLE_MAPS_URL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`

/**
 * Loads the Google Maps API if not already loaded
 * @returns Promise that resolves when Google Maps is ready
 */
export const loadGoogleMaps = (): Promise<void> => {
    // If Google Maps is already loaded, resolve immediately
    if (window.google && window.google.maps) {
        return Promise.resolve()
    }

    // If a load is already in progress, return the existing promise
    if (window.googleMapsLoadPromise) {
        return window.googleMapsLoadPromise
    }

    // Check if the script is already in the DOM (but hasn't loaded yet)
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`)
    if (existingScript) {
        // Script exists but hasn't loaded - wait for it
        window.googleMapsLoadPromise = new Promise((resolve, reject) => {
            existingScript.addEventListener('load', () => resolve())
            existingScript.addEventListener('error', reject)
        })
        return window.googleMapsLoadPromise
    }

    // Create and inject the script
    window.googleMapsLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = GOOGLE_MAPS_URL
        script.async = true
        script.defer = true

        script.onload = () => {
            console.log('Google Maps API loaded successfully')
            resolve()
        }

        script.onerror = (error) => {
            console.error('Failed to load Google Maps API:', error)
            window.googleMapsLoadPromise = undefined
            reject(error)
        }

        document.head.appendChild(script)
    })

    return window.googleMapsLoadPromise
}

/**
 * Checks if Google Maps API is available
 * @returns true if Google Maps is loaded and ready
 */
export const isGoogleMapsLoaded = (): boolean => {
    return !!(window.google && window.google.maps)
}
