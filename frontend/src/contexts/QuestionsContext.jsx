import { useReducer, createContext } from "react";

export const QuestionsContext = createContext();

export const questionReducer = (state, action) => {
    switch (action.type) {
        case 'SET_QUESTIONS':
            return {
                questions: action.payload
            }
        case 'CREATE_QUESTION':
            return {
                questions: [action.payload, ...state.questions]
            }
        case 'DELETE_QUESTION':
            return {
                questions: state.questions.filter(w => w._id !== action.payload._id)
            }
        default:
            return state;
    }
}

export const QuestionsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(questionReducer, {
        questions: null
    });

    return (
        <QuestionsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </QuestionsContext.Provider>
    )
}