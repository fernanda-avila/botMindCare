'use client';

import { useEffect, useState } from 'react';
import { FaHeart, FaUser, FaCommentAlt } from 'react-icons/fa';
import styles from './Chat/Chat.module.css';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('usuarioAtual');
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleStartChat = () => {
    router.push('/Chat');
  };

  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeBubble}>
          <p>Bem-vindo ao <strong>Best Virtual</strong></p>
          <p>Seu assistente de saúde mental digital</p>
          <div className={styles.disclaimer}>
            <FaHeart /> <small>Você pode conversar agora ou fazer login para salvar seu histórico</small>
          </div>
        </div>

        <div className={styles.character}>
          <div className={styles.characterImage}>
            <img 
              src="/chat.png" 
              alt="Best Virtual" 
              className={styles.avatar}
            />
          </div>
        </div>
        
        <div className={styles.authOptions}>
          <button 
            className={styles.startChatButton}
            onClick={handleStartChat}
          >
            <FaCommentAlt /> Conversar sem login
          </button>

          {currentUser ? (
            <button 
              className={styles.continueButton}
              onClick={handleStartChat}
            >
              <FaUser /> Continuar como {currentUser}
            </button>
          ) : (
            <a href="/Login" className={styles.loginButton}>
              <FaUser /> Fazer Login
            </a>
          )}
        </div>
      </div>
    </div>
  );
}