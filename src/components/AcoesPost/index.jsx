import { useState, useEffect } from "react"
import { supabase } from "../../supabase/supabase";
import { Heart, Flag } from 'lucide-react';
import "./style.css"

export default function AcoesPost({ idP, quantidadeDeCurtidas, modalReport, funcaoDeEnviarId}) {
    const [qntCurti, setQntCurti] = useState(quantidadeDeCurtidas)
    const [curtida, setCurtida] = useState(false)
    const [carregando, setCarregando] = useState(true)

    // Verifica se o usuário atual já curtiu este post
    useEffect(() => {
        async function verificarCurtida() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setCurtida(false)
                setCarregando(false)
                return
            }

            const { data, error } = await supabase
                .from('curtidas')
                .select('id')
                .eq('user_id', user.id)
                .eq('post_id', idP)
                .maybeSingle()

            if (!error && data) {
                setCurtida(true)
            }
            setCarregando(false)
        }

        verificarCurtida()
    }, [idP])

    // Sincroniza contagem vinda do props (quando o post é atualizado externamente)
    useEffect(() => {
        setQntCurti(quantidadeDeCurtidas)
    }, [quantidadeDeCurtidas])

    async function curtidas() {
        if (carregando) return

        const operacao = curtida ? 'decrementar' : 'incrementar'
        const qtdAnterior = qntCurti
        const curtidaAnterior = curtida

        // Optimistic update
        const novaQtd = curtida ? qntCurti - 1 : qntCurti + 1
        setQntCurti(novaQtd)
        setCurtida(!curtida)

        const { data, error } = await supabase.rpc('gerenciar_curtida', {
            operacao,
            p_id: idP
        })

        if (error) {
            // Rollback on error
            setQntCurti(qtdAnterior)
            setCurtida(curtidaAnterior)
            console.error('Erro ao curtir:', error.message)
            return
        }

        // Sincroniza com o valor real do banco
        setQntCurti(data ?? novaQtd)
    }

    return(
        <div className="acoes">
            <button
                onClick={() => curtidas()}
                className="btn-curtida"
                disabled={carregando}
            >
                    <Heart color={curtida ? "red" : "gray"} fill={curtida ? "red" : "none"} />
                    <span>{qntCurti}</span>
            </button>
            <button className="btn-report" onClick={() => (modalReport(true), funcaoDeEnviarId(idP))}>
                <Flag />
            </button>
        </div>
    )
}