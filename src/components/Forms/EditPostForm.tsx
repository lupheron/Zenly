'use client'

import React, { useEffect, useState } from 'react'
import LabelDefault from '../FormElements/label/LabelDefault'
import InputDefault from '../FormElements/Input/InputDefault'
import ButtonDefault from '../Button/ButtonDefault'
import { PlusOutlined } from '@ant-design/icons'
import { Upload, Tag } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import { useFeatures } from '@/src/hooks/features/useFeatures'
import ReusableModal from '../Modal/ReusableModal'
import CreateFeatureForm from './CreateFeatureForm'
import { useGalleryByPostId } from '@/src/hooks/gallery/useGalleryByPostId'
import EditGalleryForm from './EditGalleryForm'
import AddIcon from '@mui/icons-material/Add'
import { useUsersPosts } from '@/src/hooks/posts/useUsersPosts'

const EditPostForm = () => {
    const params = useParams()
    const router = useRouter()
    const postId = Number(params.id)
    const [userId, setUserId] = useState<number | null>(null)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const { data: posts, isLoading, editPost } = useUsersPosts(userId ?? 0)
    const post = posts?.find((p: any) => p.id === postId)
    const { data: featuresList = [], deleteFeature } = useFeatures(postId)
    const { data: galleryImages = [] } = useGalleryByPostId(postId)
    const [mainFileList, setMainFileList] = useState<any[]>([])
    const [galleryFileList, setGalleryFileList] = useState<any[]>([])

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
        if (post) {
            setForm({
                title: post.title || '',
                description: post.description || '',
                small_description: post.small_description || '',
                price_daily: post.price_daily?.toString() || '',
                location: post.location || '',
                members: post.members || '',
                features: post.features?.map((f: any) => ({ id: f.id, name: f.name })) || []
            })

            setMainFileList(post.img ? [{
                uid: '-1',
                name: 'main-image.png',
                status: 'done',
                url: post.img
            }] : [])
        }
    }, [post])

    useEffect(() => {
        if (galleryImages) {
            const galleryList = galleryImages.map((img: any) => ({
                uid: `gallery-${img.id}`,
                name: `gallery-${img.id}.png`,
                status: 'done',
                url: img.img,
                id: img.id
            }))
            setGalleryFileList(galleryList)
        }
    }, [galleryImages])

    useEffect(() => {
        if (featuresList?.length) {
            setForm(prev => ({
                ...prev,
                features: featuresList.map((f: any) => ({ id: f.id, name: f.name }))
            }))
        }
    }, [featuresList])

    const handleMainChange = ({ fileList }: any) => {
        const newFileList = fileList.slice(-1); // Keep only the last file
        if (newFileList.length > 0 && newFileList[0].originFileObj) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setMainFileList([{
                    ...newFileList[0],
                    url: e.target?.result as string // This will be the base64 string
                }]);
            };
            reader.readAsDataURL(newFileList[0].originFileObj);
        } else {
            setMainFileList(newFileList);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === 'small_description') {
            const wordCount = value.trim().split(/\s+/).filter(Boolean).length
            if (wordCount > 20) return
        }
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleDeleteFeature = (featureId: number) => {
        if (!postId) return

        deleteFeature.mutate(featureId)

        setForm(prev => ({
            ...prev,
            features: prev.features.filter(f => f.id !== featureId)
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Get the base64 string (remove the data URL prefix if needed)
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

        editPost.mutate({ postId, data: payload }, {
            onSuccess: () => {
                router.back();
            }
        });
    };

    if (isLoading) return <p>Yuklanmoqda...</p>

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 mx-auto">
                <div className="flex flex-col md:flex-row">
                    {/* Images Section */}
                    <div className="min-w-[220px] md:w-1/3">
                        <div>
                            <LabelDefault label="Asosiy rasm:" htmlFor="main-img" />
                            <Upload
                                listType="picture-circle"
                                fileList={mainFileList}
                                onChange={handleMainChange}
                                maxCount={1}
                                beforeUpload={() => false}
                                className="flex justify-center items-center"
                            >
                                {mainFileList.length >= 1 ? null : (
                                    <button type="button" style={{ border: 0, background: 'none' }}>
                                        <PlusOutlined /> <div>Yuklash</div>
                                    </button>
                                )}
                            </Upload>
                            <style>
                                {`
                                .ant-upload-list-picture-circle .ant-upload-list-item,
                                .ant-upload.ant-upload-select-picture-circle {
                                    width: 320px !important;
                                    height: 320px !important;
                                }
                                `}
                            </style>
                        </div>
                        <div className='mt-60 mb-10'>
                            <LabelDefault label="Galereya rasmlari:" htmlFor="gallery-imgs" />
                            <EditGalleryForm
                                postId={postId}
                                galleryFileList={galleryFileList}
                                setGalleryFileList={setGalleryFileList}
                                userId={userId}
                            />
                        </div>

                        <LabelDefault label="Imkoniyatlar:" htmlFor="features" />
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
                                aria-label="Yangi imkoniyat qo'shish"
                                style={{ verticalAlign: 'middle', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                            >
                                <AddIcon />
                            </button>

                            <style>
                                {`
                                    .custom-tag .anticon-close {
                                        font-size: 1.05rem;
                                    }
                                `}
                            </style>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 flex flex-col gap-4">
                        <LabelDefault label="Sarlavha:" htmlFor="title" />
                        <InputDefault
                            type='text'
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            customClasses="w-full border border-gray-300 rounded px-3 py-2"
                        />

                        <LabelDefault label="Qisqa tavsif (20 ta so'zgacha):" htmlFor="small_description" />
                        <textarea
                            name="small_description"
                            value={form.small_description}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows={2}
                        />

                        <LabelDefault label="Tavsif:" htmlFor="description" />
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows={4}
                        />

                        <LabelDefault label="Kunlik narxi ($):" htmlFor="price_daily" />
                        <InputDefault
                            name="price_daily"
                            type="number"
                            value={form.price_daily}
                            onChange={handleChange}
                            required
                            customClasses="w-full border border-gray-300 rounded px-3 py-2"
                        />

                        <LabelDefault label="Manzili:" htmlFor="location" />
                        <InputDefault
                            name="location"
                            type="text"
                            value={form.location}
                            onChange={handleChange}
                            required
                            customClasses="w-full border border-gray-300 rounded px-3 py-2"
                        />

                        <LabelDefault label="Kishi Soni" htmlFor="members" />
                        <InputDefault
                            name="members"
                            type="number"
                            value={form.members}
                            onChange={handleChange}
                            required
                            customClasses="w-full border border-gray-300 rounded px-3 py-2"
                        />

                        <div className="flex gap-4 mt-4">
                            <ButtonDefault label="Saqlash" type="submit" customClasses="w-full" />
                            <ButtonDefault
                                label="Bekor qilish"
                                type="button"
                                onClick={() => router.back()}
                                customClasses="w-full !bg-gray-300 !text-black"
                            />
                        </div>
                    </div>
                </div>
            </form>

            <ReusableModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Yangi imkoniyat qo'shish">
                <CreateFeatureForm
                    postId={postId}
                    onClose={() => setCreateModalOpen(false)}
                />
            </ReusableModal>
        </>
    )
}

export default EditPostForm