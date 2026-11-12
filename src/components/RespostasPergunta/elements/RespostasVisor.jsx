import "./respostasVisor.css"

export default function RespostasVisor({ respostas }){
    return(
        <div className="container-respostas">
        {respostas.map((item) =>(
            <div key={item.id} className="resposta-item">
                <div className="user-info">
                    <img src={item.user_avatar} />
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