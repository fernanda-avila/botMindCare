'use client';

import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import styles from './Chat.module.css';
import MessageBubble from '../components/MessageBubble/MessageBubble';
import EmergencyModal from '../components/EmergencyModal/EmergencyModal';
import { FiArrowLeft } from 'react-icons/fi';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const containsOffensiveLanguage = (text: string): boolean => {
  const offensiveWords = [
    'porra', 'caralho', 'merda', 'puta', 'vadia', 'viado', 'bicha', 'foda-se', 'cuzão',
    'buceta', 'pau no cu', 'filho da puta', 'arrombado', 'escroto', 'imbecil', 'idiota',
    'retardado', 'babaca', 'otário', 'palhaço', 'lixo humano',
    'preto noia', 'macaco', 'judeu safado', 'nazista', 'terrorista',
    'viadinho', 'sapatão', 'traveco', 'baitola', 'cu'
  ];

  const offensiveRegex = new RegExp(
    offensiveWords.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'i'
  );

  return offensiveRegex.test(text);
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchHistorico = async (user: string) => {
    try {
      const res = await fetch('/api/historico');
      if (!res.ok) throw new Error('Erro ao buscar histórico');
      const data: Array<{ id: number; usuario: string; texto: string; remetente: string; criadoEm: string }> = await res.json();

      const userMessages = data
        .filter(item => item.usuario === user)
        .sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime())
        .map(item => ({
          id: item.id.toString(),
          text: item.texto,
          sender: item.remetente === 'user' ? 'user' : 'bot' as 'user' | 'bot',
          timestamp: new Date(item.criadoEm),
        }));

      if (userMessages.length === 0) {
        setMessages([{
          id: '1',
          text: 'Olá! Eu sou o Best Virtual, seu assistente de saúde mental. Como você está se sentindo hoje? 😊',
          sender: 'bot',
          timestamp: new Date()
        }]);
      } else {
        const welcomeMessage: Message = {
          id: 'welcome',
          text: `Que bom te ver novamente! Como posso te ajudar hoje? 😊`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages([welcomeMessage, ...userMessages]);
      }
    } catch (error) {
      console.error(error);
      setMessages([{
        id: '1',
        text: 'Olá! Eu sou o Best Virtual, seu assistente de saúde mental. Como posso te ajudar hoje? 😊',
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('usuarioAtual');
    if (user) {
      setCurrentUser(user);
      fetchHistorico(user);
    }
  }, []);

  const salvarNoHistorico = async (mensagem: Message) => {
    if (!currentUser) return;
    try {
      await fetch('/api/historico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: currentUser,
          message: mensagem.text,
          sender: mensagem.sender,
          timestamp: mensagem.timestamp
        })
      });
    } catch (error) {
      console.error('Erro ao salvar no histórico:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isTyping) return;

    if (containsOffensiveLanguage(newMessage)) {
      const warningMessage: Message = {
        id: Date.now().toString(),
        text: 'Por favor, mantenha o respeito durante nossa conversa. Podemos continuar de forma positiva? 😊',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, warningMessage]);
      await salvarNoHistorico(warningMessage);
      setNewMessage('');
      return;
    }

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

    await salvarNoHistorico(userMessage);

    try {
      const systemMessage = {
        role: "system",
        content: `Você é um assistente de saúde mental chamado Best Virtual. Siga estas diretrizes:
1. Seja empático e acolhedor
2. Use o nome do usuário apenas quando for natural
3. Ressalte que você não substitui ajuda profissional
4. Em casos de crise, sugira contatar um colaborador do MindCare
5. Use linguagem simples e acessível
6. Responda em português brasileiro
7. Mantenha respostas entre 2-4 frases
8. Quando perguntado sobre histórico, mencione que tem acesso às conversas anteriores`
      };

      const messagesForAPI = updatedMessages
        .filter(msg => !(msg.id === '1' && msg.sender === 'bot'))
        .filter(msg => msg.id !== 'welcome')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [systemMessage, ...messagesForAPI],
          temperature: 0.7,
          max_tokens: 150,
          stream: false
        }),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (parseError) {
          console.error('Erro ao parsear resposta de erro:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      await salvarNoHistorico(botMessage);
    } catch (error: any) {
      console.error('Erro na API:', error);
      setApiError(error.message);

      const fallbackMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Houve um erro ao processar sua mensagem. Você pode reformular?',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
      await salvarNoHistorico(fallbackMessage);
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
          <img src="/chat.png" alt="Best Virtual" className={styles.avatar} />
          <div>
            <h1>Best Virtual</h1>
            <p>Assistente de Saúde Mental</p>
          </div>
        </div>

        <div className={styles.userControls}>
          {currentUser ? (
            <div className={styles.userInfo}>
              <span>Olá, {currentUser}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <button
  onClick={() => window.location.href = '/'}
  className={styles.backButton}
>
  <FiArrowLeft size={24} style={{ verticalAlign: 'middle', position: 'relative', top: '2px' }} />

</button>
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
