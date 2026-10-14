import { useState } from "react";
import "./PasswordInput.css";

export default function PasswordInput({
  toggleLabel = "password",
  ...inputProps
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-input">
      <input {...inputProps} type={visible ? "text" : "password"} />

      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((previous) => !previous)}
        aria-label={`${visible ? "Hide" : "Show"} ${toggleLabel}`}
        aria-controls={inputProps.id}
        disabled={inputProps.disabled}
        title={visible ? "Hide password" : "Show password"}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />

          {visible && <path d="m3 3 18 18" />}
        </svg>
      </button>
    </div>
  );
}
