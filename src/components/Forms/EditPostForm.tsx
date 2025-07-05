'use client'

import React, { useEffect, useRef, useState } from 'react'
import LabelDefault from '../FormElements/label/LabelDefault'
import InputDefault from '../FormElements/Input/InputDefault'
import ButtonDefault from '../Button/ButtonDefault'
import { PlusOutlined } from '@ant-design/icons'
import { Tag, Spin, message } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import { useFeatures } from '@/src/hooks/features/useFeatures'
import ReusableModal from '../Modal/ReusableModal'
import CreateFeatureForm from './CreateFeatureForm'
import { useGalleryByPostId } from '@/src/hooks/gallery/useGalleryByPostId'
import EditGalleryForm from './EditGalleryForm'
import AddIcon from '@mui/icons-material/Add'
import { useUsersPosts } from '@/src/hooks/posts/useUsersPosts'
import SelectDefault from '../FormElements/Select/SelectDefault'

const uzbekistanProvinces = [
    { label: 'Andijon', value: 'Andijon' },
    { label: 'Buxoro', value: 'Buxoro' },
    { label: 'Fargʻona', value: 'Fargʻona' },
    { label: 'Jizzax', value: 'Jizzax' },
    { label: 'Xorazm', value: 'Xorazm' },
    { label: 'Namangan', value: 'Namangan' },
    { label: 'Navoiy', value: 'Navoiy' },
    { label: 'Qashqadaryo', value: 'Qashqadaryo' },
    { label: 'Qoraqalpogʻiston', value: 'Qoraqalpogʻiston' },
    { label: 'Samarqand', value: 'Samarqand' },
    { label: 'Sirdaryo', value: 'Sirdaryo' },
    { label: 'Surxondaryo', value: 'Surxondaryo' },
    { label: 'Toshkent viloyati', value: 'Toshkent viloyati' },
    { label: 'Toshkent shahri', value: 'Toshkent shahri' }
]

const banners = [
    { id: 1, title: 'Plyajdagi dam olish' },
    { id: 2, title: 'Wellness maskanlari' },
    { id: 3, title: 'Kabina zonalari' },
    { id: 4, title: 'Eko sayohatlar' },
]

const EditPostForm = () => {
    const params = useParams()
    const router = useRouter()
    const postId = Number(params.id)
    const [userId, setUserId] = useState<number | null>(null)
    const [createModalOpen, setCreateModalOpen] = useState(false)

    const { data: posts, isLoading: isPostsLoading, error: postsError } = useUsersPosts(userId ?? 0)
    const { data: featuresList = [], deleteFeature } = useFeatures(postId)
    const { data: galleryImages = [] } = useGalleryByPostId(postId)
    const { editPost } = useUsersPosts(userId ?? 0)

    const post = posts?.find((p: any) => p.id === postId)

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
        area_id: ''
    })

    useEffect(() => {
        const id = Number(localStorage.getItem("user_id"))
        if (id) setUserId(id)
    }, [])

    useEffect(() => {
        if (post && !isInitialized) {
            setForm({
                title: post.title || '',
                description: post.description || '',
                small_description: post.small_description || '',
                price_daily: post.price_daily?.toString() || '',
                location: post.location || '',
                members: post.members || '',
                area_id: post.area_id || ""
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
    }, [post, galleryImages, isInitialized])

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

    const handleDeleteFeature = async (featureId: number) => {
        try {
            await deleteFeature.mutateAsync(featureId)
            message.success('Sharoit o\'chirildi')
        } catch (error) {
            message.error('Sharoitni o\'chirishda xatolik')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const imgBase64 = mainFileList[0]?.url?.startsWith('data:image')
                ? mainFileList[0].url.split(',')[1]
                : mainFileList[0]?.url

            const payload = {
                ...form,
                user_id: userId,
                img: imgBase64 || null
            }

            await editPost.mutateAsync({ postId, data: payload })
            message.success('Post yangilandi')
            router.back()
        } catch (error) {
            message.error('Postni yangilashda xatolik')
        }
    }

    if (isPostsLoading || !isInitialized) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        )
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

                    <div className="mt-6">
                        <LabelDefault label="Galereya rasmlari:" htmlFor='gallery'/>
                        <EditGalleryForm
                            postId={postId}
                            galleryFileList={galleryFileList}
                            setGalleryFileList={setGalleryFileList}
                            userId={userId}
                        />
                    </div>

                    <div className="mt-10">
                        <h1>Sharoitlar</h1>
                        <button
                            type="button"
                            onClick={() => setCreateModalOpen(true)}
                            className="ml-2 text-blue-600 hover:text-blue-800 align-middle"
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        >
                            <AddIcon />
                        </button>
                    </div>

                    {featuresList.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {featuresList.map((feature) => (
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

                    <SelectDefault
                        label="Viloyatni tanlang:"
                        htmlFor="location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        options={uzbekistanProvinces}
                        customClassesSelect="w-full h-[60px] border border-gray-300 rounded px-3 py-2"
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

            <ReusableModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Yangi sharoit qo'shish">
                <CreateFeatureForm
                    postId={postId}
                    onClose={() => setCreateModalOpen(false)}
                />
            </ReusableModal>
        </form>
    )
}

export default EditPostForm