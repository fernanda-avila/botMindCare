let usuarioAtual = localStorage.getItem('usuarioAtual');

// Função para limpar e habilitar campos do formulário
function limparFormularioLogin() {
  const form = document.getElementById('login-form');
  if (form) {
    form.reset();
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput) {
      usernameInput.value = '';
      usernameInput.disabled = false;
      usernameInput.readOnly = false;
    }
    
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.disabled = false;
      passwordInput.readOnly = false;
    }
  }
}

// Login
if (document.getElementById('login-form')) {
  // Remover reset automático para testar se é isso que está causando o bug
  // limparFormularioLogin();
  
  document.getElementById('username').disabled = false;
  document.getElementById('username').readOnly = false;
  document.getElementById('password').disabled = false;
  document.getElementById('password').readOnly = false;

  // Forçar habilitação dos campos após 1 segundo
  setTimeout(() => {
    document.getElementById('username').disabled = false;
    document.getElementById('username').readOnly = false;
    document.getElementById('password').disabled = false;
    document.getElementById('password').readOnly = false;
    console.log('Campos de login forçados a habilitar após 1s');
  }, 1000);

  document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('Iniciando busca de usuários...');
    const inicio = Date.now();
    const usuarios = await window.api.getUsuarios();
    const fim = Date.now();
    console.log('Tempo de resposta getUsuarios:', (fim - inicio), 'ms');
    if (usuarios[username] && usuarios[username].senha === password) {
      localStorage.setItem('usuarioAtual', username);
      window.location.href = 'preferencias.html';
    } else {
      alert('Usuário ou senha incorretos');
      // limparFormularioLogin();
    }
  });
}

// Formulário de Cadastro
if (document.getElementById('cadastro-form')) {
  document.getElementById('cadastro-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const usuarios = await window.api.getUsuarios();
    if (usuarios[username]) {
      alert('Usuário já existe!');
      return;
    }
    usuarios[username] = { senha: password, preferencias: [] };
    await window.api.setUsuarios(usuarios);
    alert('Cadastro realizado com sucesso!');
    // Limpar o localStorage antes de redirecionar
    localStorage.removeItem('usuarioAtual');
    window.location.href = 'index.html';
  });
}

// Comidas
if (document.getElementById('comida-form')) {
  document.getElementById('comida-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const outraComida = document.getElementById('outra-comida').value.trim();
    
    const preferencias = Array.from(checkboxes).map(cb => cb.value);
    
    if (outraComida) {
      preferencias.push(outraComida);
    }
    
    const usuarios = await window.api.getUsuarios();
    const user = localStorage.getItem('usuarioAtual');
    usuarios[user].preferencias = preferencias;
    await window.api.setUsuarios(usuarios);
    window.location.href = 'preferencias.html';
  });
}

async function getComidaInfo(comida) {
  try {
    console.log('Verificando API disponível...');
    if (!window.api || !window.api.getComidaInfo) {
      throw new Error('API não está disponível. Verifique se o preload está configurado corretamente.');
    }

    console.log('Consultando informações sobre:', comida);
    const info = await window.api.getComidaInfo(comida);
    console.log('Informações recebidas para:', comida);
    return info;
  } catch (error) {
    console.error('Erro ao buscar informações:', error);
    return `Não foi possível obter informações sobre ${comida} no momento. Erro: ${error.message}`;
  }
}

// Preferências
async function carregarPreferencias() {
  if (document.getElementById('preferencias-list')) {
    const user = localStorage.getItem('usuarioAtual');
    const usuarios = await window.api.getUsuarios();
    const prefs = usuarios[user]?.preferencias || [];
    
    console.log('Carregando preferências para usuário:', user);
    console.log('Preferências encontradas:', prefs);
    
    const preferenciasList = document.getElementById('preferencias-list');
    preferenciasList.innerHTML = `
      <p>Olá, <strong>${user}</strong>!</p>
      <div class="preferencias-container">
        ${prefs.map(p => `
          <div class="comida-card">
            <h3>${p}</h3>
            <div class="comida-info" id="info-${p.replace(/\s+/g, '-')}">
              <p>Carregando informações...</p>
            </div>
          </div>
        `).join('')}
      </div>
      <p><a href="comidas.html">Alterar preferências</a></p>
    `;

    console.log('Iniciando carregamento de informações...');
    for (const comida of prefs) {
      try {
        const infoElement = document.getElementById(`info-${comida.replace(/\s+/g, '-')}`);
        if (!infoElement) {
          console.error('Elemento não encontrado para:', comida);
          continue;
        }
        console.log('Buscando informações para:', comida);
        const info = await getComidaInfo(comida);
        infoElement.innerHTML = `<p>${info}</p>`;
      } catch (error) {
        console.error('Erro ao processar comida:', comida, error);
      }
    }
  }
}

if (document.getElementById('preferencias-list')) {
  carregarPreferencias();
}

function logout() {
  localStorage.removeItem('usuarioAtual');
  window.location.href = 'index.html';
}

