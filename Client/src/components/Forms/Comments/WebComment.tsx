'use client'

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import LabelDefault from '../../FormElements/label/LabelDefault'
import InputDefault from '../../FormElements/Input/InputDefault'
import ButtonDefault from '../../Button/ButtonDefault'
import AlertDefault from '../../Alert/AlertDefault'
import { useWebComments } from '@/src/hooks/comments/useWebComments'
import { useQueryClient } from '@tanstack/react-query'
import type { WebComment } from '@/src/utils/Comment'

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
    const queryClient = useQueryClient()

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

            const newComment: WebComment = {
                user_id: formData.user_id,
                fullname: formData.fullname,
                title: formData.title,
                comment: formData.comment,
            }
            
            queryClient.setQueryData(['webComments'], (oldData: WebComment[] | undefined) => {
                if (Array.isArray(oldData)) {
                    return [...oldData, newComment]
                }
                return [newComment]
            })

            queryClient.invalidateQueries({ queryKey: ['webComments'] })
            
            queryClient.refetchQueries({ queryKey: ['webComments'] })

            setFormData({
                user_id: formData.user_id,
                fullname: '',
                title: '',
                comment: '',
            })

            setTimeout(() => {
                onSuccess()
            }, 500)
        } catch (error: unknown) {
            queryClient.setQueryData(['webComments'], (oldData: WebComment[] | undefined) => {
                if (Array.isArray(oldData)) {
                    return oldData.filter(comment => 
                        !(comment.user_id === formData.user_id && 
                          comment.title === formData.title && 
                          comment.comment === formData.comment)
                    )
                }
                return oldData
            })
            
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
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 w-full">
            <div className="w-full">
                <LabelDefault 
                    label="Ism va Familiyangiz:" 
                    htmlFor="fullname" 
                    customClasses="text-sm sm:text-base font-medium text-gray-700 block mb-1 sm:mb-2"
                />
                <InputDefault
                    name="fullname"
                    id="fullname"
                    type="text"
                    required
                    value={formData.fullname}
                    onChange={handleChange}
                    customClasses="w-full"
                    placeholder="Ism va familiyangizni kiriting"
                />
            </div>

            <div className="w-full">
                <LabelDefault 
                    label="Sarlavha:" 
                    htmlFor="title" 
                    customClasses="text-sm sm:text-base font-medium text-gray-700 block mb-1 sm:mb-2"
                />
                <InputDefault
                    name="title"
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    customClasses="w-full"
                    maxLength={20}
                    placeholder="Sarlavha (maksimal 20 belgi)"
                />
            </div>

            <div className="w-full">
                <LabelDefault 
                    label="Fikr:" 
                    htmlFor="comment" 
                    customClasses="text-sm sm:text-base font-medium text-gray-700 block mb-1 sm:mb-2"
                />
                <div className="w-full">
                    <textarea
                        name="comment"
                        id="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        required
                        className="w-full bg-light-gray px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5 border-none rounded text-black h-[80px] sm:h-[100px] md:h-[120px] focus:outline-none resize-none text-sm sm:text-base"
                        placeholder="O'z fikringizni yozing..."
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full pt-2">
                <ButtonDefault
                    label={loading ? 'Yuborilmoqda...' : 'Yuborish'}
                    type="submit"
                    isDisabled={loading}
                    customClasses="w-full sm:flex-1 h-12 sm:h-auto text-sm sm:text-base"
                />
                <ButtonDefault
                    label="Bekor qilish"
                    onClick={() => closeModal()}
                    customClasses="!bg-gray-400 w-full sm:flex-1 h-12 sm:h-auto text-sm sm:text-base"
                />
            </div>
        </form>
    )
}

export default WebComment
