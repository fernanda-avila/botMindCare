'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from '../Login/Login.module.css';

const palavrasProibidas = [
  'bosta', 'merda', 'porra', 'caralho', 'cacete', 'puta', 'puto',
  'piranha', 'vagabunda', 'vagabundo', 'fdp', 'filho da puta',
  'desgraçado', 'desgraçada', 'corno', 'corninho', 'otário',
  'otária', 'escroto', 'escrota', 'arrombado', 'babaca', 'imbecil',
  'idiota', 'retardado', 'retardada', 'nojento', 'nojenta',
  'pau no cu', 'vai se fuder', 'vai tomar no cu', 'vai te fuder',
  'viado', 'veado', 'bichinha', 'boiola', 'bicha', 'frango',
  'sapatão', 'traveco', 'travecão', 'rola', 'perereca', 'xota',
  'buceta', 'cu', 'bundão', 'comer você', 'te comer', 'gozar',
  'gozada', 'gozando', 'siririca', 'punheta',
  'macaco', 'preto imundo', 'índio preguiçoso', 'branquelo',
  'judeu desgraçado', 'nazista', 'racista', 'fascista', 'terrorista',
  'hitler', 'binladen', 'nazismo', 'genocida', 'assassino',
  'estuprador', 'estupro', 'pedófilo', 'pedofilia',
  'me matar', 'quero morrer', 'suicídio', 'vou me cortar',
  'admin', 'root', 'moderador', 'suporte', 'senha', 'hack',
  'hacker', 'exploit', 'sqlinject', 'sql injection', 'drop table',
  'bypass', 'sudo', 'script', 'token', 'api_key',
  'pix premiado', 'ganhe dinheiro fácil', 'link suspeito',
  'acesse aqui', 'faça sua aposta', 'apostas online',
  'cassino', 'roleta', 'ganhar dinheiro', 'dinheiro fácil',
  'p0rra', 'v1ado', 'f0dase', 'f0da-se', 'f0da', 'f0der',
  'caralh0', 'f*dase', 'vai tnc', 'vai se f#der'
];

function validarFormatoNickname(nickname: string) {
  const regex = /^[a-zA-Z0-9_.-]{4,20}$/;
  return regex.test(nickname);
}

function contemTermosProibidos(nickname: string) {
  const nicknameLower = nickname.toLowerCase();
  return palavrasProibidas.some(palavra => 
    nicknameLower.includes(palavra.toLowerCase())
  );
}

function detectaEvasao(nickname: string) {
  const substituicoes = {
    'a': ['4', '@'],
    'e': ['3'],
    'i': ['1', '!'],
    'o': ['0'],
    's': ['5', '$']
  };

  const normalizado = nickname.toLowerCase();
  for (const [letra, substitutos] of Object.entries(substituicoes)) {
    for (const sub of substitutos) {
      if (normalizado.includes(sub)) return true;
    }
  }
  return false;
}

function verificaContextoOfensivo(nickname: string) {
  const combinacoesOfensivas = [
    /(branco|preto|judeu).*(mata|odeia)/i,
    /(mulher|homem).+(inferior|burr)/i
  ];
  return combinacoesOfensivas.some(regex => regex.test(nickname));
}

function validarSenhaComplexa(senha: string) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
  return regex.test(senha);
}

function validarCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  
  const digits = cpf.split('').map(x => parseInt(x));
  
  const rest = (count: number) => (digits.slice(0, count-12)
    .reduce((sum, el, index) => (sum + el * (count-index)), 0) * 10) % 11 % 10;
  
  return rest(10) === digits[9] && rest(11) === digits[10];
}

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [cpfError, setCpfError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checks = {
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      number: /\d/.test(formData.password),
      special: /[^a-zA-Z\d]/.test(formData.password)
    };
    setPasswordChecks(checks);
  }, [formData.password]);

  useEffect(() => {
    if (formData.username) {
      if (!validarFormatoNickname(formData.username)) {
        setUsernameError('O nome de usuário deve ter entre 4 e 20 caracteres e pode conter apenas letras, números, pontos, hífens e underscores.');
      } else if (contemTermosProibidos(formData.username) || detectaEvasao(formData.username) || verificaContextoOfensivo(formData.username)) {
        setUsernameError('Este nome de usuário contém termos proibidos ou ofensivos.');
      } else {
        setUsernameError('');
      }
    } else {
      setUsernameError('');
    }
  }, [formData.username]);

  useEffect(() => {
    if (formData.email && !formData.email.includes('@')) {
      setEmailError('Por favor, insira um endereço de email válido (deve conter @).');
    } else {
      setEmailError('');
    }
  }, [formData.email]);

  useEffect(() => {
    if (formData.cpf && formData.cpf.length >= 11) {
      if (!validarCPF(formData.cpf)) {
        setCpfError('CPF inválido. Por favor, verifique os dígitos.');
      } else {
        setCpfError('');
      }
    } else if (formData.cpf) {
      setCpfError('CPF deve ter 11 dígitos.');
    } else {
      setCpfError('');
    }
  }, [formData.cpf]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, username, email, cpf, password, confirmPassword } = formData;

    if (!name || !username || !email || !cpf || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    if (usernameError) {
      setError('Corrija os erros no nome de usuário antes de continuar.');
      return;
    }

    if (emailError) {
      setError('Corrija os erros no email antes de continuar.');
      return;
    }

    if (cpfError) {
      setError('Corrija os erros no CPF antes de continuar.');
      return;
    }

    if (!passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.number || !passwordChecks.special) {
      setError('A senha não atende a todos os requisitos de segurança.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const storedUsers = localStorage.getItem('usuarios');
      const users = storedUsers ? JSON.parse(storedUsers) : {};

      const usernameTaken = !!users[username];
      const emailTaken = Object.values(users).some((u: any) => u.email === email);
      const cpfTaken = Object.values(users).some((u: any) => u.cpf === cpf);

      if (usernameTaken || emailTaken || cpfTaken) {
        let messages = [];
        if (usernameTaken) messages.push('Nome de usuário já está em uso');
        if (emailTaken) messages.push('Email já cadastrado');
        if (cpfTaken) messages.push('CPF já cadastrado');
        setError(messages.join('. '));
        return;
      }

      users[username] = { 
        senha: password, 
        email, 
        cpf, 
        name,
        dataCadastro: new Date().toISOString()
      };
      localStorage.setItem('usuarios', JSON.stringify(users));
      localStorage.setItem('usuarioAtual', username);

      setSuccess('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => router.push('/Chat'), 2000);
    } catch (err) {
      setError('Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.');
      console.error('Cadastro error:', err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1>Crie sua conta</h1>
        <p className={styles.subtitle}>Preencha os campos abaixo para se cadastrar</p>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome completo</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Digite seu nome completo" 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username">Nome de usuário</label>
            <input 
              id="username" 
              name="username" 
              type="text" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Escolha um nome de usuário" 
              required 
            />
            {usernameError && <div className={styles.fieldError}>{usernameError}</div>}
            <div className={styles.hintText}>
              Deve conter 4-20 caracteres (letras, números, ., -, _)
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="seu@email.com" 
              required 
            />
            {emailError && <div className={styles.fieldError}>{emailError}</div>}
            <div className={styles.hintText}>
              Digite um endereço de email válido
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cpf">CPF</label>
            <input 
              id="cpf" 
              name="cpf" 
              type="text" 
              value={formData.cpf} 
              onChange={handleChange} 
              placeholder="000.000.000-00" 
              required 
              maxLength={14}
            />
            {cpfError && <div className={styles.fieldError}>{cpfError}</div>}
            <div className={styles.hintText}>
              Digite apenas números (11 dígitos)
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <div className={styles.passwordInputContainer}>
              <input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Crie uma senha segura" 
                required 
              />
              <button 
                type="button" 
                className={styles.showPasswordButton}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className={styles.passwordHints}>
              <div className={passwordChecks.length ? styles.validHint : styles.invalidHint}>
                Mínimo 8 caracteres
              </div>
              <div className={passwordChecks.uppercase ? styles.validHint : styles.invalidHint}>
                Pelo menos 1 letra maiúscula
              </div>
              <div className={passwordChecks.number ? styles.validHint : styles.invalidHint}>
                Pelo menos 1 número
              </div>
              <div className={passwordChecks.special ? styles.validHint : styles.invalidHint}>
                Pelo menos 1 caractere especial
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <div className={styles.passwordInputContainer}>
              <input 
                id="confirmPassword" 
                name="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"} 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="Digite a senha novamente" 
                required 
              />
              <button 
                type="button" 
                className={styles.showPasswordButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className={styles.hintText}>
              As senhas devem coincidir
            </div>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <button type="submit" className={styles.loginButton}>Cadastrar</button>
        </form>

        <div className={styles.signupLink}>
          Já tem uma conta? <a href="/Login">Faça login aqui</a>
        </div>
      </div>
    </div>
  );
}