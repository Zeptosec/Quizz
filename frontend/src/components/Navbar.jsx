import { Link } from "react-router-dom";

const Navbar = () => {

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>Quizz</h1>
                </Link>
                <nav>
                    <div>
                        <Link to="/admin">Admin</Link>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Navbar;