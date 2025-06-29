'use client'

import React, { useEffect, useRef, useState } from 'react'
import LabelDefault from '../FormElements/label/LabelDefault'
import InputDefault from '../FormElements/Input/InputDefault'
import ButtonDefault from '../Button/ButtonDefault'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import { Upload, Tag, Spin, message } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import { useFeatures } from '@/src/hooks/features/useFeatures'
import ReusableModal from '../Modal/ReusableModal'
import CreateFeatureForm from './CreateFeatureForm'
import { useGalleryByPostId } from '@/src/hooks/gallery/useGalleryByPostId'
import EditGalleryForm from './EditGalleryForm'
import AddIcon from '@mui/icons-material/Add'
import { useUsersPosts } from '@/src/hooks/posts/useUsersPosts'
import AlertDefault from '../Alert/AlertDefault'

const EditPostForm = () => {
    const params = useParams()
    const router = useRouter()
    const postId = Number(params.id)
    const [userId, setUserId] = useState<number | null>(null)
    const [createModalOpen, setCreateModalOpen] = useState(false)

    const { data: posts, isLoading: isPostsLoading, error: postsError } = useUsersPosts(userId ?? 0)
    const {
        data: featuresList = [],
        isLoading: isFeaturesLoading,
        error: featuresError,
        deleteFeature
    } = useFeatures(postId)
    const {
        data: galleryImages = [],
        isLoading: isGalleryLoading,
        error: galleryError
    } = useGalleryByPostId(postId)

    const post = posts?.find((p: any) => p.id === postId)
    const { editPost } = useUsersPosts(userId ?? 0)

    const [mainFileList, setMainFileList] = useState<any[]>([])
    const [galleryFileList, setGalleryFileList] = useState<any[]>([])
    const [isInitialized, setIsInitialized] = useState(false)

    const [form, setForm] = useState({
        title: '',
        small_description: '',
        description: '',
        price_daily: '',
        location: '',
        members: '',
        features: [] as { id: number, name: string }[]
    })

    useEffect(() => {
        const id = Number(localStorage.getItem("user_id"))
        if (id) setUserId(id)
    }, [])

    useEffect(() => {
        if (post && !isFeaturesLoading && !isGalleryLoading && !isInitialized) {
            setForm({
                title: post.title || '',
                description: post.description || '',
                small_description: post.small_description || '',
                price_daily: post.price_daily?.toString() || '',
                location: post.location || '',
                members: post.members || '',
                features: featuresList.map((f: any) => ({ id: f.id, name: f.name })) || []
            })

            setMainFileList(post.img ? [{
                uid: '-1',
                name: 'main-image.png',
                status: 'done',
                url: post.img
            }] : [])

            const galleryList = galleryImages.map((img: any) => ({
                uid: `gallery-${img.id}`,
                name: `gallery-${img.id}.png`,
                status: 'done',
                url: img.img,
                id: img.id
            }))
            setGalleryFileList(galleryList)

            setIsInitialized(true)
        }
    }, [post, featuresList, galleryImages, isFeaturesLoading, isGalleryLoading, isInitialized])
    const mainFileInputRef = useRef<HTMLInputElement>(null)
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            setMainFileList([{
                uid: '-1',
                name: file.name,
                status: 'done',
                url: event.target?.result as string
            }])
        }
        reader.readAsDataURL(file)
    }

    const triggerMainFileInput = () => {
        mainFileInputRef.current?.click()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === 'small_description') {
            const wordCount = value.trim().split(/\s+/).filter(Boolean).length
            if (wordCount > 20) return
        }
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleDeleteFeature = async (featureId: number) => {
        if (!postId) return

        try {
            await deleteFeature.mutateAsync(featureId)
            setForm(prev => ({
                ...prev,
                features: prev.features.filter(f => f.id !== featureId)
            }))
            message.success('Feature deleted successfully')
        } catch (error) {
            message.error('Failed to delete feature')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const imgBase64 = mainFileList[0]?.url?.startsWith('data:image')
                ? mainFileList[0].url.split(',')[1]
                : mainFileList[0]?.url;

            const payload = {
                title: form.title,
                small_description: form.small_description,
                description: form.description,
                price_daily: form.price_daily,
                location: form.location,
                members: form.members,
                user_id: userId,
                img: imgBase64 || null,
            };

            await editPost.mutateAsync({ postId, data: payload })
            message.success('Post updated successfully')
            router.back()
        } catch (error) {
            message.error('Failed to update post')
        }
    };

    if (postsError || featuresError || galleryError) {
        AlertDefault.error("Error loading data. Please try again later.")
    }

    if (isPostsLoading || isFeaturesLoading || isGalleryLoading || !isInitialized) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        )
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 mx-auto">
                <div className="flex flex-col gap-10 md:flex-row">
                    <div className="min-w-[220px] md:w-1/3">
                        <div className='h-80 w-auto'>
                            <LabelDefault label="Main Image:" htmlFor="main-img" />
                            <input
                                type="file"
                                ref={mainFileInputRef}
                                onChange={handleMainImageChange}
                                accept="image/*"
                                className="hidden"
                                id="main-img"
                            />
                            <div className="relative border-2 border-dashed border-gray-300 rounded-lg w-full h-64 flex items-center justify-center">
                                {mainFileList.length > 0 ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={mainFileList[0].url}
                                            alt="Main preview"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setMainFileList([])}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-8"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={triggerMainFileInput}
                                        className="flex flex-col items-center justify-center text-gray-500"
                                    >
                                        <PlusOutlined className="text-2xl mb-2" />
                                        <span>Upload Main Image</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className='mb-10'>
                            <LabelDefault label="Gallery Images:" htmlFor="gallery-imgs" />
                            <EditGalleryForm
                                postId={postId}
                                galleryFileList={galleryFileList}
                                setGalleryFileList={setGalleryFileList}
                                userId={userId}
                            />
                        </div>

                        <LabelDefault label="Features:" htmlFor="features" />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {form.features.map((feature) => (
                                <Tag
                                    key={feature.id}
                                    closable
                                    onClose={() => handleDeleteFeature(feature.id)}
                                    className="custom-tag"
                                >
                                    <span className='text-xl p-3'>{feature.name}</span>
                                </Tag>
                            ))}

                            <button
                                type="button"
                                onClick={() => setCreateModalOpen(true)}
                                className="ml-2 text-blue-600 hover:text-blue-800 align-middle"
                                aria-label="Add new feature"
                                style={{ verticalAlign: 'middle', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                            >
                                <AddIcon />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        <LabelDefault label="Title:" htmlFor="title" />
                        <InputDefault
                            type='text'
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            customClasses="w-full border border-gray-300 rounded px-3 py-2"
                        />

                        <LabelDefault label="Short Description (max 20 words):" htmlFor="small_description" />
                        <textarea
                            name="small_description"
                            value={form.small_description}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows={2}
                        />

                        <LabelDefault label="Description:" htmlFor="description" />
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows={4}
                        />

                        <LabelDefault label="Daily Price ($):" htmlFor="price_daily" />
                        <InputDefault
                            name="price_daily"
                            type="number"
                            value={form.price_daily}
                            onChange={handleChange}
                            required
                            customClasses="w-full border border-gray-300 rounded px-3 py-2"
                        />

                        <LabelDefault label="Location:" htmlFor="location" />
                        <InputDefault
                            name="location"
                            type="text"
                            value={form.location}
                            onChange={handleChange}
                            required
                            customClasses="w-full border border-gray-300 rounded px-3 py-2"
                        />

                        <LabelDefault label="Number of People:" htmlFor="members" />
                        <InputDefault
                            name="members"
                            type="number"
                            value={form.members}
                            onChange={handleChange}
                            required
                            customClasses="w-full border border-gray-300 rounded px-3 py-2"
                        />

                        <div className="flex gap-4 mt-4">
                            <ButtonDefault label="Save" type="submit" customClasses="w-full" />
                            <ButtonDefault
                                label="Cancel"
                                type="button"
                                onClick={() => router.back()}
                                customClasses="w-full !bg-gray-300 !text-black"
                            />
                        </div>
                    </div>
                </div>
            </form>

            <ReusableModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add New Feature">
                <CreateFeatureForm
                    postId={postId}
                    onClose={() => setCreateModalOpen(false)}
                />
            </ReusableModal>

            <style jsx global>{`
                .main-image-upload .ant-upload.ant-upload-select-picture-card,
                .main-image-upload .ant-upload-list-picture-card .ant-upload-list-item {
                    width: 300px !important;
                    height: 300px !important;
                }

                .gallery-upload .ant-upload.ant-upload-select-picture-card,
                .gallery-upload .ant-upload-list-picture-card .ant-upload-list-item {
                    width: 120px !important;
                    height: 320px !important;
                }
            `}</style>
        </>
    )
}

export default EditPostForm