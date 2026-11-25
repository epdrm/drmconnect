import "./respostasVisor.css"
import Avatar from "../../Avatar";

export default function RespostasVisor({ respostas }){
    return(
        <div className="container-respostas">
        {respostas.map((item) =>(
            <div key={item.id} className="resposta-item">
                <div className="user-info">
                    <Avatar src={item.user_avatar} alt={item.user_responde} size={50} className="avatar-xl" />
                    <p><span>{item.user_responde}</span></p>
                </div>
                <div className="resposta-conteudo">
                    <p><span>{item.description}</span></p>
                </div>
            </div>
        ))}
        </div>
    )
}