import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import TestResults from '../components/TestResults';


const Home = () => {
    
    return (
        <div className="home">
            <Link to="/quiz" className='start'>Practice</Link>
            <Link to="/test" className='start'>Test</Link>
            <Link to='/leaderboard' className='start'>Leaderboard</Link>
        </div>
    );
}

export default Home;