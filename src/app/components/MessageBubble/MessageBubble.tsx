import styles from '../../Chat/Chat.module.css';

interface MessageBubbleProps {
  message: string;
  sender: 'user' | 'bot';
  time: string;
  isTyping?: boolean;
}

export default function MessageBubble({ 
  message, 
  sender, 
  time, 
  isTyping = false 
}: MessageBubbleProps) {
  return (
    <div className={`${styles.messageBubble} ${sender === 'user' ? styles.userMessage : styles.botMessage}`}>
      <div className={styles.messageContent}>
        {isTyping ? (
          <div className={styles.typingIndicator}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <>
            <p>{message}</p>
            <span className={styles.messageTime}>{time}</span>
          </>
        )}
      </div>
    </div>
  );
}