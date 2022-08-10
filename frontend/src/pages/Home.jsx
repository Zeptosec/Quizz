const { useEffect } = require("react");
const { useState } = require("react");


const Home = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [questionId, setQuestionId] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [right, setRight] = useState(null);

    const fetchNext = async () => {
        setIsLoading(true);
        setRight(null);
        const res = await fetch("http://localhost:4000/api/tasks/next");
        const json = await res.json();

        if (res.ok) {
            setQuestion(json.question);
            setQuestionId(json._id);
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
            body: JSON.stringify({ answer, id: questionId })
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
        <div className="home">
            <div className="task">
                <form onSubmit={handleSubmit}>
                    <h3>Question</h3>
                    <p>{question}</p>
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
    );
}

export default Home;