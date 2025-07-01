import { isEmailTaken, isCpfTaken } from './customerService';

interface FormData {
  name: string;
  username: string;
  email: string;
  cpf: string;
  password: string;
}

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
  'gozada', 'gozando', 'siririca', 'punheta', 'macaco', 'preto imundo',
  'índio preguiçoso', 'branquelo', 'judeu desgraçado', 'nazista',
  'racista', 'fascista', 'terrorista', 'hitler', 'binladen',
  'nazismo', 'genocida', 'assassino', 'estuprador', 'estupro',
  'pedófilo', 'pedofilia', 'me matar', 'quero morrer', 'suicídio',
  'vou me cortar', 'admin', 'root', 'moderador', 'suporte', 'senha',
  'hack', 'hacker', 'exploit', 'sqlinject', 'sql injection',
  'drop table', 'bypass', 'sudo', 'script', 'token', 'api_key',
  'pix premiado', 'ganhe dinheiro fácil', 'link suspeito',
  'acesse aqui', 'faça sua aposta', 'apostas online', 'cassino',
  'roleta', 'ganhar dinheiro', 'dinheiro fácil',
  'p0rra', 'v1ado', 'f0dase', 'f0da-se', 'f0da', 'f0der', 'caralh0',
  'f*dase', 'vai tnc', 'vai se f#der'
];

function validarFormatoNickname(nickname: string) {
  const regex = /^[a-zA-Z0-9_.\-]{4,20}$/;
  return regex.test(nickname);
}

function contemTermosProibidos(nickname: string) {
  const nicknameLower = nickname.toLowerCase();
  return palavrasProibidas.some(palavra => nicknameLower.includes(palavra));
}

function detectaEvasao(nickname: string) {
  const substituicoes = {
    'a': ['4', '@'],
    'e': ['3'],
    'i': ['1', '!'],
    'o': ['0'],
    's': ['5', '$']
  };

  const regexEvasao = /([a@4]+|[e3]+|[i1!]+|[o0]+|[s5$]+)/i;
  return regexEvasao.test(nickname);
}

function verificaContextoOfensivo(nickname: string) {
  const combinacoesOfensivas = [
    /(branco|preto|judeu).*(mata|odeia)/i,
    /(mulher|homem).+(inferior|burr)/i
  ];

  return combinacoesOfensivas.some(regex => regex.test(nickname));
}

function validarNickname(nickname: string): { valido: boolean, motivo?: string } {
  if (!validarFormatoNickname(nickname)) {
    return { valido: false, motivo: 'Formato inválido para username.' };
  }
  if (contemTermosProibidos(nickname)) {
    return { valido: false, motivo: 'Username contém termos proibidos.' };
  }
  if (detectaEvasao(nickname)) {
    return { valido: false, motivo: 'Tentativa de evasão de filtro detectada.' };
  }
  if (verificaContextoOfensivo(nickname)) {
    return { valido: false, motivo: 'Username com contexto ofensivo.' };
  }
  return { valido: true };
}

function validarSenha(password: string): string | null {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return regex.test(password) ? null : 'Senha fraca: deve ter ao menos 8 caracteres, incluindo maiúscula, número e caractere especial.';
}

export const validateCustomer = async (data: FormData & { password: string }): Promise<string[]> => {
  const errors: string[] = [];

  if (!data.name) errors.push('Nome é obrigatório.');
  if (!data.username) errors.push('Username é obrigatório.');
  if (!data.email) errors.push('Email é obrigatório.');
  if (!data.cpf) errors.push('CPF é obrigatório.');
  if (!data.password) errors.push('Senha é obrigatória.');

  if (data.email && !data.email.includes('@')) {
    errors.push('Email inválido: falta o caractere "@".');
  }

  const usernameValidation = validarNickname(data.username);
  if (!usernameValidation.valido && usernameValidation.motivo) {
    errors.push(usernameValidation.motivo);
  }

  const senhaValidation = validarSenha(data.password);
  if (senhaValidation) {
    errors.push(senhaValidation);
  }

  const [ emailExists, cpfExists] = await Promise.all([
    isEmailTaken(data.email),
    isCpfTaken(data.cpf)
  ]);
  if (emailExists) errors.push('Este email já está em uso.');
  if (cpfExists) errors.push('Este CPF já está em uso.');
  return errors;
};