import React, { useState } from "react";
import { Alert, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;

const NoticeBoard = ({ notice }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Alert
      message={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>{notice}</Text>
          <CloseOutlined
            onClick={() => setVisible(false)}
            style={{ marginLeft: "16px", cursor: "pointer" }}
          />
        </div>
      }
      type="info"
      showIcon
      closable={false}
      style={{ marginBottom: "16px", borderRadius: "4px" }}
    />
  );
};

export default NoticeBoard;
