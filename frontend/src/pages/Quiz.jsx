import { useEffect } from "react";
import { useState } from "react";
import DisplayChoice from "../components/DisplayChoice";
import DisplayOpen from "../components/DisplayOpen";


const Quiz = () => {
    const [answer, setAnswer] = useState("");
    const [task, setTask] = useState({});
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [counter, setCounter] = useState({ right: 0, wrong: 0 });

    const handleCheck = async (e) => {
        e.preventDefault();
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
            if (isCorrect == null) {
                if (json.isCorrect) {
                    setCounter({ ...counter, right: counter.right + 1 });
                } else {
                    setCounter({ ...counter, wrong: counter.wrong + 1 });
                }
            }
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
        console.log("effect")
    }, []);

    const getLayout = () => {
        console.log(task)
        switch (task.type) {
            case "free":
                return <DisplayOpen
                    answer={answer}
                    setAnswer={setAnswer}
                    task={task}
                />
            case "choice":
                return <DisplayChoice
                    answer={answer}
                    setAnswer={setAnswer}
                    task={task}
                />
            default:
                return <DisplayOpen
                    answer={answer}
                    setAnswer={setAnswer}
                    task={task}
                />
        }
    }

    return (
        <div className="quiz">
            <form className="question" onSubmit={handleCheck}>
                {getLayout()}
                <button disabled={isLoading}>Check</button>
                {isCorrect != null && <button disabled={isLoading} onClick={handleNext}>Next</button>}
            </form>
            <div className="score">
                <span className="green">{counter.right}</span>/<span className="red">{counter.wrong}</span>
            </div>
            <p>{message}</p>
        </div>
    )
}

export default Quiz;