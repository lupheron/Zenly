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
                    group fixed bottom-20 right-4 sm:bottom-20 sm:right-5 lg:bottom-5 lg:right-5 z-50
                    flex items-center justify-start
                    w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                    rounded-full bg-purple-700 shadow-lg
                    transition-all duration-300
                    hover:w-48 sm:hover:w-56 md:hover:w-64 hover:pl-3 sm:hover:pl-4
                    overflow-hidden
                    border border-purple-700
                    hover:rounded-xl
                    cursor-pointer
                    px-3 sm:px-4 md:px-5
                "
                onClick={() => setOpenModal(true)}
            >
                <AddCommentIcon className="text-white text-lg sm:text-xl flex-shrink-0" />
                <span
                    className="
                        text-xs sm:text-sm md:text-base ml-2 text-white
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-300
                        whitespace-nowrap
                        font-medium
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
