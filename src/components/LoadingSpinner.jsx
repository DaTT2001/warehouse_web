import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingSpinner = ({ size = "md", message = "Đang tải..." }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <Spinner
        animation="border"
        role="status"
        size={size === "sm" ? "sm" : undefined}
      />
      <span className="mt-2">{message}</span>
    </div>
  );
};

export default LoadingSpinner;
