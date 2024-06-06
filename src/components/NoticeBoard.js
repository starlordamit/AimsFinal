import React, { useState, useEffect } from "react";
import { Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import styled, { keyframes, css } from "styled-components";

const { Text } = Typography;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
`;

const NoticeContainer = styled.div`
  position: relative;
  z-index: 1000;
  animation: ${(props) =>
    props.isClosing
      ? css`
          ${slideOut} 0.5s ease-in-out forwards
        `
      : css`
          ${slideIn} 0.5s ease-in-out forwards
        `};
  margin-bottom: 16px;
  display: ${(props) => (props.isVisible ? "block" : "none")};
`;

const NoticeContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #0050b3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-family: Arial, sans-serif;
  font-size: 16px;
`;

const CloseIcon = styled(CloseOutlined)`
  margin-left: 16px;
  cursor: pointer;
  color: #0050b3;
  font-size: 18px;

  &:hover {
    color: #ff4d4f;
    transform: scale(1.2);
    transition: transform 0.2s ease-in-out;
  }
`;

const NoticeBoard = ({ notice }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => setIsVisible(false), 500);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 500);
  };

  if (!isVisible) return null;

  return (
    <NoticeContainer isVisible={isVisible} isClosing={isClosing}>
      <NoticeContent>
        <Text>{notice}</Text>
        <CloseIcon onClick={handleClose} />
      </NoticeContent>
    </NoticeContainer>
  );
};

export default NoticeBoard;
