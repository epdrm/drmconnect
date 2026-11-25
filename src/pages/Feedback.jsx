import FeedbackInput from "../components/FeedbackInput"
import Navbar from "../layout/Navbar"

/* PAGINA DE FEEDBACKS */
export default function Feedback(){
    // no componente tem a explicação
    return(
        <div className="container-feedback">
        <Navbar />
        <FeedbackInput />
        </div>
    )
}