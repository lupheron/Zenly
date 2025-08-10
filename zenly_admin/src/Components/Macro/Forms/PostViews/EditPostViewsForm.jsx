import React, { useState, useEffect } from "react";
import InputDefault from "../../../Mircro/FormElements/Input/InputDefault";
import SelectDefault from "../../../Mircro/FormElements/Select/SelectDefault";
import ButtonDefault from "../../../Mircro/Button/ButtonDefault";
import styles from "../../../../assets/css/components.module.css";
import { usePosts } from "../../../../hooks/Posts/usePosts";
import { useUsersStore } from "../../../../hooks/Users/useUsers";

function EditPostViewsForm({ initialData, onSubmit, onCancel, loading = false }) {
    const [formData, setFormData] = useState({
        post_id: initialData?.post_id || "",
        user_id: initialData?.user_id || "",
        clicked: initialData?.clicked || "",
    });

    const { posts, getAllPosts } = usePosts();
    const { users, getUsers } = useUsersStore();

    useEffect(() => {
        getUsers();
        getAllPosts();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.ratingFormContainer}>
            <SelectDefault
                label="Post"
                name="post_id"
                value={formData.post_id}
                onChange={handleChange}
                options={(posts || []).map(post => ({
                    value: post.id,
                    label: post.title
                }))}
                required
            />

            <SelectDefault
                label="User"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                options={(users || []).map(user => ({
                    value: user.id,
                    label: user.fullname
                }))}
                required
            />

            <InputDefault
                showLabel
                label="clicked"
                name="clicked"
                type="number"
                placeholder="Enter clicked (1-5)"
                value={formData.clicked}
                onChange={handleChange}
                min="1"
                max="5"
                required
            />

            <div className={styles.ratingButtonGroup}>
                <ButtonDefault
                    type="submit"
                    disabled={loading}
                    children={loading ? "Saving..." : "Save"}
                />
                <ButtonDefault
                    type="button"
                    onClick={onCancel}
                    variant="red"
                    children={"Cancel"}
                />
            </div>
        </form>
    );
}

export default EditPostViewsForm;
