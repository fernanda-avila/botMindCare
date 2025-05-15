'use client';
import { FaPhone, FaTimes } from 'react-icons/fa';
import styles from '../../Chat/Chat.module.css';

export default function EmergencyModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.emergencyModal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className={styles.emergencyTitle}>Precisa de ajuda imediata?</h3>
        <p className={styles.emergencyText}>Por favor, entre em contato com os serviços de emergência:</p>
        
        <div className={styles.emergencyContacts}>
          <a href="tel:188" className={styles.emergencyLink}>
            <span className={styles.emergencyIcon}><FaPhone /></span> Centro de Valorização da Vida (CVV) - 188
          </a>
          <a href="tel:192" className={styles.emergencyLink}>
            <span className={styles.emergencyIcon}><FaPhone /></span> SAMU - 192
          </a>
        </div>
        
        <p className={styles.emergencyDisclaimer}>
          Lembre-se: você é importante e há pessoas que podem ajudar.
        </p>
      </div>
    </div>
  );
}