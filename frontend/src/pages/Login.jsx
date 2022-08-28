import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(email, password);
    }

    return (
        <form className="login" onSubmit={handleSubmit}>
            <h3 className="center">Log in</h3>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label htmlFor="password">Password:</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <div className='center'>
                {isLoading ? <p>Waiting...</p> : <button>Log in</button>}
            </div>
            {error && <div className="error center">{error}</div>}
        </form>
    )
}

export default Login;