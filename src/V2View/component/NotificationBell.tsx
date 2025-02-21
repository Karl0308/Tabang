

import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { Notification } from '../objects/Ticket';
import axios from 'axios';
import { APIURLS } from '../../APIURLS';

const NotificationBell: React.FC = () => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const bellRef = useRef<SVGSVGElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    // const [users, setUsers] = useState<User[]>([]);
    const axiosInstance = axios.create({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    });
    const FetchNotifications = () => {
        axiosInstance.get(APIURLS.notification.getNotifications + localStorage.getItem("id"))
            .then(res => res.data)
            .then(
                (result) => {
                    setNotifications(result);
                    let resultData = result as Notification[];
                    const unreadNotifications = resultData.filter(notification => !notification.isRead);
                    setNotificationCount(unreadNotifications.length);
                },
                (error) => {
                    console.log(error);
                }
            )
    }
    useEffect(() => {
        FetchNotifications();

        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    useEffect(() => {
        let shakeInterval;
        let intervalDuration = 10000;

        shakeInterval = setInterval(() => {
            FetchNotifications();
        }, intervalDuration);

        return () => clearInterval(shakeInterval);
    }, [notificationCount]);

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
    };

    const handleNotificationRowClick = (id: number) => {
        // Perform action when a notification is clicked
    };

    const ReadNotifications = (id: number) => {
        axiosInstance.post(APIURLS.notification.readNotifications + id);
    }

    const onNotificationClick = async (ticketNum: string) => {
        const url = window.location.origin + "/istest/" + ticketNum;
        // Open the URL in a new tab
        window.open(url, "_blank");
    };


    return (
        <div style={{ position: 'relative', display: 'inline-block', marginTop: '4px' }}>
            <style>
                {`
                        /* Add your CSS styles here */
                        #bell-icon {
                            font-size: 20px;  
                            color: yellow;
                            cursor: pointer;
                            background-color: gray;
                            padding: 10px;
                            margin-left: 20px;
                            border-radius: 50px;
                        }
                    `}
            </style>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <FontAwesomeIcon
                    id="bell-icon"
                    icon={faBell}
                    onClick={handleNotificationClick}
                    ref={bellRef}
                />
                {notificationCount > 0 && (
                    <span
                        className="notification-badge"
                        style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: 'red',
                            borderRadius: "50px",
                            fontSize: '10px',
                            padding: '2px',
                            width: '16px',
                            height: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        {notificationCount}
                    </span>

                )}
            </div>

            {showNotifications && (
                <div
                    ref={notificationRef}
                    className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto z-50 w-96"
                    style={{ maxHeight: '500px' }}
                >
                    <div className="sticky top-0 bg-blue-500 text-white py-2 px-4 font-bold">
                        Notifications
                    </div>
                    <div className="py-2">
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div
                                    className={`notification-item ${!notification.isRead ? 'bg-gray-100' : 'bg-white'} p-4 rounded-lg shadow-md mb-1 cursor-pointer hover:bg-gray-300 transition`}
                                    key={notification.id}
                                    onClick={(e) => {
                                        ReadNotifications(notification.id);
                                        onNotificationClick(notification.ticketNumber);
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">{notification.dateText}</span>
                                    </div>

                                    <p className="mt-2 text-gray-800"> <span className="text-blue-600 font-semibold">{notification.fromUserFullName}</span> {notification.message} in a comment</p>

                                    <div className="mt-3 text-sm text-blue-500 hover:underline">
                                        <a href={window.location.origin + "/istest/" + notification.ticketNumber}>
                                            {window.location.origin + "/istest/" + notification.ticketNumber}
                                        </a>
                                    </div>
                                </div>
                            ))

                        ) : (
                            <div className="px-4 py-3 text-gray-500">No notifications available</div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default NotificationBell;
