'use client'

import React, { useRef, useState } from 'react'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import AlertDefault from '@/src/components/Alert/AlertDefault'

export interface GalleryFile {
    uid: string
    name: string
    status: string
    url: string
    id: number
}

interface CreateGalleryFormProps {
    postId: number
    galleryFileList: GalleryFile[]
    setGalleryFileList: React.Dispatch<React.SetStateAction<GalleryFile[]>>
    userId: number
}

const CreateGalleryForm: React.FC<CreateGalleryFormProps> = ({
    postId,
    galleryFileList,
    setGalleryFileList,
    userId
}) => {
    const [uploading, setUploading] = useState(false)
    const galleryFileInputRef = useRef<HTMLInputElement>(null)
    const token = localStorage.getItem('token')

    const validateImageFile = (file: File): boolean => {
        // Check file type
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            AlertDefault.error('Faqat JPG va PNG formatdagi rasmlar qabul qilinadi!');
            return false;
        }

        // Check file size (500KB = 500 * 1024 bytes)
        const isLt500KB = file.size / 1024 < 500;
        if (!isLt500KB) {
            AlertDefault.error('Rasm hajmi 500KB dan kam bo\'lishi kerak!');
            return false;
        }

        return true;
    }

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        // Validate all files before uploading
        for (let i = 0; i < files.length; i++) {
            if (!validateImageFile(files[i])) {
                e.target.value = ''; // Reset input
                return;
            }
        }

        setUploading(true)

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const formData = new FormData()
                formData.append('img', file)
                formData.append('post_id', postId.toString())
                formData.append('user_id', userId.toString())

                const res = await fetch('http://zenlyserver.test/api/gallery', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!res.ok) throw new Error('Yuklash muvaffaqiyatsiz')

                const result = await res.json()
                setGalleryFileList(prev => [
                    ...prev,
                    {
                        uid: `gallery-${result.data.id}`,
                        name: file.name,
                        status: 'done',
                        url: result.data.img.startsWith('http') ? result.data.img : `http://zenlyserver.test/${result.data.img}`,
                        id: result.data.id
                    }
                ])
            }
            AlertDefault.success('Rasm(lar) muvaffaqiyatli yuklandi!')
        } catch (error) {
            AlertDefault.error('Yuklashda xatolik yuz berdi')
            console.log('Xatolik:', error)
        } finally {
            setUploading(false)
            if (galleryFileInputRef.current) {
                galleryFileInputRef.current.value = ''
            }
        }
    }

    const handleDelete = async (fileId: number) => {
        try {
            const res = await fetch(`http://zenlyserver.test/api/gallery/${fileId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!res.ok) throw new Error()
            AlertDefault.success('Rasm o‘chirildi.')
            setGalleryFileList(prev => prev.filter(file => file.id !== fileId))
        } catch (err) {
            console.log('Xatolik:', err)
            AlertDefault.error("O'chirishda xatolik yuz berdi.")
        }
    }

    const triggerGalleryFileInput = () => {
        galleryFileInputRef.current?.click()
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            <input
                type="file"
                ref={galleryFileInputRef}
                onChange={handleGalleryUpload}
                accept=".jpg,.jpeg,.png"
                className="hidden"
                multiple
            />

            {galleryFileList.map((file) => (
                <div key={file.uid} className="relative border-2 border-dashed border-gray-300 rounded-lg w-full h-28">
                    <img
                        src={file.url}
                        alt="Gallery preview"
                        className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                        type="button"
                        onClick={() => handleDelete(file.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-md w-8"
                    >
                        ×
                    </button>
                </div>
            ))}

            {galleryFileList.length < 4 && (
                <button
                    type="button"
                    onClick={triggerGalleryFileInput}
                    disabled={uploading}
                    className="border-2 border-dashed border-gray-300 rounded-lg w-full h-28 flex items-center justify-center text-gray-500"
                >
                    {uploading ? (
                        <LoadingOutlined className="text-2xl" />
                    ) : (
                        <PlusOutlined className="text-4xl mb-2" />
                    )}
                </button>
            )}
        </div>
    )
}

export default CreateGalleryForm