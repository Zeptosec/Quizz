import { useEffect } from "react";
import { useState } from "react";
import LetterButtons from "../components/LetterButtons";

import { useLayout } from "../hooks/useLayout";

const Quiz = () => {
    const [answer, setAnswer] = useState("");
    const [task, setTask] = useState({});
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [counter, setCounter] = useState({ right: 0, wrong: 0 });
    const { getLayout } = useLayout(task, answer, setAnswer);

    const handleCheck = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await fetch("https://latinapi.cyclic.app/api/tasks/check", {
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
        const res = await fetch("https://latinapi.cyclic.app/api/tasks/next");
        const json = await res.json();
        console.log(json)
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

    return (
        <div>
            {task.question ?
                <div className="quiz">
                    <div>
                        <form className="question" onSubmit={handleCheck}>
                            {getLayout()}
                            <button disabled={isLoading}>Check</button>
                            {isCorrect != null && <button disabled={isLoading} onClick={handleNext}>Next</button>}
                        </form>
                        <LetterButtons answer={answer} setAnswer={setAnswer} letters={['ā', 'ē', 'ë', 'ī', 'ō', 'ū']} />
                    </div>
                    <div className="score">
                        <span className="green">{counter.right}</span>/<span className="red">{counter.wrong}</span>
                    </div>
                    <p className="center">{message}</p>
                </div>
                :
                <>
                    <h2 className="center">Getting question...</h2>
                    <p className="center">{message}</p>
                </>}
        </div>
    )
}

export default Quiz;