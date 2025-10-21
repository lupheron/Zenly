import React, { useState, useEffect } from 'react';
import InputDefault from '../../../Mircro/FormElements/Input/InputDefault';
import SelectDefault from '../../../Mircro/FormElements/Select/SelectDefault';
import styles from '../../../../assets/css/components.module.css';

function EditDriverForm({ driver, onSubmit, onCancel, loading }) {
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

    useEffect(() => {
        if (driver) {
            const newFormData = {
                first_name: driver.first_name || '',
                last_name: driver.last_name || '',
                gender: driver.gender || '',
                phone: driver.phone || '',
                email: driver.email || '',
                password: '',
                language: driver.language || '',
                experience_years: driver.experience_years || '',
                license_number: driver.license_number || '',
                vehicle_type: driver.vehicle_type || '',
                vehicle_model: driver.vehicle_model || '',
                plate_number: driver.plate_number || '',
                location: driver.location || '',
                price_per_day: driver.price_per_day || '',
                available: driver.available === 'yes' ? 'yes' : 'no',
                bio: driver.bio || ''
            };
            setFormData(newFormData);
            setImagePreview(driver.profile_photo ? `${process.env.REACT_APP_API_URL || 'https://api.zenly.uz'}/${driver.profile_photo}` : null);
        }
    }, [driver]);

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

        if (!driver) {
            alert('No driver selected for editing');
            return;
        }

        if (!validateForm()) {
            alert('Please fix the validation errors before submitting');
            return;
        }

        const submitData = new FormData();

        // Only append changed values (like the user edit form)
        if (formData.first_name !== driver.first_name) submitData.append('first_name', formData.first_name);
        if (formData.last_name !== driver.last_name) submitData.append('last_name', formData.last_name);
        if (formData.gender !== driver.gender) submitData.append('gender', formData.gender);
        if (formData.phone !== driver.phone) submitData.append('phone', formData.phone);
        if (formData.email !== driver.email) submitData.append('email', formData.email);
        if (formData.language !== driver.language) submitData.append('language', formData.language);
        if (formData.experience_years !== driver.experience_years) submitData.append('experience_years', parseInt(formData.experience_years) || 0);
        if (formData.license_number !== driver.license_number) submitData.append('license_number', formData.license_number);
        if (formData.vehicle_type !== driver.vehicle_type) submitData.append('vehicle_type', formData.vehicle_type);
        if (formData.vehicle_model !== driver.vehicle_model) submitData.append('vehicle_model', formData.vehicle_model);
        if (formData.plate_number !== driver.plate_number) submitData.append('plate_number', formData.plate_number);
        if (formData.location !== driver.location) submitData.append('location', formData.location);
        if (formData.price_per_day !== driver.price_per_day) submitData.append('price_per_day', parseFloat(formData.price_per_day) || 0);
        if (formData.available !== (driver.available === 'yes' ? 'yes' : 'no')) submitData.append('available', formData.available);
        if (formData.bio !== driver.bio) submitData.append('bio', formData.bio);

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
                    {loading ? 'Updating...' : 'Update Driver'}
                </button>
            </div>
        </form>
    );
}

export default EditDriverForm;
