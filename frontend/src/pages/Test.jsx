import { useEffect } from "react";
import { useState } from "react";
import TestResults from "../components/TestResults";
import { useLayout } from "../hooks/useLayout";

const Test = () => {
    const [answer, setAnswer] = useState("");
    const [task, setTask] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uid, setUid] = useState(null);
    const [tid, setTid] = useState(null);
    const [finished, setFinished] = useState(false);
    const [results, setResults] = useState(null);
    const { getLayout } = useLayout(task, answer, setAnswer);
    const [nickname, setNickName] = useState("");

    useEffect(() => {
        const loadQuestion = async () => {
            setIsLoading(true);
            const tmpUser = JSON.parse(localStorage.getItem("tmpUser"));
            console.log(tmpUser)
            if (tmpUser) {
                setUid(tmpUser.uid);
            }

            const res = await fetch('http://localhost:4000/api/test', {
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
                setTid(json.tid);
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

    const getResults = async (tid) => {
        if (!tid) {
            setError("No test id was given");
            return;
        }
        const res = await fetch('http://localhost:4000/api/test/results', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tid })
        })

        const json = await res.json();

        if (res.ok) {
            setResults(json.results);
        } else {
            setError(json.error);
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
        console.log(task);
        const res = await fetch('http://localhost:4000/api/test/answer', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer, tid, qid: task.qid })
        });
        const json = await res.json();
        if (res.ok) {
            if (json.finished) {
                setFinished(true);
                await getResults(json.tid);
            } else {
                setTask(json.task);
                setTid(json.tid);
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

    const handleNick = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (nickname.length > 16 || nickname.length < 3 || !/^[a-zA-Z]+$/.test(nickname)) {
            setError("Current nickname is invalid. Use only letters.");
            setIsLoading(false);
            return;
        }

        const res = await fetch('http://localhost:4000/api/test/submit', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tid, uid, nickname })
        });

        const json = await res.json();
        console.log(json);

        if (res.ok) {
            setError(json.message);
        } else {
            setError(json.error);
        }
        setIsLoading(false);
    }

    return (
        <div className="test">
            {results !== null ? "" :
                <form action="" className="question" onSubmit={handleSubmit}>
                    {getLayout()}
                    <button disabled={isLoading}>Next</button>
                </form>}
            {results !== null ?
                <>
                    <h2>Results:</h2>
                    <TestResults headers={results.headers} data={results.data} />
                    <form action="" className="signup" onSubmit={handleNick}>
                        <label><h3>Nickname:</h3></label>
                        <input
                            type="text"
                            onChange={e => setNickName(e.target.value)}
                            value={nickname}
                        />
                        <button disabled={isLoading}>Submit</button>
                    </form>
                </>
                : ""}
            {error}
        </div>
    )
}

export default Test;