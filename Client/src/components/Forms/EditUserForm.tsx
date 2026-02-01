'use client'

import React, { useEffect, useState } from 'react'
import LabelDefault from '../FormElements/label/LabelDefault'
import InputDefault from '../FormElements/Input/InputDefault'
import AlertDefault from '../Alert/AlertDefault'
import { useRouter } from 'next/navigation'
import { useUser } from '@/src/hooks/users/useUser'
import ProfileImageUpload from '../FormElements/Uploads/ProfileImgUpload'
import ButtonDefault from '../Button/ButtonDefault'
import { useLanguage } from '@/src/contexts/LanguageContext'

const EditUserForm = () => {
    const [form, setForm] = useState({
        fullname: '',
        username: '',
        phone: '',
        address: '',
        img: '' as string | File,
    })
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('')

    const router = useRouter()
    const { t } = useLanguage()
    const { data, isLoading, updateUser } = useUser()
    const { mutate, isPending, isSuccess, isError, error } = updateUser

    useEffect(() => {
        if (data) {
            setForm({
                fullname: data.fullname || '',
                username: data.username || '',
                phone: data.phone || '',
                address: data.address || '',
                img: data.img || '',
            })
            setImagePreviewUrl(data.img || '')
        }
    }, [data])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (file: string | File) => {
        if (file instanceof File) {
            setForm((prev) => ({ ...prev, img: file }))
            setImagePreviewUrl(URL.createObjectURL(file))
        } else {
            setForm((prev) => ({ ...prev, img: file }))
            setImagePreviewUrl(file)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (form.img instanceof File) {
            const formData = new FormData()
            formData.append('fullname', form.fullname)
            formData.append('username', form.username)
            formData.append('phone', form.phone)
            formData.append('address', form.address)
            formData.append('img', form.img)
            mutate(formData as any)
        } else {
            const payload = {
                fullname: form.fullname,
                username: form.username,
                phone: form.phone,
                address: form.address,
                img: form.img as string,
            }
            mutate(payload)
        }
    }

    useEffect(() => {
        if (isSuccess) {
            AlertDefault.success(t('user.form.successUserUpdated'))
            router.push('/user/profile')
        }
        if (isError && error) {
            if (error.message === "USERNAME_CONFLICT") {
                AlertDefault.error(t('user.form.usernameConflict'))
            } else {
                AlertDefault.error(t('user.form.errorUserUpdate'))
            }
        }
    }, [isSuccess, isError, error, router])

    if (isLoading) return <p>{t('common.loading')}</p>

    return (
        <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-6 lg:gap-10 items-start">
            <div className="w-full lg:w-auto flex justify-center lg:justify-start">
                <ProfileImageUpload value={imagePreviewUrl} onChange={handleImageChange} />
            </div>

            <div className="space-y-3 sm:space-y-4 flex-1 w-full">
                <div>
                    <LabelDefault
                        label={t('user.form.fullname')}
                        htmlFor="fullname"
                        customClasses="text-sm sm:text-base font-medium text-gray-700 block mb-1 sm:mb-2"
                    />
                    <InputDefault
                        name="fullname"
                        type="text"
                        value={form.fullname}
                        onChange={handleChange}
                        required
                        placeholder={t('user.form.enterFullname')}
                        customClasses="w-full"
                    />
                </div>

                <div>
                    <LabelDefault
                        label={t('user.form.username')}
                        htmlFor="username"
                        customClasses="text-sm sm:text-base font-medium text-gray-700 block mb-1 sm:mb-2"
                    />
                    <InputDefault
                        name="username"
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        required
                        placeholder={t('user.form.enterUsername')}
                        customClasses="w-full"
                    />
                </div>

                <div>
                    <LabelDefault
                        label={t('user.form.phone')}
                        htmlFor="phone"
                        customClasses="text-sm sm:text-base font-medium text-gray-700 block mb-1 sm:mb-2"
                    />
                    <InputDefault
                        name="phone"
                        type="text"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="+998 XX XXX XX XX"
                        customClasses="w-full"
                    />
                </div>

                <div>
                    <LabelDefault
                        label={t('user.form.address')}
                        htmlFor="address"
                        customClasses="text-sm sm:text-base font-medium text-gray-700 block mb-1 sm:mb-2"
                    />
                    <InputDefault
                        name="address"
                        type="text"
                        value={form.address}
                        onChange={handleChange}
                        required
                        placeholder={t('user.form.enterAddress')}
                        customClasses="w-full"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 pt-2">
                    <ButtonDefault
                        label={isPending ? t('user.form.updating') : t('user.form.update')}
                        type="submit"
                        isDisabled={isPending}
                        customClasses='w-full tracking-[1px]'
                    />

                    <ButtonDefault
                        label={t('user.form.cancel')}
                        onClick={() => { window.history.back() }}
                        isDisabled={isPending}
                        customClasses='w-full !bg-gray-300 !text-black tracking-[1px]'
                    />
                </div>
            </div>
        </form>
    )
}

export default EditUserForm
