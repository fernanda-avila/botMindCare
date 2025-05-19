# 🤖 MindCare Chatbot

> Chatbot de saúde mental acessível via navegador ou aplicativo desktop, oferecendo uma experiência acolhedora e responsiva para quem busca apoio emocional.

---

## 🧩 Visão Geral

O **MindCare Chatbot** é um assistente virtual que conversa com o usuário de forma empática e humanizada, com foco em **acolhimento psicológico e informações seguras**. Ele pode ser acessado via:

- 🌐 **Aplicação Web** (NextJS)
- 🖥️ **Aplicativo Desktop** (Electron)

Essa flexibilidade garante acessibilidade em diferentes dispositivos e contextos.

---

## 🚀 Funcionalidades

- 💬 Conversa contínua com respostas empáticas e não diagnósticas
- 🧠 Foco em saúde mental, com sugestões de práticas saudáveis
- 🔌 Rodando com mesma base de código no Web e Electron
- 🔄 Histórico de conversa (localStorage)
- 🆘 Resposta automática em caso de gatilhos emocionais
- 🔐 Funciona sem login – 100% anônimo
- 🌍 Multi-plataforma (funciona em Windows, Linux e macOS via Electron)

---

## ⚙️ Tecnologias Utilizadas

### Frontend
- **NextJS** 
- **CSS Modular**
- **React Router** (navegação)
- **Electron** (versão desktop)
- **wait-on** 


---

## 🖼️ Design

O chatbot segue uma proposta visual suave, amigável e acessível, com foco no conforto do usuário.  


## 🔧 Como Rodar

### Web
```bash
# 1. Clone o repositório
git clone https://github.com/fernanda-avila/botMindCare

# 2. Acesse a pasta principal
cd BestMindcare-Bot-Electron

# 3. Instale todas as dependências
npm install

# 4. Vá até a pasta onde está a aplicação React (frontend)
cd frontend/src/app

# 5. Rode a aplicação web 
npm run dev
```


### Desktop

```bash
# Volte para a raiz do projeto, se ainda não estiver nela
cd ../../..

# Rode a versão Electron (aguarda o backend com wait-on)
npm run electron
