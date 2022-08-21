import { useEffect } from "react";
import { useState } from "react";
import { useLayout } from "../hooks/useLayout";

const Test = () => {
    const [answer, setAnswer] = useState("");
    const [task, setTask] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uid, setUid] = useState(null);
    const { getLayout } = useLayout(task, answer, setAnswer);

    useEffect(() => {
        const loadQuestion = async () => {
            setIsLoading(true);
            const tmpUser = JSON.parse(localStorage.getItem("tmpUser"));
            console.log(tmpUser)
            if (tmpUser) {
                setUid(tmpUser.uid);
            }

            const res = await fetch('http://localhost:4000/api/tasks/gettesttask', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: tmpUser.uid })
            });

            const json = await res.json();
            console.log(json);
            if (!res.ok) {
                setError(json.error);
            } else {
                if (!tmpUser) {
                    localStorage.setItem("tmpUser", JSON.stringify({ uid: json.uid }))
                }
                setError(null);
                setTask(json.task);
                setAnswer("");
            }
            setIsLoading(false);
        }

        loadQuestion();
    }, [])

    const isAnswerEmpty = () => {
        switch (task.type) {
            case "free":
                const tmpAns = answer.replace(/\s+/g, '');
                return tmpAns.length === 0;
            case "choice":
                return answer.length === 0;
            default:
                return true;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        console.log(uid);
        if (isAnswerEmpty()) {
            setError("No answer was specified.");
            setIsLoading(false);
            return;
        }
        if (!uid) {
            setError("User is missing");
            setIsLoading(false);
            return;
        }
        const res = await fetch('http://localhost:4000/api/tasks/posttestanswer', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer, uid, qid: task.qid })
        });
        const json = await res.json();
        if (res.ok) {
            if (json.finished) {
                setError("Finished test!");
            } else {
                setTask(json.task);
                setAnswer("");
            }
        } else {
            setError("Could not retrieve task");
        }
        const tmpUser = JSON.parse(localStorage.getItem("tmpUser"));
        // if magically user deleted deleted tmpUser on localStorage
        if (!tmpUser && uid) {
            // try and restore it if uid is still here
            localStorage.setItem("tmpUser", JSON.stringify({ uid }))
        }
        console.log(json);
        setIsLoading(false);
    }

    return (
        <div className="test">
            <form action="" className="question" onSubmit={handleSubmit}>
                {getLayout()}
                <button disabled={isLoading}>Next</button>
            </form>
            {error}
        </div>
    )
}

export default Test;