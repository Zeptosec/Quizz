import { useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext";
import { useQuestionContext } from "../hooks/useQuestionsContext";


const OpenQuestionForm = () => {
    const { dispatch } = useQuestionContext();
    const [question, setQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [inputList, setInputList] = useState([{ answer: "" }]);
    const [message, setMessage] = useState("");
    const { user } = useAuthContext();

    const handleInputChange = (e, index) => {
        const list = [...inputList];
        list[index].answer = e.target.value;
        setInputList(list);
    }

    const handleRemoveClick = () => {
        if (inputList.length === 1) return;
        const list = [...inputList];
        list.splice(inputList.length - 1, 1);
        setInputList(list);
    }

    const handleAddClick = () => {
        setInputList([...inputList, { answer: "" }]);
    }

    const handleSubmit = async function (e) {
        e.preventDefault();

        if(!user){
            setMessage("First log in!");
            return;
        }

        setIsLoading(true);
        let answers = [];
        inputList.map(x => answers.push(x.answer));

        const res = await fetch("https://latinapi.cyclic.app/api/admin", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                question,
                answers,
                points: 1,
                difficulty: 1,
                type: "free"
            })
        });

        const json = await res.json();
        if (!json.error) {
            setInputList([{ answer: "" }]);
            setQuestion("");
            setMessage("Added successfully");
            setTimeout(() => {
                setMessage("");
                setIsLoading(false);
            }, 3000);
            dispatch({ type: 'CREATE_QUESTION', payload: json.task })
        } else {
            setMessage(json.error);
            setIsLoading(false);

        }
    }

    return (
        <form onSubmit={handleSubmit} className="create">
            <label htmlFor="">Question</label>
            <input
                type="text"
                onChange={e => setQuestion(e.target.value)}
                value={question} />
            <label htmlFor="">Answers:</label>
            {inputList.map((x, i) => (
                <div key={i}>
                    <input
                        className="fld"
                        type="text"
                        onChange={e => handleInputChange(e, i)}
                        value={x.answer} />
                </div>
            ))}
            <div className="center">
                <button type="button" onClick={handleAddClick}>More</button>
                <button type="button" onClick={handleRemoveClick}>Less</button>
                <button disabled={isLoading}>Submit</button>
            </div>
            {message}
        </form>
    )
}

export default OpenQuestionForm;