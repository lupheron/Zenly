'use client'

import React, { useEffect, useState, useRef } from 'react'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import AlertDefault from '@/src/components/Alert/AlertDefault'
import { useGalleryByPostId } from '@/src/hooks/gallery/useGalleryByPostId'

interface EditGalleryFormProps {
    postId: number
    galleryFileList: GalleryFile[]
    setGalleryFileList: React.Dispatch<React.SetStateAction<GalleryFile[]>>
    userId: number | null
}

interface GalleryFile {
    uid: string
    name: string
    status: string
    url: string
    id: number
}


const EditGalleryForm: React.FC<EditGalleryFormProps> = ({
    postId,
    galleryFileList,
    setGalleryFileList,
    userId
}) => {
    const [uploading, setUploading] = useState(false)
    const galleryFileInputRef = useRef<HTMLInputElement>(null)
    const { data: galleryImages = [], refetch } = useGalleryByPostId(postId)
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (galleryImages) {
            const galleryList: GalleryFile[] = galleryImages.map((img) => ({
                uid: `gallery-${img.id}`,
                name: `gallery-${img.id}.png`,
                status: 'done',
                url: img.img,
                id: img.id
            }))
            setGalleryFileList(galleryList)
        }
    }, [galleryImages, setGalleryFileList])

    const handleDelete = async (fileId: number) => {
        try {
            const res = await fetch(`http://zenlyserver.test/api/gallery/${fileId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!res.ok) throw new Error("Serverdan muvaffaqiyatsiz javob.")
            AlertDefault.success('Rasm o‘chirildi.')
            refetch()
        } catch (error: unknown) {
            AlertDefault.error("O'chirishda xatolik yuz berdi.")
            console.error("O'chirishda xatolik:", error)
        }
    }


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
        if (!files || files.length === 0 || userId === null) {
            AlertDefault.error("Foydalanuvchi aniqlanmadi yoki fayl tanlanmadi.")
            return
        }

        // Validate all files before uploading
        for (let i = 0; i < files.length; i++) {
            if (!validateImageFile(files[i])) {
                e.target.value = ''; // Reset input
                return;
            }
        }

        setUploading(true)
        const formData = new FormData()

        const file = files[0]
        formData.append('img', file)
        formData.append('post_id', postId.toString())
        formData.append('user_id', userId.toString()) 

        try {
            const res = await fetch('http://zenlyserver.test/api/gallery', {
                method: 'POST',
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) throw new Error('Yuklash muvaffaqiyatsiz')

            AlertDefault.success('Rasm muvaffaqiyatli yuklandi!')
            refetch()
        } catch (error: unknown) {
            AlertDefault.error('Yuklashda xatolik yuz berdi')
            console.error("Yuklashda xatolik yuz berdi:", error)
        } finally {
            setUploading(false)
            if (galleryFileInputRef.current) {
                galleryFileInputRef.current.value = ''
            }
        }
    }


    const triggerGalleryFileInput = () => {
        galleryFileInputRef.current?.click()
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                        <>
                            <PlusOutlined className="text-4xl mb-2" />
                        </>
                    )}
                </button>
            )}
        </div>
    )
}

export default EditGalleryForm