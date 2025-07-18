'use client'

import React, { useState } from 'react'
import AddCommentIcon from '@mui/icons-material/AddComment'
import ReusableModal from '../Modal/ReusableModal'
import WebComment from '../Forms/Comments/WebComment'

const Comment = () => {
    const [openModal, setOpenModal] = useState(false)

    return (
        <>
            <button
                className="
                    group fixed bottom-5 right-5 z-50
                    flex items-center justify-start
                    w-14 h-14 md:w-16 md:h-16
                    rounded-full bg-purple-700 shadow-lg
                    transition-all duration-300
                    hover:w-64 hover:pl-4
                    overflow-hidden
                    border border-purple-700
                    hover:rounded-xl
                    cursor-pointer
                    px-5
                "
                onClick={() => setOpenModal(true)}
            >
                <AddCommentIcon className="text-white text-xl" />
                <span
                    className="
                        text-sm md:text-base ml-2 text-white
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-300
                        whitespace-nowrap
                    "
                >
                    Websayt haqida fikringiz
                </span>
            </button>

            <ReusableModal
                onClose={() => setOpenModal(false)}
                open={openModal}
                title="Sayt haqida o'z fikringizni qoldiring!"
                width={600}
            >
                <WebComment onSuccess={() => setOpenModal(false)} closeModal={() => setOpenModal(false)} />
            </ReusableModal>
        </>
    )
}

export default Comment
