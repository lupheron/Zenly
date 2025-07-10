import React from 'react'
import AddCommentIcon from '@mui/icons-material/AddComment';

const Comment = () => {
    return (
        <button
            className='
                group fixed bottom-5 right-5 z-50
                flex items-center justify-start
                w-14 h-14 md:w-16 md:h-16
                rounded-full bg-white shadow-lg
                transition-all duration-300
                hover:w-64 hover:pl-4
                overflow-hidden
                border border-gray-200
                hover:rounded-xl
                cursor-pointer
                px-5
            '
        >
            <AddCommentIcon className='text-blue-500 text-xl' />
            <span className='
                text-sm md:text-base ml-2 text-gray-700
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
                whitespace-nowrap
            '>
                Websayt haqida fikringiz
            </span>
        </button>
    )
}

export default Comment
