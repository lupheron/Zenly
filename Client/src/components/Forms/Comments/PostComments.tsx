'use client'

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import ButtonDefault from '../../Button/ButtonDefault'
import AlertDefault from '../../Alert/AlertDefault'
import { useUser } from '@/src/hooks/users/useUser'
import { createPostComments } from '@/src/hooks/comments/useUserComments'
import { PostComment } from '@/src/utils/Comment'

interface PostCommentsProps {
  post_id: number
  onClose: () => void
}

const PostComments: React.FC<PostCommentsProps> = ({ post_id, onClose }) => {
  const [userId, setUserId] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedId = localStorage.getItem("user_id")
    if (storedId) {
      const parsed = parseInt(storedId, 10)
      if (!isNaN(parsed)) {
        setUserId(parsed)
      }
    } else {
      AlertDefault.error("Iltimos, avval ro'yxatdan o'ting yoki tizimga kiring!")
    }
  }, [])

  const { data: user } = useUser()

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!userId || !user) {
      AlertDefault.error("Foydalanuvchi ma'lumotlari topilmadi")
      return
    }

    const formData: PostComment = {
      user_id: userId,
      post_id: post_id,
      name: user.fullname,
      text: text,
    }

    setLoading(true)
    try {
      await createPostComments(formData)
      AlertDefault.success("Kommentariya muvaffaqiyatli yuborildi!")
      setText('')
      onClose()
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        'message' in error
      ) {
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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            name="text"
            value={text}
            onChange={handleChange}
            required
            className='bg-gray-300 w-full h-50 rounded-lg p-5'
          />
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-5 mt-5'>
          <ButtonDefault
            label={loading ? 'Yuborilmoqda...' : 'Yuborish'}
            type='submit'
            isDisabled={loading}
            customClasses='w-full'
          />
          <ButtonDefault
            label="Bekor qilish"
            type="button"
            onClick={onClose}
            customClasses='w-full !bg-gray-500'
          />
        </div>
      </form>
    </div>
  )
}

export default PostComments
