
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { api } from "../../services/api"
import { UserContext } from "../../context/user";

import styles from "./style.module.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();
    const { Login } = useContext(UserContext);

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const body = {
                email: email,
                password: password
            }
            
            const response = await api.post(`/login`, body,{
                withCredentials: true
            });
            
            console.log(response);

            Login(response.data.access_token);
            // setFirstAccess(response.data.firstAccess);
            
            toast.success('Login realizado com sucesso!')
            navigate("/molds");

        } catch (error) {  
            toast.error('Erro ao realizar o login!')
            console.error(error);
        }
    }

    return (
        <main>
            <div className={styles.loginContainer}>
                <h2>Bem-vindo de volta!</h2>

                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email"  onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="senha">Senha</label>
                    <input type="password" name="senha" onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button onClick={(e) => handleLogin(e)} type="submit">Entrar</button>
            </div>
        </main>
    )
}