import { useEffect } from "react";
import { useState } from "react";


const Task = () => {
    const [answer, setAnswer] = useState("");
    const [task, setTask] = useState({});
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    const handleCheck = async () => {
        setIsLoading(true);
        const res = await fetch("http://localhost:4000/api/tasks/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer, id: task._id })
        });

        const json = await res.json();
        if (!res.ok) {
            setMessage(json.error);
        } else {
            setIsCorrect(json.isCorrect);
            setMessage(json.isCorrect ? "Correct!" : "Wrong!");
        }
        setIsLoading(false);
    }

    const handleNext = async () => {
        setIsLoading(true);
        const res = await fetch("http://localhost:4000/api/tasks/next");
        const json = await res.json();

        if (!res.ok) {
            setMessage(json.error);
        } else {
            setAnswer("");
            setIsCorrect(null);
            setMessage("");
            setTask(json);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        handleNext();
    }, []);

    return (
        <div className="question">
            <h2>{task.question}</h2>
            <label htmlFor="">Answer: </label>
            <input
                type="text"
                onChange={e => setAnswer(e.target.value)}
                value={answer}
            />
            <button disabled={isLoading} onClick={handleCheck}>Check</button>
            {isCorrect != null && <button disabled={isLoading} onClick={handleNext}>Next</button>}
            <p>{message}</p>
        </div>
    )
}

export default Task;