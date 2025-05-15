import React, { useState } from 'react';
import axios from 'axios';
import styles from './AuthForm.module.css';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    birthDate: '',
    phone: '',
    isAdult: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:3000/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        console.log('Login bem-sucedido', response.data);
      } else {
        const response = await axios.post('http://localhost:3000/auth/register', formData);
        console.log('Cadastro bem-sucedido', response.data);
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      {!isLogin && (
        <>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nome:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Data de nascimento:</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Telefone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Maior de idade:</label>
            <input
              type="checkbox"
              name="isAdult"
              checked={formData.isAdult}
              onChange={handleCheckboxChange}
              className={styles.checkbox}
            />
          </div>
        </>
      )}
      <button type="submit" className={styles.button}>
        {isLogin ? 'Login' : 'Cadastrar'}
      </button>
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className={styles.toggleButton}
      >
        {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
      </button>
    </form>
  );
};

export default AuthForm;
