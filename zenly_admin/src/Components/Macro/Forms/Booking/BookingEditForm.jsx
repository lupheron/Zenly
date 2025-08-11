import React, { useState, useEffect } from "react";
import InputDefault from "../../../Mircro/FormElements/Input/InputDefault";
import SelectDefault from "../../../Mircro/FormElements/Select/SelectDefault";
import ButtonDefault from "../../../Mircro/Button/ButtonDefault";
import styles from "../../../../assets/css/components.module.css";
import { usePosts } from "../../../../hooks/Posts/usePosts";
import { useUsersStore } from "../../../../hooks/Users/useUsers";

function BookingEditForm({ initialData, onSubmit, onCancel, loading = false }) {
    const [formData, setFormData] = useState({
        user_id: initialData?.user_id || "",
        post_id: initialData?.post_id || "",
        send_date: initialData?.send_date || "",
        status: initialData?.status || "",
        book_status: initialData?.book_status || "",
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

    // Only show user with id = 1
    const filteredUsers = users.filter(user => user.type === 1);

    return (
        <form onSubmit={handleSubmit} className={styles.ratingFormContainer}>

            {/* User: Only ID 1 */}
            <SelectDefault
                label="User"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                options={filteredUsers.map(user => ({
                    value: user.id,
                    label: user.fullname
                }))}
                required
            />

            {/* Post: Show all posts */}
            <SelectDefault
                label="Post"
                name="post_id"
                value={formData.post_id}
                onChange={handleChange}
                options={posts.map(post => ({
                    value: post.id,
                    label: post.title
                }))}
                required
            />

            {/* Status */}
            <SelectDefault
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                    { value: "pending", label: "Pending" },
                    { value: "active", label: "Active" },
                    { value: "cancelled", label: "Cancelled" }
                ]}
                required
            />

            {/* Book Status */}
            <SelectDefault
                label="Book Status"
                name="book_status"
                value={formData.book_status}
                onChange={handleChange}
                options={[
                    { value: 0, label: "Not Booked" },
                    { value: 1, label: "Booked" }
                ]}
                required
            />

            {/* Send Date */}
            <InputDefault
                showLabel
                label="Send Date"
                name="send_date"
                type="date"
                value={formData.send_date}
                onChange={handleChange}
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

export default BookingEditForm;
