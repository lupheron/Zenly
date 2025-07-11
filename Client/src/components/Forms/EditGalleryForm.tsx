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
                method: 'DELETE'
            })
            if (!res.ok) throw new Error("Serverdan muvaffaqiyatsiz javob.")
            AlertDefault.success('Rasm o‘chirildi.')
            refetch()
        } catch (error: unknown) {
            AlertDefault.error("O'chirishda xatolik yuz berdi.")
            console.error("Delete error:", error)
        }
    }


    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0 || userId === null) {
            AlertDefault.error("Foydalanuvchi aniqlanmadi yoki fayl tanlanmadi.")
            return
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
            })

            if (!res.ok) throw new Error('Upload failed')

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
                accept="image/*"
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