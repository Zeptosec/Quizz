import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const [visible, setVisible] = useState(true);

    const handleLogout = () => {
        logout();
    }

    window.addEventListener('resize', function() {
        if(this.window.innerWidth > 400){
            setVisible(true);
        } else {
            setVisible(false);
        }
    })

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>Quizz</h1>
                </Link>
                <nav>
                    {user && <div>
                        {visible ? <span>{user.email}</span> : ""}
                        {user.email === "virgil@gmail.com" ? <Link to="/admin">Admin</Link> : ""}
                        <button onClick={handleLogout}>Log out</button>
                    </div>}
                    <div>

                    </div>
                    {!user && <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </div>}
                </nav>
            </div>
        </header>
    )
}

export default Navbar;