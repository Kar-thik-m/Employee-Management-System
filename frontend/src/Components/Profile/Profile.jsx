import React from "react";
import ProfileStyle from "../Profile/Profile.module.css";
import { useAuth } from "../../contextApi/AuthContext";

const Profile = () => {
    const { loading, user, error } = useAuth();

    console.log(user);

    if (loading) return <div className={ProfileStyle.loading}>Loading...</div>;
    if (error) return <div className={ProfileStyle.error}>Error: {error.message}</div>;

    return (
        <div className={ProfileStyle.profileContainer}>
            <div className={ProfileStyle.profileHeader}>Profile</div>
            <div className={ProfileStyle.userDetails}>
                <img
                    src={user?.userimage?.url}
                    alt={`${user?.username}'s profile`}
                    className={ProfileStyle.userImage}
                />
                <div className={ProfileStyle.userInfo}>
                    <p className={ProfileStyle.username}>{user?.username}</p>
                   
                </div>
            </div>
        </div>
    );
};

export default Profile;
