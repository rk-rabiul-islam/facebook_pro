import React from "react";
import userImg from "../../assets/images/user.png";
import { useSelector } from "react-redux";

const Avatar = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      <img
        src={
          user.profile_photo
            ? user.profile_photo
            : "https://www.shutterstock.com/image-vector/male-avatar-profile-picture-vector-260nw-221431012.jpg"
        }
        alt=""
      />
    </>
  );
};

export default Avatar;
