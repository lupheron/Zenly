'use client'

import React, { useEffect, useState } from 'react'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import { Upload, message } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { useGalleryByPostId } from '@/src/hooks/gallery/useGalleryByPostId'
import AlertDefault from '@/src/components/Alert/AlertDefault'

interface EditGalleryFormProps {
    postId: number
    galleryFileList: UploadFile[]
    setGalleryFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>
    userId: number
}

const EditGalleryForm: React.FC<EditGalleryFormProps> = ({
    postId,
    galleryFileList,
    setGalleryFileList,
    userId
}) => {
    const [uploading, setUploading] = useState(false)
    const { data: galleryImages = [], refetch } = useGalleryByPostId(postId)

    useEffect(() => {
        if (galleryImages) {
            const galleryList = galleryImages.map((img) => ({
                uid: `gallery-${img.id}`,
                name: `gallery-${img.id}.png`,
                status: 'done',
                url: img.img,
                id: img.id
            }))
            setGalleryFileList(galleryList)
        }
    }, [galleryImages, setGalleryFileList])

    const handleDelete = async (file: UploadFile) => {
        if (file.id) {
            try {
                const res = await fetch(`http://zenlyserver.test/api/gallery/${file.id}`, {
                    method: 'DELETE'
                })
                if (!res.ok) throw new Error()
                AlertDefault.success('Rasm o‘chirildi.')
                refetch()
            } catch (err) {
                AlertDefault.error("O'chirishda xatolik yuz berdi.")
            }
        }
    }

    const handleUpload = async (file: File) => {
        setUploading(true)
        const formData = new FormData()
        formData.append('img', file)
        formData.append('post_id', postId.toString())
        formData.append('user_id', userId.toString())

        try {
            const res = await fetch('http://zenlyserver.test/api/gallery', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Upload failed')

            const result = await res.json()
            AlertDefault.success('Rasm muvaffaqiyatli yuklandi!')
            refetch()
            return result
        } catch (error) {
            AlertDefault.error('Yuklashda xatolik yuz berdi')
            throw error
        } finally {
            setUploading(false)
        }
    }

    const handleChange: UploadProps['onChange'] = async ({ file, fileList }) => {
        // Handle new file upload
        if (file.status === 'uploading') {
            return
        }

        if (file.status === 'done') {
            message.success(`${file.name} file uploaded successfully`)
        } else if (file.status === 'error') {
            message.error(`${file.name} file upload failed.`)
        }

        // Filter out files that don't exist in the gallery (failed uploads)
        const validFiles = fileList.filter(f => f.status === 'done' || f.id)
        setGalleryFileList(validFiles.slice(0, 4))
    }

    const uploadButton = (
        <button type="button" style={{ border: 0, background: 'none' }}>
            {uploading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Yuklash</div>
        </button>
    )

    return (
        <Upload
            listType="picture-card"
            fileList={galleryFileList}
            onChange={handleChange}
            maxCount={4}
            beforeUpload={(file) => {
                handleUpload(file)
                return false // Prevent default upload
            }}
            onRemove={handleDelete}
            accept="image/*"
        >
            {galleryFileList.length >= 4 ? null : uploadButton}
        </Upload>
    )
}

export default EditGalleryForm