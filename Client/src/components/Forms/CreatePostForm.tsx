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
import { useAreaTypes } from '@/src/hooks/area_types/useAreaType';

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

const CreatePostForm = () => {
    const router = useRouter()
    const [userId, setUserId] = useState<number | null>(null)
    const [mainFileList, setMainFileList] = useState<MainFile[]>([])
    const [galleryFileList, setGalleryFileList] = useState<GalleryFile[]>([])
    const [createdPostId, setCreatedPostId] = useState<number | null>(null)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const { data: features = [], createMultipleFeatures, deleteFeature } = useFeatures(createdPostId ?? undefined)
    const { data: areaTypes, isLoading: isAreaTypesLoading } = useAreaTypes();


    const { createPost } = useUsersPosts(userId ?? 0, false)

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

    const validateImageFile = (file: File): boolean => {
        // Check file type
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Faqat JPG va PNG formatdagi rasmlar qabul qilinadi!');
            return false;
        }

        // Check file size (500KB = 500 * 1024 bytes)
        const isLt500KB = file.size / 1024 < 500;
        if (!isLt500KB) {
            message.error('Rasm hajmi 500KB dan kam bo\'lishi kerak!');
            return false;
        }

        return true;
    }

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!validateImageFile(file)) {
            e.target.value = ''; // Reset input
            return;
        }

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
            if (value.length > 65) return
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

            const staticFeatures: string[] = [
                "Wi-Fi",
                "Tashqi va ichki oshxona",
                "Shaxsiy hammom",
                "Isitish / Konditsioner",
                "Sauna / Issiq vannalar",
                "Mangal / Kamin",
                "Avtoturargoh",
                "Suzish havzasi"
            ];

            // Create all static features in batch to show only one success alert
            await createMultipleFeatures.mutateAsync(
                staticFeatures.map((feature: string) => ({
                    post_id: response.post_id,
                    user_id: userId,
                    name: feature
                }))
            )
        } catch (error) {
            console.log('Xatolik:', error)
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
            <div className="flex flex-col lg:flex-row gap-10">
                {/* Media section - Left on large screens, top on small screens */}
                <div className="lg:order-1 order-1 lg:min-w-[320px] lg:w-1/3 w-full">
                    {/* Main image */}
                    <div className='h-80 w-auto mb-6'>
                        <LabelDefault label="Asosiy rasm:" htmlFor="main-img" />
                        <input
                            type="file"
                            ref={mainFileInputRef}
                            onChange={handleMainImageChange}
                            accept=".jpg,.jpeg,.png"
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

                    {/* Gallery & Features (only after post is created) */}
                    {createdPostId && (
                        <div className="mb-6">
                            <LabelDefault label="Galereya rasmlari:" htmlFor='gallery' />
                            <CreateGalleryForm
                                postId={createdPostId}
                                galleryFileList={galleryFileList}
                                setGalleryFileList={setGalleryFileList}
                                userId={Number(userId)}
                            />

                            {/* Features */}
                            <div className="mt-6">
                                <div className="flex items-center mb-2">
                                    <h1 className="text-lg font-semibold">Sharoitlarni kiritish</h1>
                                    <button
                                        type="button"
                                        onClick={() => setCreateModalOpen(true)}
                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                    >
                                        <AddIcon />
                                    </button>
                                </div>

                                {features.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
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
                            </div>

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

                {/* Form fields section - Right on large screens, bottom on small screens */}
                <div className="lg:order-2 order-2 flex-1 flex flex-col gap-4">
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

                            <LabelDefault label="Qisqa tavsif:" htmlFor="small_description" />
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

                            <LabelDefault label="Dam olish zonasining turi:" htmlFor="area_id" />
                            <div className="flex gap-2 items-center">
                                <select
                                    name="area_id"
                                    value={form.area_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value="">Tanlang</option>
                                    {isAreaTypesLoading ? (
                                        <option disabled>Yuklanmoqda...</option>
                                    ) : (
                                        areaTypes?.map((area) => (
                                            <option key={area.id} value={area.id}>
                                                {area.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <LabelDefault label="Odam soni:" htmlFor="members" />
                            <InputDefault
                                name="members"
                                type="number"
                                value={form.members}
                                onChange={handleChange}
                                required
                                customClasses="w-full border border-gray-300 rounded px-3 py-2"
                            />

                            <div className="flex gap-4 mt-4">
                                <ButtonDefault
                                    label={isSubmitting ? "Yaratilmoqda..." : "Post yaratish"}
                                    type="submit"
                                    customClasses="w-full"
                                    isDisabled={isSubmitting}
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
                                Endi galereya rasmlarni qo&apos;shishingiz mumkin. Tugatish uchun (Tugatish) tugmasini bosing.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </form>
    )
}

export default CreatePostForm
