import React from 'react'
import NotesIcon from '@mui/icons-material/Notes';

interface CommentCartProps {
    comTitle: string,
    comment: string,
    nameTitle: string
}

const CommentCart: React.FC<CommentCartProps> = ({ comTitle, comment, nameTitle }) => {
    return (
        <div>
            <div className='flex items-center gap-4 sm:gap-5 md:gap-7'>
                <NotesIcon className='text-lg sm:text-xl md:text-2xl' />
                <h2 className='text-xl sm:text-2xl md:text-3xl font-semibold'>{comTitle}</h2>
            </div>

            <div className='mt-4 mb-4 text-base sm:text-lg md:text-xl leading-relaxed md:leading-[40px]'>
                <p>{comment}</p>
            </div>

            <div className='mt-6 md:mt-10 float-right'>
                <h2 className='text-lg sm:text-xl md:text-2xl font-semibold'>{nameTitle}</h2>
            </div>
        </div>
    )
}

export default CommentCart
