import DisplayOpen from "../components/DisplayOpen";
import DisplayChoice from "../components/DisplayChoice";

export const useLayout = (task, answer, setAnswer) => {

    const getLayout = () => {
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

    return { getLayout }
}