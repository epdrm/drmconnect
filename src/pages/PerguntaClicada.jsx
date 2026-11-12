import { useEffect, useState} from "react";
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

    async function carregarDados() {
        setErro(null)
        setNaoEncontrado(false)

        const resPergunta = await supabase
            .from("posts")
            .select('*')
            .eq('id', id)
            .single()

        const resRespostas = await supabase
            .from("post_respostas")
            .select('*')
            .eq("id_post", id)
            .order("create_at", {ascending: true})

        if(resPergunta.error){
            setCarregando(false)
            setErro(resPergunta.error.message)
            return console.error(resPergunta.error.message);
        }

        // Post não encontrado (resPergunta.data é null)
        if (!resPergunta.data) {
            setCarregando(false)
            setNaoEncontrado(true)
            return
        }

        if(resRespostas.error){
            setCarregando(false)
            setErro(resRespostas.error.message)
            return console.error(resRespostas.error.message);
        }

        setPergunta(resPergunta.data)
        setRespostas(resRespostas.data)
        setCarregando(false)
    }

    async function report() {
        if(motivoReport == ""){
            alert("digite o motivo!")
            return
        }
        const { data: { user }, error } = await supabase.auth.getUser()
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

    useEffect(() =>{
        carregarDados()
    }, [id])

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
                <h1>Descreva sua Denuncia</h1>
                <textarea className="input-motivo" onChange={(e) => setMotivoReport(e.target.value)}></textarea> <br />
                <button onClick={() => report()}>Enviar</button> <br />
                <button onClick={() => setModalReport(false)}>voltar</button> <br />
                </div>
            </div>
            )}
        </>
    )
}