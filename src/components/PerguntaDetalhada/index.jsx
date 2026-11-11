import AcoesPost from "../AcoesPost"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function PerguntaDetalhada({ user, user_avatar, descricao, img, titulo, curtidas, idp, modalReport, fdp, create, idUser }){
    const irPara = useNavigate()
    const data = new Date(create)
    // foto e nome do autor levam para o perfil dele (so se tiver o id do autor)
    const clique = idUser ? { onClick: () => irPara(`/perfil/${idUser}`), style: { cursor: "pointer" } } : {}

    return(
        <div className="post-detalhado">
            {/* HEADER - User Info */}
            <div className="post-header">
                <img src={user_avatar} alt={user} className="avatar" {...clique} />
                <div className="user-info">
                    <span className="username" {...clique}>{user}</span>
                    <span className="time">{data.toLocaleDateString("pt-BR")} às {data.toLocaleTimeString("pt-BR")}</span>
                </div>
            </div>

            {/* TÍTULO (se houver) */}
            {titulo && (
                <h1 className="post-titulo">{titulo}</h1>
            )}

            {/* CONTEÚDO */}
            <div className="post-conteudo">
                <p className="post-descricao">{descricao}</p>
                
                {/* IMAGEM (se houver) */}
                {img && (
                    <img src={img} alt="Post" className="post-image" />
                )}
            </div>

            {/* AÇÕES */}
            <AcoesPost idP={idp} quantidadeDeCurtidas={curtidas} modalReport={modalReport} funcaoDeEnviarId={fdp}/>
        </div>
    )
}