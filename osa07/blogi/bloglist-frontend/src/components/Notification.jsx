import { useSelector } from "react-redux";

// const Notification = ({ message, type }) => {
const Notification = ({ type }) => {
  const notification = useSelector(({ notification }) => {
    return notification;
  });

  // if (message === null) {
  //   return null;
  // }

  if (!notification) {
    return null;
  }

  return <div className={`notification ${type}`}>{notification}</div>;
};

export default Notification;
