import Descricao from "./elements/Descricao";
import Titulo from "./elements/Titulo";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";

export default function PostComunidade({ user, titulo, conteudo, imgs, avatar, idUser }){
    const irPara = useNavigate()

    // o post inteiro é um <Link> para /feed/:id, ent aqui ele impede de abrir o post e vai para o perfil do autor
    function abrirPerfil(e){
        e.preventDefault()
        e.stopPropagation()
        irPara(`/perfil/${idUser}`)
    }
    // so fica clicavel se o post tiver o id do autor
    const clique = idUser ? { onClick: abrirPerfil, style: { cursor: "pointer" } } : {}

    return(
        <div className="content-post">
            <div className="cabeca-post">
                <span {...clique}>
                    <Avatar src={avatar} alt={user} size={36} className="avatar-md" />
                    {user}
                </span> <br />
            </div>
            <div className="corpo-post">
                <Descricao conteudo={conteudo} />
                {imgs == null ? <span></span> : <Zoom ><img src={imgs} /></Zoom>}
            </div>
        </div>
    )
}