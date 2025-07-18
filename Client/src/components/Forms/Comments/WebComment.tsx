'use client'

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import LabelDefault from '../../FormElements/label/LabelDefault'
import InputDefault from '../../FormElements/Input/InputDefault'
import ButtonDefault from '../../Button/ButtonDefault'
import AlertDefault from '../../Alert/AlertDefault'
import { useWebComments } from '@/src/hooks/comments/useWebComments'

interface FormData {
    user_id: number
    fullname: string
    title: string
    comment: string
}

interface WebCommentProps {
    onSuccess: () => void,
    closeModal: () => void
}

const WebComment = ({ onSuccess, closeModal }: WebCommentProps) => {
    const { submitComment } = useWebComments()

    const [formData, setFormData] = useState<FormData>({
        user_id: 0,
        fullname: '',
        title: '',
        comment: '',
    })

    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id')
        if (storedUserId) {
            const parsedId = parseInt(storedUserId, 10)
            if (!isNaN(parsedId)) {
                setFormData((prev) => ({
                    ...prev,
                    user_id: parsedId,
                }))
            }
        } else {
            AlertDefault.error("Avval ro'yxatdan o'ting yoki profilingizga kiring!")
        }
    }, [])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target
        if (name === 'title' && value.length > 20) return

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        setLoading(true)

        try {
            await submitComment(formData)

            AlertDefault.success("Sizning fikringiz muvaffaqiyatli yuborildi!")

            setFormData({
                user_id: formData.user_id,
                fullname: '',
                title: '',
                comment: '',
            })

            onSuccess()
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'status' in error && 'message' in error) {
                const { status, message } = error as { status: number; message: string }

                if (status === 409) {
                    AlertDefault.error("Siz allaqachon fikr bildirgansiz.")
                } else {
                    AlertDefault.error(message)
                }
            } else {
                AlertDefault.error('Kutilmagan xatolik yuz berdi.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <LabelDefault label="Ism va Familiyangiz:" htmlFor="fullname" />
                <InputDefault
                    name="fullname"
                    id="fullname"
                    type="text"
                    required
                    value={formData.fullname}
                    onChange={handleChange}
                    customClasses="mt-1"
                />
            </div>

            <div>
                <LabelDefault label="Sarlavha:" htmlFor="title" />
                <InputDefault
                    name="title"
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    customClasses="mt-1"
                    maxLength={20}
                />
            </div>

            <div>
                <LabelDefault label="Fikr:" htmlFor="comment" />
                <div className="flex items-center justify-center">
                    <textarea
                        name="comment"
                        id="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        required
                        className="mt-1 bg-light-gray px-5 py-5 border-none rounded text-black w-full h-[100px] focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-5">
                <ButtonDefault
                    label={loading ? 'Yuborilmoqda...' : 'Yuborish'}
                    type="submit"
                    isDisabled={loading}
                    customClasses="w-full"
                />
                <ButtonDefault
                    label="Bekor qilish"
                    onClick={() => closeModal()}
                    customClasses="!bg-gray-400 w-full"
                />
            </div>
        </form>
    )
}

export default WebComment
