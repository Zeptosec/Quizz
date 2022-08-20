
const DisplayChoice = ({ task, answer, setAnswer }) => {
    const handleSelect = (choice) => {
        if (answer.includes(choice)) {
            setAnswer(answer.filter(w => w !== choice));
        } else {
            setAnswer([...answer, choice]);
        }
    }

    return (
        <>
            <h2>{task.question}</h2>
            <p>Answers:</p>
            <div className="choices">
                {task.choices.map((choice, i) =>
                    <button key={i} type="button" className={answer.includes(i) ? "closed" : "open"} onClick={() => handleSelect(i)}>
                        {choice}
                    </button>)}
            </div>
        </>
    )
}
export default DisplayChoice;