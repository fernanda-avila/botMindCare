'use client';

import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import styles from './Chat.module.css';
import MessageBubble from '../components/MessageBubble/MessageBubble';
import EmergencyModal from '../components/EmergencyModal/EmergencyModal';
import Link from 'next/link';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = localStorage.getItem('usuarioAtual');
    setCurrentUser(user);
    
    // Mensagem inicial
    setMessages([{
      id: '1',
      text: user 
        ? `Olá, ${user}! Eu sou o Best Virtual, seu assistente de saúde mental. Como você está se sentindo hoje? 😊`
        : 'Olá! Eu sou o Best Virtual, seu assistente de saúde mental. Como posso te ajudar hoje? 😊',
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isTyping) return;

    if (/(suicídio|me matar|quero morrer|não aguento mais)/i.test(newMessage)) {
      setShowEmergencyModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMessage('');
    setIsTyping(true);
    setApiError(null);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: `Você é um assistente de saúde mental chamado Best Virtual. Siga estas diretrizes:
              1. Seja empático e acolhedor
              2. Ressalte que você não substitui ajuda profissional
              3. Em casos de crise, sugira contatar um colaborador do MindCare
              4. Use linguagem simples e acessível
              5. Responda em português brasileiro
              6. Mantenha respostas entre 2-4 frases`
            },
            ...updatedMessages
              .filter(msg => msg.id !== '1')
              .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
              }))
          ],
          temperature: 0.7,
          max_tokens: 150,
          stream: false
        }),
        signal: AbortSignal.timeout(10000) 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }]);
    } catch (error: any) {
      console.error('Erro na API:', error);
      setApiError(error.message);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Houve um erro ao processar sua mensagem. Você pode reformular?',
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioAtual');
    window.location.href = '/';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      <header className={styles.chatHeader}>
        <div className={styles.therapistInfo}>
          <img  
            src="/chat.png" 
            alt="Best Virtual" 
            className={styles.avatar}
          />
          <div>
            <h1>Best Virtual</h1>
            <p>Assistente de Saúde Mental</p>
          </div>
        </div>
        
        <div className={styles.userControls}>
          {currentUser && (
            <div className={styles.userInfo}>
              <span>Olá, {currentUser}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <FaSignOutAlt />
              </button>
            </div>
          )}
          <button 
            onClick={() => setShowEmergencyModal(true)} 
            className={styles.emergencyButton}
          >
            <FaHeart /> Ajuda Emergencial
          </button>
        </div>
      </header>

      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <MessageBubble 
            key={message.id}
            message={message.text}
            sender={message.sender}
            time={message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          />
        ))}
        
        {isTyping && (
          <MessageBubble 
            message="Estou pensando em como te ajudar..."
            sender="bot"
            time={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            isTyping
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className={styles.messageForm}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite como você está se sentindo..."
            className={styles.messageInput}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className={styles.sendButton}
            disabled={isTyping || !newMessage.trim()}
          >
            <FaPaperPlane />
          </button>
        </div>
        <div className={styles.quickSuggestions}>
          <span>Tente dizer:</span>
          <button type="button" onClick={() => setNewMessage("Estou me sentindo ansioso hoje")}>
            Estou ansioso
          </button>
          <button type="button" onClick={() => setNewMessage("Como lidar com o estresse?")}>
            Dicas para estresse
          </button>
        </div>
      </form>

      <EmergencyModal 
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </div>
  );
}