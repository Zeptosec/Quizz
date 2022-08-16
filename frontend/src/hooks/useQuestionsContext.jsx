import { QuestionsContext } from "../contexts/QuestionsContext"
import { useContext } from "react";


export const useQuestionContext = () => {
    const context = useContext(QuestionsContext);

    if(!context){
        throw Error("useQuestionContext must be used within QuestionsContextProvider");
    }
    return context;
}