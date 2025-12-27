'use client'

import InputDefault from '@/src/components/FormElements/Input/InputDefault'
import LabelDefault from '@/src/components/FormElements/label/LabelDefault'
import { useLanguage } from '@/src/contexts/LanguageContext'

const amenities = [
    { value: 'amenities.wifi', label: 'Wi-Fi' },
    { value: 'amenities.kitchen', label: 'Tashqi va ichki oshxona' },
    { value: 'amenities.bathroom', label: 'Shaxsiy hammom' },
    { value: 'amenities.climate', label: 'Isitish / Konditsioner' },
    { value: 'amenities.spa', label: 'Sauna / Issiq vannalar' },
    { value: 'amenities.bbq', label: 'Mangal / Kamin' },
    { value: 'amenities.parking', label: 'Avtoturargoh' },
    { value: 'amenities.pool', label: 'Suzish havzasi' },
]

interface AmenitiesProps {
    selectedAmenities: string[];
    onChange: (selected: string[]) => void;
}

const Amenities: React.FC<AmenitiesProps> = ({ selectedAmenities, onChange }) => {
    const { t } = useLanguage()

    const handleChange = (label: string) => {
        const newSelected = selectedAmenities.includes(label)
            ? selectedAmenities.filter((item) => item !== label)
            : [...selectedAmenities, label];
        onChange(newSelected);
    };

    return (
        <div>
            <div className="flex flex-col gap-7 md:gap-4 mb-4 md:mb-6">
                {amenities.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 whitespace-nowrap">
                        <InputDefault
                            type="checkbox"
                            name="amenity"
                            id={item.label}
                            checked={selectedAmenities.includes(item.label)}
                            onChange={() => handleChange(item.label)}
                        />
                        <LabelDefault
                            label={t(item.value)}
                            htmlFor={item.label}
                            customClasses="text-sm md:text-base"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Amenities;