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
            <div className='flex items-center justify-center gap-7'>
                <NotesIcon />
                <h2 className='text-2xl font-semibold'>{comTitle}</h2>
            </div>

            <div className='mt-5 mb-5 text-xl'>
                <p>{comment}</p>
            </div>

            <div>
                <h2 className='text-2xl font-semibold'>{nameTitle}</h2>
            </div>
        </div>
    )
}

export default CommentCart