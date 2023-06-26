"use client";

import { useState } from "react";

type ToastType = "success" | "info" | "danger";

type Props = {
  type?: ToastType;
  text: string;
};

function Toast({ type, text }: Props) {
  let typeClass;

  switch (type) {
    case "success":
      typeClass = "alert-success";
      break;
    case "info":
      typeClass = "alert-info";
      break;
    case "danger":
      typeClass = "bg-error";
      break;
  }

  return (
    <div className="toast toast-top toast-center">
      <div className={`alert ${typeClass}`}>
        <span>{text}</span>
      </div>
    </div>
  );
}

export const useToast = () => {
  const [toastType, setToastType] = useState<ToastType>("info");
  const [toastText, setToastText] = useState<string>("");

  const showToast = ({
    type = "info",
    text,
    seconds = 5,
  }: Props & { seconds?: number }) => {
    setToastText(text);
    setToastType(type);

    // Clear toast
    setTimeout(() => {
      setToastText("");
    }, seconds * 1000);
  };

  return {
    Toast: () =>
      toastText ? <Toast type={toastType} text={toastText} /> : null,
    showToast,
  };
};
