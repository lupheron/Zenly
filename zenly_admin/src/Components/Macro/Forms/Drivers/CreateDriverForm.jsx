import React, { useState } from 'react';
import InputDefault from '../../../Mircro/FormElements/Input/InputDefault';
import SelectDefault from '../../../Mircro/FormElements/Select/SelectDefault';
import styles from '../../../../assets/css/components.module.css';

function CreateDriverForm({ onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        phone: '',
        email: '',
        password: '',
        language: '',
        experience_years: '',
        license_number: '',
        vehicle_type: '',
        vehicle_model: '',
        plate_number: '',
        location: '',
        price_per_day: '',
        available: 'yes',
        bio: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        if (!formData.language.trim()) newErrors.language = 'Language is required';
        if (!formData.experience_years && formData.experience_years !== 0) newErrors.experience_years = 'Experience years is required';
        if (!formData.license_number.trim()) newErrors.license_number = 'License number is required';
        if (!formData.vehicle_type.trim()) newErrors.vehicle_type = 'Vehicle type is required';
        if (!formData.vehicle_model.trim()) newErrors.vehicle_model = 'Vehicle model is required';
        if (!formData.plate_number.trim()) newErrors.plate_number = 'Plate number is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.price_per_day && formData.price_per_day !== 0) newErrors.price_per_day = 'Price per day is required';

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
            newErrors.phone = 'Phone number is invalid';
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.price_per_day && (isNaN(formData.price_per_day) || formData.price_per_day < 0)) {
            newErrors.price_per_day = 'Price per day must be a positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fix the validation errors before submitting');
            return;
        }

        const submitData = new FormData();

        // Append all form data
        Object.keys(formData).forEach(key => {
            if (formData[key] !== '') {
                submitData.append(key, formData[key]);
            }
        });

        if (imageFile) {
            submitData.append('profile_photo', imageFile);
        }

        onSubmit(submitData);
    };

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
    ];

    const availableOptions = [
        { value: 'yes', label: 'Available' },
        { value: 'no', label: 'Not Available' }
    ];

    const vehicleTypeOptions = [
        { value: 'car', label: 'Car' },
        { value: 'minivan', label: 'Minivan' },
        { value: 'bus', label: 'Bus' },
        { value: 'jeep', label: 'Jeep' }
    ];

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <InputDefault
                        label="First Name"
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        showLabel={true}
                        error={errors.first_name}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <InputDefault
                        label="Last Name"
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        showLabel={true}
                        error={errors.last_name}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <SelectDefault
                        label="Gender"
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        options={genderOptions}
                        showLabel={true}
                        error={errors.gender}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <InputDefault
                        label="Phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        showLabel={true}
                        error={errors.phone}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <InputDefault
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        showLabel={true}
                        error={errors.email}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <InputDefault
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        showLabel={true}
                        error={errors.password}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <InputDefault
                        label="Language"
                        type="text"
                        value={formData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        showLabel={true}
                        error={errors.language}
                        placeholder="e.g., English, Uzbek, Russian"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <InputDefault
                        label="Experience Years"
                        type="number"
                        value={formData.experience_years}
                        onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                        showLabel={true}
                        error={errors.experience_years}
                        min="0"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <InputDefault
                        label="License Number"
                        type="text"
                        value={formData.license_number}
                        onChange={(e) => handleInputChange('license_number', e.target.value)}
                        showLabel={true}
                        error={errors.license_number}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <SelectDefault
                        label="Vehicle Type"
                        value={formData.vehicle_type}
                        onChange={(e) => handleInputChange('vehicle_type', e.target.value)}
                        options={vehicleTypeOptions}
                        showLabel={true}
                        error={errors.vehicle_type}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <InputDefault
                        label="Vehicle Model"
                        type="text"
                        value={formData.vehicle_model}
                        onChange={(e) => handleInputChange('vehicle_model', e.target.value)}
                        showLabel={true}
                        error={errors.vehicle_model}
                        placeholder="e.g., Toyota Camry, Honda CR-V"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <InputDefault
                        label="Plate Number"
                        type="text"
                        value={formData.plate_number}
                        onChange={(e) => handleInputChange('plate_number', e.target.value)}
                        showLabel={true}
                        error={errors.plate_number}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <InputDefault
                        label="Location"
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        showLabel={true}
                        error={errors.location}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <InputDefault
                        label="Price Per Day ($)"
                        type="number"
                        value={formData.price_per_day}
                        onChange={(e) => handleInputChange('price_per_day', parseFloat(e.target.value) || 0)}
                        showLabel={true}
                        error={errors.price_per_day}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <SelectDefault
                        label="Availability"
                        value={formData.available}
                        onChange={(e) => handleInputChange('available', e.target.value)}
                        options={availableOptions}
                        showLabel={true}
                        error={errors.available}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Profile Photo</label>
                    <div className={styles.imageUploadContainer}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.fileInput}
                            id="profile-photo"
                        />
                        <label htmlFor="profile-photo" className={styles.fileInputLabel}>
                            Choose Photo
                        </label>
                        {imagePreview && (
                            <div className={styles.imagePreview}>
                                <img src={imagePreview} alt="Preview" />
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.formGroupFull}>
                    <InputDefault
                        label="Bio"
                        type="textarea"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        showLabel={true}
                        error={errors.bio}
                        placeholder="Tell us about yourself..."
                        rows={4}
                    />
                </div>
            </div>

            <div className={styles.formActions}>
                <button
                    type="button"
                    onClick={onCancel}
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Driver'}
                </button>
            </div>
        </form>
    );
}

export default CreateDriverForm;
