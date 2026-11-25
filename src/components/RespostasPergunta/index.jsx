import { useState, useRef, useEffect } from "react";
import { supabase } from "../../supabase/supabase";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";

export default function RespostasPergunta({ respostas, funcaoDeAtualizar, id }){
    const irPara = useNavigate()
    const [novaResposta, setNovaResposta] = useState("")
    const [enviando, setEnviando] = useState(false)
    const textareaRef = useRef(null)

    // foto e nome de quem respondeu levam para o perfil (respostas antigas n tem id_user, ent n ficam clicaveis)
    const clique = (idUser) => idUser ? { onClick: () => irPara(`/perfil/${idUser}`), style: { cursor: "pointer" } } : {}

    async function enviarResposta() {
        if(!novaResposta.trim()) {
            alert("Digite uma resposta")
            return
        }

        setEnviando(true)
        
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            
            if(!user || userError) {
                alert("Usuário não logado!")
                setEnviando(false)
                return
            }

            const usuarioNome = user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.display_name || "Anônimo"
            const avatar = user.user_metadata?.avatar_url || null

            const res = await supabase
                .from("post_respostas")
                .insert({
                    id_post: id,
                    user_responde: usuarioNome,
                    description: novaResposta,
                    user_avatar: avatar,
                    id_user: user.id
                })
                .select()

            if(!res.error && res.data) {
                setNovaResposta("")
                funcaoDeAtualizar()
            } else {
                alert("Erro ao enviar resposta: " + res.error?.message)
            }
        } catch(error) {
            console.error(error)
            alert("Erro ao enviar resposta")
        }

        setEnviando(false)
    }

    useEffect(() =>{
        const textarea = textareaRef.current
    if(textarea){
        // se passar, ele auto redimensionar
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }
    }, [novaResposta])

    return(
        <div className="respostas-tudo">
            {/* INPUT PARA NOVA RESPOSTA */}
            <div className="respostas-enviar">
                <div className="enviar-resposta-form">
                    <textarea 
                        placeholder="Digite uma resposta..."
                        value={novaResposta}
                        onChange={(e) => setNovaResposta(e.target.value)}
                        disabled={enviando}
                        ref={textareaRef}
                    />
                    <button 
                        className="enviar-resposta-btn"
                        onClick={enviarResposta}
                        disabled={enviando}
                    >
                        {enviando ? "Enviando..." : "Responder"}
                    </button>
                </div>
            </div>

            {/* LISTA DE RESPOSTAS */}
            <div className="ver-respostas">
                {respostas.length === 0 ? (
                    <p style={{ color: "#999", fontSize: "14px" }}>Nenhuma resposta ainda. Seja o primeiro a responder!</p>
                ) : (
                    respostas.map((resposta) => {
                        const dataResposta = new Date(resposta.create_at)
                        return (
                            <div key={resposta.id} className="resposta-card">
                                <div className="resposta-header">
                                    <Avatar
                                        src={resposta.user_avatar}
                                        alt={resposta.user_responde}
                                        size={36}
                                        className="resposta-avatar"
                                        {...clique(resposta.id_user)}
                                    />
                                    <div className="resposta-user-info">
                                        <span className="resposta-username" {...clique(resposta.id_user)}>{resposta.user_responde}</span>
                                        <span className="resposta-time">{dataResposta.toLocaleDateString("pt-BR")} às {dataResposta.toLocaleTimeString("pt-BR")}</span>
                                    </div>
                                </div>
                                <p className="resposta-texto">{resposta.description}</p>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}