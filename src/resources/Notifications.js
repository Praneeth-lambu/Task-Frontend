import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Notification.css';
import { removeNotification, setNotifications } from '../redux/notificationSlice';

const Notification = () => {
  const tasks = useSelector(state => state.tasks.tasks); // Assuming tasks are in the state
  const notifications = useSelector(state => state.notifications); // Access notifications from Redux
  const dispatch = useDispatch();

  // Configure how much time before the due date you want to show notifications
  const NOTIFICATION_TIME = 48 * 60 * 60 * 1000; // 24 hours in milliseconds

  useEffect(() => {
    const now = new Date();
    const upcomingNotifications = tasks
      .filter(task => {
        if (task.due_date) {
          const dueDate = new Date(task.due_date);
          const timeUntilDue = dueDate - now;
          return timeUntilDue <= NOTIFICATION_TIME && timeUntilDue > 0;
        }
        return false;
      })
      .map(task => {
        const timeUntilDue = new Date(task.due_date) - now;
        const daysUntilDue = Math.ceil(timeUntilDue / (1000 * 60 * 60 * 24));
        return {
          id: task._id,
          title: task.title,
          dueDate: task.due_date,
          daysUntilDue,
          status: 'upcoming'
        };
      });

    const overdueNotifications = tasks
      .filter(task => {
        if (task.due_date) {
          const dueDate = new Date(task.due_date);
          return dueDate < now; // Task is overdue
        }
        return false;
      })
      .map(task => {
        const daysPastDue = Math.ceil((now - new Date(task.due_date)) / (1000 * 60 * 60 * 24));
        return {
          id: task._id,
          title: task.title,
          dueDate: task.due_date,
          daysPastDue,
          status: 'pastDue'
        };
      });

    dispatch(setNotifications([...upcomingNotifications, ...overdueNotifications])); // Dispatch notifications
  }, [NOTIFICATION_TIME, tasks, dispatch]);

  const handleDismiss = (id) => {
    dispatch(removeNotification(id)); // Dispatch action to remove notification
  };

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification ${notification.status}`}
        >
          <div className="notification-content">
            <p className="notification-title">
              {notification.title}
            </p>
            <p className="notification-details">
              {notification.status === 'pastDue' ? 
                `Due by ${notification.daysPastDue} ${notification.daysPastDue === 1 ? "day" : "days"}.` :
                `Due in ${notification.daysUntilDue} ${notification.daysUntilDue <= 1 ? "day" : "days"}.`
              }
            </p>
          </div>
          <button className="notification-dismiss" onClick={() => handleDismiss(notification.id)}>&times;</button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
