import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await signup(email, password);
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3 className="center">Sign up</h3>
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
                <button disabled={isLoading}>Sign up</button>
            </div>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Signup;