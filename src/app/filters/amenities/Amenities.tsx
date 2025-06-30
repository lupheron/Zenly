'use client'

import InputDefault from '@/src/components/FormElements/Input/InputDefault'
import LabelDefault from '@/src/components/FormElements/label/LabelDefault'

const amenities = [
    { value: 'wifi', label: 'Wi-Fi' },
    { value: 'kitchen', label: 'Tashqi va ichki oshxona' },
    { value: 'bathroom', label: 'Shaxsiy hammom' },
    { value: 'climate', label: 'Isitish / Konditsioner' },
    { value: 'spa', label: 'Sauna / Issiq vannalar' },
    { value: 'bbq', label: 'Mangal / Kamin' },
    { value: 'parking', label: 'Avtoturargoh' },
    { value: 'pool', label: 'Suzish havzasi' },
]

interface AmenitiesProps {
    selectedAmenities: string[];
    onChange: (selected: string[]) => void;
}

const Amenities: React.FC<AmenitiesProps> = ({ selectedAmenities, onChange }) => {
    const handleChange = (label: string) => {
        const newSelected = selectedAmenities.includes(label)
            ? selectedAmenities.filter((item) => item !== label)
            : [...selectedAmenities, label];
        onChange(newSelected);
    };

    return (
        <div>
            <div className='flex flex-wrap gap-4 mb-6'>
                {amenities.map((item) => (
                    <div key={item.label} className='flex items-center gap-2'>
                        <InputDefault
                            type='checkbox'
                            name='amenity'
                            id={item.label}
                            checked={selectedAmenities.includes(item.label)}
                            onChange={() => handleChange(item.label)}
                        />
                        <LabelDefault label={item.label} htmlFor={item.label} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Amenities