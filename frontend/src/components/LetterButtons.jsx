
const LetterButtons = ({ answer, setAnswer, letters }) => {
    return (
        <div className="buttons">
            {letters.map(w => <button key={w} type='button' className="start" onClick={() => setAnswer(answer + w)}>{w}</button>)}
        </div>
    )
}

export default LetterButtons;