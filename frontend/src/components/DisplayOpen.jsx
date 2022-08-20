
const DisplayOpen = ({ task, answer, setAnswer }) => {

    return (
        <>
            <h2>{task.question}</h2>
            <label htmlFor="">Answer: </label>
            <input
                type="text"
                onChange={e => setAnswer(e.target.value)}
                value={answer}
            />
        </>
    )
}

export default DisplayOpen;