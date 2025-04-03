const Notification = ({ notification }) => {
  if (notification.message === null) return null;
  const className = `notification notification--${notification.type}`;
  return <div className={className}>{notification.message}</div>;
};

export default Notification;
