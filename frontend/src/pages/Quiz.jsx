import { useState, useEffect } from 'react';

const Quiz = () => {
    const [question, setQuestion] = useState({});
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [right, setRight] = useState(null);

    const fetchNext = async () => {
        setIsLoading(true);
        setRight(null);
        const res = await fetch("http://localhost:4000/api/tasks/next");
        const json = await res.json();

        if (res.ok) {
            setQuestion(json);
        } else {
            setError(json.error);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchNext();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await fetch("http://localhost:4000/api/tasks/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer, id: question._id })
        });

        const json = await res.json();
        if (!res.ok) {
            setError(json.error);
        } else {
            setRight(json.right);
            setError(null);
        }
        setIsLoading(false);
    }

    return (
        <div className="quiz">
            <div className="task">
                <form onSubmit={handleSubmit}>
                    <h2>Question { }</h2>
                    <p>{question.question}</p>
                    <label>Answer: </label>
                    <input
                        type="text"
                        onChange={e => setAnswer(e.target.value)}
                        value={answer}
                    />
                    <button disabled={isLoading}>Submit</button>
                </form>
                {error && <div className="error">{error}</div>}
                {right === true && <div className="correct">Correct!</div>}
                {right === false && <div className="wrong">Wrong!</div>}
                {right !== null && <button disabled={isLoading} onClick={fetchNext}>Next</button>}
            </div>
        </div>
    )
}

export default Quiz;