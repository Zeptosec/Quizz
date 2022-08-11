import { Link } from 'react-router-dom';


const Home = () => {

    return (
        <div className="home">
            <p>10 question test: </p>
            <Link to="/quiz">Start</Link>
        </div>
    );
}

export default Home;