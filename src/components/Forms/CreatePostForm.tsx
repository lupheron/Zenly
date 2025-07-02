'use client'

import React, { useEffect, useRef, useState } from 'react'
import LabelDefault from '../FormElements/label/LabelDefault'
import InputDefault from '../FormElements/Input/InputDefault'
import ButtonDefault from '../Button/ButtonDefault'
import { PlusOutlined } from '@ant-design/icons'
import { message, Tag } from 'antd'
import { useRouter } from 'next/navigation'
import { useUsersPosts } from '@/src/hooks/posts/useUsersPosts'
import CreateGalleryForm from './CreateGallery'
import ReusableModal from '../Modal/ReusableModal'
import CreateFeatureForm from './CreateFeatureForm'
import AddIcon from '@mui/icons-material/Add'
import { useFeatures } from '@/src/hooks/features/useFeatures'

interface GalleryFile {
    uid: string
    name: string
    status: string
    url: string
    id: number
}

interface MainFile {
    uid: string
    name: string
    status: string
    url: string
}

const banners = [
    { id: 1, title: 'Plyajdagi dam olish' },
    { id: 2, title: 'Wellness maskanlari' },
    { id: 3, title: 'Kabina zonalari' },
    { id: 4, title: 'Eko sayohatlar' },
]

const staticFeatures = [
    "Wi-Fi",
    "Tashqi va ichki oshxona",
    "Shaxsiy hammom",
    "Isitish / Konditsioner",
    "Sauna / Issiq vannalar",
    "Mangal / Kamin",
    "Avtoturargoh",
    "Suzish havzasi"
]

const CreatePostForm = () => {
    const router = useRouter()
    const [userId, setUserId] = useState<number | null>(null)
    const [mainFileList, setMainFileList] = useState<MainFile[]>([])
    const [galleryFileList, setGalleryFileList] = useState<GalleryFile[]>([])
    const [createdPostId, setCreatedPostId] = useState<number | null>(null)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const { data: features = [], createFeature, deleteFeature } = useFeatures(createdPostId)

    const { createPost } = useUsersPosts(userId, false)

    const [form, setForm] = useState({
        title: '',
        small_description: '',
        description: '',
        price_daily: '',
        location: '',
        members: '',
        area_id: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const id = Number(localStorage.getItem("user_id"))
        if (id) setUserId(id)
    }, [])

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (name === 'small_description') {
            const wordCount = value.trim().split(/\s+/).filter(Boolean).length
            if (wordCount > 20) return
        }
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userId) {
            message.error('Foydalanuvchi aniqlanmadi.')
            return
        }
        if (mainFileList.length === 0) {
            message.error('Iltimos, asosiy rasm yuklang.')
            return
        }

        setIsSubmitting(true)

        try {
            const imgBase64 = mainFileList[0]?.url.includes('data:image')
                ? mainFileList[0].url.split(',')[1]
                : null

            const payload = {
                ...form,
                user_id: userId,
                img: imgBase64 || null
            }

            const response = await createPost.mutateAsync(payload)
            message.success('Post muvaffaqiyatli yaratildi! Endi galereya rasmlarni yuklashingiz mumkin.')
            setCreatedPostId(response.post_id)

            await Promise.all(
                staticFeatures.map(feature =>
                    createFeature.mutateAsync({
                        post_id: response.post_id,
                        user_id: userId,
                        name: feature
                    })
                )
            )

        } catch (error) {
            message.error('Post yaratishda xatolik yuz berdi.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteFeature = (featureId: number) => {
        deleteFeature.mutate(featureId)
    }

    const handleFinish = () => {
        router.back()
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mx-auto">
            <div className="flex flex-col gap-10 md:flex-row">
                <div className="min-w-[220px] md:w-1/3">
                    <div className='h-80 w-auto'>
                        <LabelDefault label="Asosiy rasm:" htmlFor="main-img" />
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
                                        alt="Asosiy rasm"
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
                                    <span>Asosiy rasm yuklash</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {createdPostId && (
                        <div className="mt-6">
                            <LabelDefault label="Galereya rasmlari:" />
                            <CreateGalleryForm
                                postId={createdPostId}
                                galleryFileList={galleryFileList}
                                setGalleryFileList={setGalleryFileList}
                                userId={userId}
                            />

                            <div className='mt-10'>
                                <h1>Sharoitlarni kiritish</h1>
                                <button
                                    type="button"
                                    onClick={() => setCreateModalOpen(true)}
                                    className="ml-2 text-blue-600 hover:text-blue-800 align-middle"
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                >
                                    <AddIcon />
                                </button>
                            </div>

                            {features.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {features.map((feature) => (
                                        <Tag
                                            key={feature.id}
                                            closable
                                            onClose={() => handleDeleteFeature(feature.id)}
                                            className="custom-tag"
                                        >
                                            <span className='text-xl p-3'>{feature.name}</span>
                                        </Tag>
                                    ))}
                                </div>
                            )}

                            <ReusableModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Yangi sharoit qo'shish">
                                <CreateFeatureForm
                                    postId={createdPostId}
                                    onClose={() => setCreateModalOpen(false)}
                                />
                            </ReusableModal>

                            <div className="mt-4 flex justify-end">
                                <ButtonDefault
                                    label="Tugatish"
                                    type="button"
                                    onClick={handleFinish}
                                    customClasses="bg-green-500 hover:bg-green-600 text-white"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    {!createdPostId ? (
                        <>
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

                            <LabelDefault label="Manzil:" htmlFor="location" />
                            <InputDefault
                                name="location"
                                type="text"
                                value={form.location}
                                onChange={handleChange}
                                required
                                customClasses="w-full border border-gray-300 rounded px-3 py-2"
                            />

                            <LabelDefault label="Odam soni:" htmlFor="members" />
                            <InputDefault
                                name="members"
                                type="number"
                                value={form.members}
                                onChange={handleChange}
                                required
                                customClasses="w-full border border-gray-300 rounded px-3 py-2"
                            />

                            <LabelDefault label="Dam olish zonasining turi:" htmlFor="area_id" />
                            <select
                                name="area_id"
                                value={form.area_id}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="">Tanlang</option>
                                {banners.map((banner) => (
                                    <option key={banner.id} value={banner.id}>
                                        {banner.title}
                                    </option>
                                ))}
                            </select>

                            <div className="flex gap-4 mt-4">
                                <ButtonDefault
                                    label={isSubmitting ? "Yaratilmoqda..." : "Post yaratish"}
                                    type="submit"
                                    customClasses="w-full"
                                    disabled={isSubmitting}
                                />
                                <ButtonDefault
                                    label="Bekor qilish"
                                    type="button"
                                    onClick={() => router.back()}
                                    customClasses="w-full !bg-gray-300 !text-black"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-blue-800">Post muvaffaqiyatli yaratildi!</h3>
                            <p className="text-blue-600 mt-2">
                                Endi galereya rasmlarni qo'shishingiz mumkin. Tugatish uchun "Tugatish" tugmasini bosing.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </form>
    )
}

export default CreatePostForm
