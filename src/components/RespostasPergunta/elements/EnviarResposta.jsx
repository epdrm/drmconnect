import { useState } from "react";
import { supabase } from "../../../supabase/supabase";

export default function EnviarResposta({ id, funcao }){
    const [ descricao, setDescricao ] = useState("")

    async function enviarResposta() {
        const { data: {user}, error } = await supabase.auth.getUser()
        if(error){
            alert("Usuario não identificado!")
            return
        }
        const usuarioNome = user.user_metadata?.full_name || user.user_metadata?.name ||  user.user_metadata?.display_name || "???"
        const avatar = user.user_metadata?.avatar_url || null 

        const res = await supabase
        .from("respostas")
        .insert({
            id_pergunta: id,
            user_nome: usuarioNome,
            user_avatar: avatar,
            descricao,
        })

        if(res.error) return console.error(res.error.message);

        setDescricao("")
        funcao()
    }

    return(
    <div className="enviar-resposta-tudo">
        <div className="escrever-resposta">
            <input type="text" value={descricao} placeholder="Digite um resposta" onChange={e => setDescricao(e.target.value)}/>
        </div>
        <div className="enviar-resposta">    
            <button onClick={() => enviarResposta()}>Enviar</button>
        </div>
    </div>
    )
}