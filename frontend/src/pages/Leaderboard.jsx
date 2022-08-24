import { useEffect, useState } from "react";
import TestResults from '../components/TestResults';

const Leaderboard = () => {
    const [results, setResults] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('https://latinapi.herokuapp.com/api/leaderboard');
            const json = await res.json();

            setError("");
            if (res.ok) {
                let headers = ["#", ...json.headers];
                let data = json.data.map((w, i) => [i + 1, ...w]);
                setResults({ headers, data });
            } else {
                setError(json.error);
            }
        }
        setError("Loading...");
        fetchData();
    }, [])

    return (
        <div className="leaderboard">
            {results === null ? ""
                : <TestResults headers={results.headers} data={results.data} />
            }
            {error}
        </div>
    )
}

export default Leaderboard;