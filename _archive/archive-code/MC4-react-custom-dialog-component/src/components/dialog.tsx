import React, { useEffect, useRef, type PropsWithChildren } from "react";

import styles from "./dialog.module.css";

interface CustomDialogProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  isOpen,
  onClose,
  showCloseButton,
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const dialog = dialogRef.current;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") onClose();

        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      }

      dialog.focus();
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog" aria-labelledby="dialog-title">
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div
        className={`${styles.dialog} ${isOpen ? styles.dialogEnter : styles.dialogExit}`}
        ref={dialogRef}
        tabIndex={-1}
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button className={styles.closeButton} aria-label="Close dialog" onClick={onClose}>
            &times;
          </button>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default CustomDialog;
