import { Link } from 'react-router-dom';


const Home = () => {

    return (
        <div className="home">
            <Link to="/quiz" className='start'>Practice</Link>
            <Link to="/test" className='start'>Test</Link>
        </div>
    );
}

export default Home;