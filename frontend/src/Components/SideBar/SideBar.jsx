import React from 'react';
import { Link } from 'react-router-dom';
import SidebarStyle from "../SideBar/SideBar.module.css";
import { useAuth } from '../../contextApi/AuthContext';

const SideBar = () => {
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className={SidebarStyle.sidebar}>
            <h2 className={SidebarStyle.title}>Employee Dashboard</h2>
            <ul className={SidebarStyle.menu}>
                {user?.role === "admin" ? <li className={SidebarStyle.menuItem}>
                    <Link to="/admindashboard" className={SidebarStyle.link}>Admin Dashboard</Link>
                </li> : <li className={SidebarStyle.menuItem}>
                    <Link to="/dashboard" className={SidebarStyle.link}>Dashboard</Link>
                </li>
                }

                {user?.role !== "admin" ?
                    <li className={SidebarStyle.menuItem}>
                        <Link to="/tasklist" className={SidebarStyle.link}>Tasks</Link>
                    </li> :
                    <li className={SidebarStyle.menuItem}>
                        <Link to="/assingtask" className={SidebarStyle.link}>Tasks</Link>
                    </li>
                }



                <li className={SidebarStyle.menuItem}>
                    <Link to="/reports" className={SidebarStyle.link}>Reports</Link>
                </li>
                <li className={SidebarStyle.menuItem}>
                    <Link to="/work-history" className={SidebarStyle.link}>Work History</Link>
                </li>
                <li className={SidebarStyle.menuItem}>
                    <Link to="/profile" className={SidebarStyle.link}>Profile</Link>
                </li>
                <li className={SidebarStyle.menuItem}>
                    <Link className={SidebarStyle.link} onClick={handleLogout}>Logout</Link>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
