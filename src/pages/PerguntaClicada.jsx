import { useEffect, useState, useCallback} from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/supabase";
import NavBar from "./../layout/Navbar"
import PerguntaDetalhada from "../components/PerguntaDetalhada";
import RespostasPergunta from "../components/RespostasPergunta";
import "../styles/perguntaClicada.css"

export default function PerguntaClicada(){
    const { id } = useParams()
    const [pergunta, setPergunta] = useState({})
    const [respostas, setRespostas] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [idPostReport, setIdPostReport] = useState('')
    const [motivoReport, setMotivoReport] = useState('')
    const [modalReport, setModalReport] = useState(false)
    const [erro, setErro] = useState(null)
    const [naoEncontrado, setNaoEncontrado] = useState(false)

    //busca todos os dados dos supabase
    const buscarDados = useCallback(async () => {
        const [resPergunta, resRespostas] = await Promise.all([
            supabase
                .from("posts")
                .select("*")
                .eq("id", id)
                .maybeSingle(),

            supabase
                .from("post_respostas")
                .select("*")
                .eq("id_post", id)
                .order("create_at", { ascending: true })
        ])

        return { resPergunta, resRespostas }
    }, [id])

    //atualiza todos os estados de modo centralizado
    const aplicarDados = useCallback(({ resPergunta, resRespostas }) => {

        if (resPergunta.error) {
            setErro(resPergunta.error.message)
            setCarregando(false)
            return
        }

        if (!resPergunta.data) {
            setNaoEncontrado(true)
            setCarregando(false)
            return
        }

        if (resRespostas.error) {
            setErro(resRespostas.error.message)
            setCarregando(false)
            return
        }

        setPergunta(resPergunta.data)
        setRespostas(resRespostas.data)

        setErro(null)
        setNaoEncontrado(false)
        setCarregando(false)

    }, [])

    //carregar todos dados para mostrar na tela
    const carregarDados = useCallback(async () => {
        setCarregando(true)
        setErro(null)
        setNaoEncontrado(false)

        try {
            const dados = await buscarDados()
            aplicarDados(dados)

        } catch (error) {
            setErro(error.message || "Erro ao carregar dados")
            setCarregando(false)
        }

    }, [buscarDados, aplicarDados])

    async function report() {
        if(motivoReport == ""){
            alert("digite o motivo!")
            return
        }
        const { data: { user }, error } = await supabase.auth.getUser()
        if(error){
            alert("usuario não identificado")
            return
        }
        const res = await supabase
            .from("reports")
            .insert({
            id_post_report: idPostReport,
            id_user: user.id,
            motivo: motivoReport
        })
        if(res.error){
            alert("algo deu errado " + res.error.message)
        } else{
            alert("obrigado por sua contribuição!")
            setIdPostReport("")
            setModalReport(false)
            setMotivoReport("")
            localStorage.setItem(`block_${idPostReport}`, idPostReport)
            window.location.reload()
        }
    }

    useEffect(() =>{
        if (modalReport) {
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = `${scrollBarWidth}px`
        }
        return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        }
    }, [modalReport])

    useEffect(() => {
        let ativo = true

        buscarDados()
            .then((dados) => {
                if (ativo) {
                    aplicarDados(dados);
                }
            })
            .catch((error) => {
                if (!ativo) return;

                setErro(error.message || "Erro ao carregar dados")
                setCarregando(false);
            })

        return () => {
            ativo = false
        }

    }, [buscarDados, aplicarDados])

    return(
        <>
            <NavBar />
            <div className="feed-detalhado">
                <div className="feed-container">
                    {/* POST PRINCIPAL */}
                    <div className="post-principal">
                        {carregando ? (
                            <p>Carregando...</p>
                        ) : erro ? (
                            <div className="erro-container">
                                <p>Erro ao carregar o post</p>
                                <a href="/home">← Voltar para o feed</a>
                            </div>
                        ) : naoEncontrado ? (
                            <div className="erro-container">
                                <p>Post não encontrado</p>
                                <a href="/home">← Voltar para o feed</a>
                            </div>
                        ) : (
                            <PerguntaDetalhada
                                user={pergunta.user}
                                user_avatar={pergunta.avatar}
                                descricao={pergunta.description}
                                img={pergunta.imagens}
                                titulo={pergunta.titulo}
                                curtidas={pergunta.curtidas}
                                idp={pergunta.id}
                                modalReport={setModalReport}
                                fdp={setIdPostReport}
                                create={pergunta.create_at}
                                idUser={pergunta.id_user}
                            />
                        )}
                    </div>

                    {/* RESPOSTAS */}
                    {!carregando && !erro && !naoEncontrado && (
                        <div className="secao-respostas">
                            <RespostasPergunta
                                respostas={respostas}
                                funcaoDeAtualizar={carregarDados}
                                id={id}
                            />
                        </div>
                    )}
                </div>
            </div>

            {modalReport && (
            <div className="modalReport">
                <div className="prinReport">
                <h1>Descreva sua Denúncia</h1>
                <textarea className="input-motivo" onChange={(e) => setMotivoReport(e.target.value)}></textarea> <br />
                <button onClick={() => report()}>Enviar</button> <br />
                <button onClick={() => setModalReport(false)}>voltar</button> <br />
                </div>
            </div>
            )}
        </>
    )
}