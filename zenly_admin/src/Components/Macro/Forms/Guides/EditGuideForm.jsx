import React, { useState, useEffect } from 'react';
import InputDefault from '../../../Mircro/FormElements/Input/InputDefault';
import SelectDefault from '../../../Mircro/FormElements/Select/SelectDefault';
import styles from '../../../../assets/css/components.module.css';

function EditGuideForm({ guide, onSubmit, onCancel, loading }) {
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
        available: 'yes',
        bio: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (guide) {
            const newFormData = {
                first_name: guide.first_name || '',
                last_name: guide.last_name || '',
                gender: guide.gender || '',
                date_of_birth: guide.date_of_birth ? guide.date_of_birth.split('T')[0] : '', // Format date for input
                phone: guide.phone || '',
                email: guide.email || '',
                password: '',
                languages: guide.languages || '',
                experience_years: guide.experience_years || '',
                specialization: guide.specialization || '',
                location: guide.location || '',
                available: guide.available === 'yes' ? 'yes' : 'no',
                bio: guide.bio || ''
            };
            setFormData(newFormData);
            setImagePreview(guide.profile_photo ? `${process.env.REACT_APP_API_URL || 'https://api.zenly.uz'}/${guide.profile_photo}` : null);
        }
    }, [guide]);

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
        if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.languages.trim()) newErrors.languages = 'Languages are required';
        if (!formData.experience_years && formData.experience_years !== 0) newErrors.experience_years = 'Experience years is required';
        if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
            newErrors.phone = 'Phone number is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!guide) {
            alert('No guide selected for editing');
            return;
        }

        if (!validateForm()) {
            alert('Please fix the validation errors before submitting');
            return;
        }

        const submitData = new FormData();

        // Only append changed values (like the user edit form)
        if (formData.first_name !== guide.first_name) submitData.append('first_name', formData.first_name);
        if (formData.last_name !== guide.last_name) submitData.append('last_name', formData.last_name);
        if (formData.gender !== guide.gender) submitData.append('gender', formData.gender);
        if (formData.date_of_birth !== (guide.date_of_birth ? guide.date_of_birth.split('T')[0] : '')) submitData.append('date_of_birth', formData.date_of_birth);
        if (formData.phone !== guide.phone) submitData.append('phone', formData.phone);
        if (formData.email !== guide.email) submitData.append('email', formData.email);
        if (formData.languages !== guide.languages) submitData.append('languages', formData.languages);
        if (formData.experience_years !== guide.experience_years) submitData.append('experience_years', parseInt(formData.experience_years) || 0);
        if (formData.specialization !== guide.specialization) submitData.append('specialization', formData.specialization);
        if (formData.location !== guide.location) submitData.append('location', formData.location);
        if (formData.available !== (guide.available === 'yes' ? 'yes' : 'no')) submitData.append('available', formData.available);
        if (formData.bio !== guide.bio) submitData.append('bio', formData.bio);

        // Only include password if it's not empty
        if (formData.password && formData.password.trim() !== '') {
            submitData.append('password', formData.password);
        }

        if (imageFile) {
            submitData.append('profile_photo', imageFile);
        }

        // Debug: Log what we're sending
        console.log('Form data being sent:', formData);
        console.log('FormData entries:');
        for (let [key, value] of submitData.entries()) {
            console.log(key, value);
        }

        onSubmit(submitData);
    };

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
    ];

    const availableOptions = [
        { value: 'yes', label: 'Available' },
        { value: 'no', label: 'Not Available' }
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
                        label="Date of Birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        showLabel={true}
                        error={errors.date_of_birth}
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
                        label="Password (leave blank to keep current)"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        showLabel={true}
                        error={errors.password}
                    />
                </div>

                <div className={styles.formGroup}>
                    <InputDefault
                        label="Languages"
                        type="text"
                        value={formData.languages}
                        onChange={(e) => handleInputChange('languages', e.target.value)}
                        showLabel={true}
                        error={errors.languages}
                        placeholder="e.g., English, Spanish, French"
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
                        label="Specialization"
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        showLabel={true}
                        error={errors.specialization}
                        placeholder="e.g., Historical Tours, Adventure Tours"
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
                    {loading ? 'Updating...' : 'Update Guide'}
                </button>
            </div>
        </form>
    );
}

export default EditGuideForm;