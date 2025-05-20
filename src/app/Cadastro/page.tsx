'use client';
import { useState } from 'react';


declare global {
  interface Window {
    api: {
      getUsuarios: () => Promise<Record<string, { senha: string }>>;
    };
  }
}
import { useRouter } from 'next/navigation';
import styles from '../Login/Login.module.css';

export default function CadastroPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        return;
    }

    try {
        const storedUsers = localStorage.getItem('usuarios');
        const users = storedUsers ? JSON.parse(storedUsers) : {};

        if (users[username]) {
            setError('Usuário já existe');
        } else {
            users[username] = { senha: password };
            localStorage.setItem('usuarios', JSON.stringify(users));
            localStorage.setItem('usuarioAtual', username);

            setSuccess('Cadastro realizado com sucesso!');
            setTimeout(() => router.push('/Chat'), 2000);
        }
    } catch (err) {
        setError('Erro ao salvar usuário');
        console.error('Cadastro error:', err);
    }
};


    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h1>Cadastro</h1>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">Usuário</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Senha</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirmar Senha</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className={styles.errorMessage}>{error}</div>}
                    {success && <div className={styles.successMessage}>{success}</div>}

                    <button type="submit" className={styles.loginButton}>
                        Cadastrar
                    </button>
                </form>

                <div className={styles.signupLink}>
                    Já tem uma conta? <a href="/Login">Faça login</a>
                </div>
            </div>
        </div>
    );
}