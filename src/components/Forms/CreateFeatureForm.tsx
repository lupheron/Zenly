'use client'

import { useState } from 'react'
import InputDefault from '../FormElements/Input/InputDefault'
import ButtonDefault from '../Button/ButtonDefault'
import { useFeatures } from '@/src/hooks/features/useFeatures'

interface CreateFeatureFormProps {
    postId: number
    onClose: () => void
}

const CreateFeatureForm: React.FC<CreateFeatureFormProps> = ({ postId, onClose }) => {
    const { createFeature } = useFeatures(postId)
    const [name, setName] = useState('')

    const handleSubmit = () => {
        if (!name) return
        createFeature.mutate(
            {
                post_id: postId,
                user_id: Number(localStorage.getItem('user_id')),
                name,
            },
            {
                onSuccess: () => {
                    setName('')
                    onClose()
                }
            }
        )
    }

    return (
        <div>
            <InputDefault
                placeholder="Imkoniyat nomi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <div className="flex justify-end gap-3 mt-4">
                <ButtonDefault label="Bekor qilish" onClick={onClose} />
                <ButtonDefault label="Qo'shish" onClick={handleSubmit} />
            </div>
        </div>
    )
}

export default CreateFeatureForm