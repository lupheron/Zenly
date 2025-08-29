'use client'

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import ButtonDefault from '../../Button/ButtonDefault'
import AlertDefault from '../../Alert/AlertDefault'
import { useUser } from '@/src/hooks/users/useUser'
import { createPostComments } from '@/src/hooks/comments/useUserComments'
import { PostComment } from '@/src/utils/Comment'
import { useQueryClient } from '@tanstack/react-query'

interface Comment {
  post_id: number
  user_id: number
  name: string
  text: string
}

interface PostCommentsProps {
  post_id: number
  onClose: () => void
}

const PostComments: React.FC<PostCommentsProps> = ({ post_id, onClose }) => {
  const [userId, setUserId] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const queryClient = useQueryClient()

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
      
      const newComment: Comment = {
        post_id: post_id,
        user_id: userId,
        name: user.fullname,
        text: text,
      }
      
      queryClient.setQueryData(['post-comments', post_id.toString()], (oldData: Comment[] | undefined) => {
        if (Array.isArray(oldData)) {
          return [...oldData, newComment]
        }
        return [newComment]
      })
      
      queryClient.invalidateQueries({ queryKey: ['post-comments', post_id.toString()] })
      
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === 'post-comments' && 
          query.queryKey[1] === post_id.toString()
      })
      
      queryClient.refetchQueries({ 
        predicate: (query) => 
          query.queryKey[0] === 'post-comments' && 
          query.queryKey[1] === post_id.toString()
      })
      
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (error: unknown) {
      queryClient.setQueryData(['post-comments', post_id.toString()], (oldData: Comment[] | undefined) => {
        if (Array.isArray(oldData)) {
          return oldData.filter(comment => 
            !(comment.user_id === userId && comment.text === text)
          )
        }
        return oldData
      })
      
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
            className='bg-gray-100 outline-none w-full h-50 rounded-lg p-5'
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
            customClasses='w-full !bg-gray-400'
          />
        </div>
      </form>
    </div>
  )
}

export default PostComments
