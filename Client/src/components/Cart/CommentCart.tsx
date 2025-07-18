import React from 'react'
import NotesIcon from '@mui/icons-material/Notes';

interface CommentCartProps {
    comment: string,
    nameTitle: string,
    commentor: string
}

const CommentCart: React.FC<CommentCartProps> = ({ comment, nameTitle, commentor }) => {
    return (
        <div>
            <div className='flex items-center gap-4 sm:gap-5 md:gap-7'>
                <NotesIcon className='text-lg sm:text-xl md:text-2xl' />
                <h1 className='text-lg sm:text-xl md:text-2xl font-semibold'>{nameTitle}</h1>
            </div>

            <div className='mt-4 mb-4 text-base sm:text-lg md:text-xl leading-relaxed md:leading-[40px]'>
                <p>{comment}</p>
            </div>

            <div className='mt-6 md:mt-10 float-right'>
                <h2 className='text-lg sm:text-xl md:text-2xl font-semibold'>{commentor}</h2>
            </div>
        </div>
    )
}

export default CommentCart
