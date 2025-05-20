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
- 🔄 Histórico de conversa 
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

---

### 📄 Configurando Variáveis de Ambiente (`.env.local`)

A aplicação utiliza a **API do Groq** para alimentar o chatbot. Por questões de segurança, as credenciais e endpoints estão no `.env.local`, que fica **na raiz do projeto** e **não está versionado** (está no `.gitignore`).

#### ✅ Passos para configurar:


### 1. Clone o repositório
```bash
git clone https://github.com/fernanda-avila/botMindCare
```

### 2. Crie um arquivo `.env.local` na **raiz do projeto**:

   ```bash
   touch .env.local
``` 

### 3. Adicione a seguinte variável:
   ```bash
   GROQ_API_KEY= sua-chave-groq-aqui
   ```
   ✨ Substitua sua-chave-groq-aqui pela sua chave real da API Groq.
   
### 4. Salve o arquivo. Agora você pode rodar o frontend normalmente:

#### Web

### 1. Acesse a pasta principal
```bash
cd BestMindcare-Bot-Electron
```

### 2. Instale todas as dependências
```bash
npm install
```
### 3. Vá até a pasta onde está a aplicação React (frontend)
```bash
cd frontend/src/app
```

### 4. Rode a aplicação web 
```bash
npm run dev
```


#### Desktop


### Volte para a raiz do projeto, se ainda não estiver nela
```bash
cd ../../..
```

### Rode a versão Electron (aguarda o backend com wait-on)
```bash
npm run electron
```

## 🤖 Converse com o Best!

<div align="center" style="margin: 20px 0;">
  <img 
    src="https://github.com/user-attachments/assets/ae538173-39f2-4930-9a55-12f9dde08ad6" 
    alt="QR Code do BestMindCare Bot" 
    width="150"
    style="display: block; margin: 0 auto; border: 1px solid #e1e4e8; border-radius: 8px; padding: 5px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
  />
</div>

## 🔗 Link Direto
[https://bot-mind-care.vercel.app/](https://bot-mind-care.vercel.app/)


## 📌 Como usar
1. Acesse o link acima ou
2. Escaneie o QR Code com seu celular

## ℹ️ Sobre
<div align="center" style="margin-top: 20px;">
O BestMindCare Bot foi desenvolvido para oferecer suporte emocional e informações úteis de forma rápida e acessível.
</div>
