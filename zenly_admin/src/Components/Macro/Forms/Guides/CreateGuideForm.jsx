import React, { useState } from 'react';
import InputDefault from '../../../Mircro/FormElements/Input/InputDefault';
import SelectDefault from '../../../Mircro/FormElements/Select/SelectDefault';
import styles from '../../../../assets/css/components.module.css';

function CreateGuideForm({ onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        phone: '',
        email: '',
        password: '',
        languages: '',
        experience_years: '',
        specialization: '',
        location: '',
        available: '1',
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
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
        console.log('File input changed:', e.target.files);
        const file = e.target.files[0];
        if (file) {
            console.log('File selected:', file.name, file.type, file.size);
            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            console.log('No file selected');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        if (!formData.languages.trim()) newErrors.languages = 'Languages are required';
        if (!formData.experience_years) newErrors.experience_years = 'Experience years is required';
        if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        // Experience years validation
        if (formData.experience_years && (isNaN(formData.experience_years) || formData.experience_years < 0)) {
            newErrors.experience_years = 'Please enter a valid number of years';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Create FormData for file upload
        const submitData = new FormData();
        
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });

        // Add image file if selected
        if (imageFile) {
            console.log('Adding image file to FormData:', imageFile.name);
            submitData.append('profile_photo', imageFile);
        } else {
            console.log('No image file to add');
        }

        // Debug FormData contents
        console.log('FormData contents:');
        for (let [key, value] of submitData.entries()) {
            console.log(key, value);
        }

        onSubmit(submitData);
    };

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
    ];

    const availableOptions = [
        { value: '1', label: 'Available' },
        { value: '0', label: 'Not Available' }
    ];

    return (
        <form onSubmit={handleSubmit} className={styles.guideForm}>
            <div className={styles.guideFormContainer}>
                {/* Profile Image Section */}
                <div className={styles.imageSection}>
                    <label className={styles.label}>Profile Image</label>
                    <div className={styles.imageUploadContainer}>
                        <div className={styles.imagePreview}>
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile preview"
                                    className={styles.previewImage}
                                />
                            ) : (
                                <div className={styles.noImage}>
                                    <span>No image</span>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.fileInput}
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className={styles.uploadButton}>
                            {imageFile ? 'Change Image' : 'Upload Image'}
                        </label>
                    </div>
                </div>

                {/* Form Fields */}
                <div className={styles.formFields}>
                    <div className={styles.formRow}>
                        <InputDefault
                            label="First Name"
                            placeholder="Enter first name"
                            value={formData.first_name}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            showLabel={true}
                            required={true}
                            error={errors.first_name}
                        />
                        <InputDefault
                            label="Last Name"
                            placeholder="Enter last name"
                            value={formData.last_name}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            showLabel={true}
                            required={true}
                            error={errors.last_name}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <SelectDefault
                            label="Gender"
                            options={genderOptions}
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            showLabel={true}
                            required={true}
                            error={errors.gender}
                        />
                        <InputDefault
                            label="Date of Birth"
                            type="date"
                            value={formData.date_of_birth}
                            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                            showLabel={true}
                            required={true}
                            error={errors.date_of_birth}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <InputDefault
                            label="Phone"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            showLabel={true}
                            required={true}
                            error={errors.phone}
                        />
                        <InputDefault
                            label="Email"
                            type="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            showLabel={true}
                            required={true}
                            error={errors.email}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <InputDefault
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            showLabel={true}
                            required={true}
                            error={errors.password}
                        />
                        <InputDefault
                            label="Languages"
                            placeholder="e.g., English, Russian, Uzbek"
                            value={formData.languages}
                            onChange={(e) => handleInputChange('languages', e.target.value)}
                            showLabel={true}
                            required={true}
                            error={errors.languages}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <InputDefault
                            label="Experience Years"
                            type="number"
                            placeholder="Enter years of experience"
                            value={formData.experience_years}
                            onChange={(e) => handleInputChange('experience_years', e.target.value)}
                            showLabel={true}
                            required={true}
                            error={errors.experience_years}
                        />
                        <InputDefault
                            label="Location"
                            placeholder="Enter location"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            showLabel={true}
                            required={true}
                            error={errors.location}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <InputDefault
                            label="Specialization"
                            placeholder="e.g., Historical Tours, Nature Tours"
                            value={formData.specialization}
                            onChange={(e) => handleInputChange('specialization', e.target.value)}
                            showLabel={true}
                            required={true}
                            error={errors.specialization}
                        />
                        <SelectDefault
                            label="Availability"
                            options={availableOptions}
                            value={formData.available}
                            onChange={(e) => handleInputChange('available', e.target.value)}
                            showLabel={true}
                            required={true}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Bio</label>
                            <textarea
                                className={styles.input}
                                placeholder="Enter guide's bio"
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.formActions}>
                <button
                    type="button"
                    onClick={onCancel}
                    className={`${styles.button} ${styles.buttonBlack}`}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Guide'}
                </button>
            </div>
        </form>
    );
}

export default CreateGuideForm;
