const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // Handle CORS
        image.src = url
    })

export const cropImage = (imageSrc: string, croppedAreaPixels: any): Promise<string> => {
    return new Promise((resolve) => {
        const image = new Image()
        image.src = imageSrc
        image.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            canvas.width = croppedAreaPixels.width
            canvas.height = croppedAreaPixels.height

            ctx?.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            )

            resolve(canvas.toDataURL('image/jpeg')) // returns base64
        }
    })
}

