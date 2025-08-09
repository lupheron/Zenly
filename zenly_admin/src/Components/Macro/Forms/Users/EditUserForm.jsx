import React, { useState, useEffect } from 'react';
import InputDefault from '../../../Mircro/FormElements/Input/InputDefault';
import SelectDefault from '../../../Mircro/FormElements/Select/SelectDefault';
import styles from '../../../../assets/css/components.module.css';

function EditUserForm({ userData, onSubmit, onCancel, loading = false }) {
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        phone: '',
        address: '',
        vip_status: '',
        type: 1
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (userData) {
            setFormData({
                fullname: userData.fullname || '',
                username: userData.username || '',
                phone: userData.phone || '',
                address: userData.address || '',
                vip_status: userData.vip_status || '',
                type: userData.type || 1
            });
            if (userData.img) {
                setImagePreview(getImageUrl(userData.img));
            }
        }
    }, [userData]);


    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        if (imagePath.startsWith('uploads/')) {
            const pathWithoutUploads = imagePath.replace('uploads/', '');
            return `${baseUrl}/files/${pathWithoutUploads}`;
        }

        const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        return `${baseUrl}/files/${cleanPath}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullname.trim()) {
            newErrors.fullname = 'Full name is required';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = new FormData();

        // Append only changed values
        if (formData.fullname !== userData.fullname) submitData.append('fullname', formData.fullname);
        if (formData.username !== userData.username) submitData.append('username', formData.username);
        if (formData.phone !== userData.phone) submitData.append('phone', formData.phone);
        if (formData.address !== userData.address) submitData.append('address', formData.address);
        if (formData.vip_status !== userData.vip_status) submitData.append('vip_status', formData.vip_status);
        if (formData.type !== userData.type) submitData.append('type', formData.type);

        if (imageFile) {
            submitData.append('img', imageFile);
        }

        onSubmit(submitData);
    };


    return (
        <form onSubmit={handleSubmit} className={styles.editUserForm}>
            <div className={styles.formGrid}>
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
                    <InputDefault
                        label="Full Name"
                        showLabel={true}
                        name="fullname"
                        type="text"
                        placeholder="Enter full name"
                        value={formData.fullname}
                        onChange={handleChange}
                        error={errors.fullname}
                    />

                    <InputDefault
                        label="Username"
                        showLabel={true}
                        name="username"
                        type="text"
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={handleChange}
                        error={errors.username}
                    />

                    <InputDefault
                        label="Phone"
                        showLabel={true}
                        name="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                    />

                    <InputDefault
                        label="Address"
                        showLabel={true}
                        name="address"
                        type="text"
                        placeholder="Enter address"
                        value={formData.address}
                        onChange={handleChange}
                        error={errors.address}
                    />

                    <SelectDefault
                        label="VIP Status"
                        showLabel={true}
                        name="vip_status"
                        value={formData.vip_status}
                        onChange={handleChange}
                        options={[
                            { value: 'VIP', label: 'VIP' },
                            { value: 'Regular', label: 'Regular' }
                        ]}
                    />

                    <SelectDefault
                        label="User Type"
                        showLabel={true}
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        options={[
                            { value: 1, label: 'Client' },
                            { value: 0, label: 'User' }
                        ]}
                    />
                </div>
            </div>

            {/* Form Actions */}
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
                    {loading ? 'Updating...' : 'Update User'}
                </button>
            </div>
        </form>
    );
}

export default EditUserForm;