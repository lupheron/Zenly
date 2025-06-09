import React from 'react'

interface LabelDefaultProps {
    label: string,
    customClasses?: string
    htmlFor: string
}

const LabelDefault: React.FC<LabelDefaultProps> = ({ label, customClasses, htmlFor }) => {
    return (
        <label htmlFor={htmlFor} className={`${customClasses}`}>
            {label}
        </label>
    )
}

export default LabelDefault