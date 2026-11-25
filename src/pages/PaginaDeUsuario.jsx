import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabase";
import { useNavigate, Link, useParams, replace } from "react-router-dom";
import { envImagensStorage } from "../services/uploadImages";
import { ImageUp, FileText, Heart, Trash2, ExternalLink, LogOut } from 'lucide-react';
import Navbar from "../layout/Navbar";
import { CornerDownLeft } from 'lucide-react';
import "../styles/perfil.css"
// variveis para ultilzar no codigo (textarea e select)
const LIMITE_SOBRE_MIM = 300
const SERIES = ["1º Ano", "2º Ano", "3º Ano"]

/* ESSA É A PAGINA DE PERFIL: o proprio usuario edita (/home/seuUser), outros usuarios so visualizam (/perfil/:id) */
export default function PaginaDeUsuario(){
    const irPara = useNavigate()
    const { id } = useParams()
    // acima, id do usuario da url (/perfil/:id), se n tiver id, é o perfil do proprio usuario
    const ehMeuPerfil = !id
    const [ carregando, setCarregando ] = useState(true)
    const [ naoEncontrado, setNaoEncontrado ] = useState(false)
    // acima, carregando = enquanto busca os dados, naoEncontrado = quando o id da url n existe
    const [ mudarNome, setMudarNome ] = useState(false)
    // acima, quando o usuario quiser mudar seu perfil, ele se torna true, se n, false
    const [ nome, setNome ] = useState("")
    const [ urlImg, setUrlImg ] = useState(null)
    // antes de mudar, o sistema mostra como são sua foto e nome, aq ele guada isso para mudar dps
    const [ img, setImg ] = useState(null)
    // quando enviar um nova imagem, ele vai guarda aqui
    const [ serie, setSerie ] = useState("")
    const [ sobreMim, setSobreMim ] = useState("")
    // acima, serie e sobre mim, ambos ficam no metadata do usuario (user_metadata)
    const [ posts, setPosts ] = useState([])
    // acima, os posts que o usuario ja fez (lista da aba atividade)
    const [ confirmandoId, setConfirmandoId ] = useState(null)
    // acima, id do post que esta pedindo confirmacao para excluir
    const [ saindoId, setSaindoId ] = useState(null)
    // acima, id do post que acabou de ser excluido (so para a animacao de sumir)
    const totalCurtidas = posts.reduce((soma, p) => soma + (p.curtidas || 0), 0)

    useEffect(() => {
        // aqui ele vai buscar o usuario que guadar suas infos para exibir
        async function buscarUser(){
            setCarregando(true)
            setNaoEncontrado(false)
            const { data: { user }, error } = await supabase.auth.getUser()
            if(error){
                alert("algo deu errado, tente novamente mais tarde!")
                setCarregando(false)
                return
            }
            // dono dos dados exibidos: o proprio usuario ou o usuario da url
            let idDoDono = user.id
            if(id){
                // se o id da url for o do proprio usuario, ele vai para a pagina onde pode editar
                if(id === user.id){
                    irPara("/home/seuUser", { replace: true })
                    return
                }
                idDoDono = id
                // o metadata de outro usuario n é acessivel, ent ele le da tabela profiles
                const { data: perfil, error: erroPerfil } = await supabase
                    .from("profiles")
                    .select("nome, avatar_url, serie, sobre_mim")
                    .eq("id", id)
                    .maybeSingle()
                if(erroPerfil){
                    console.error(erroPerfil)
                }
                if(erroPerfil || !perfil){
                    setNaoEncontrado(true)
                    setCarregando(false)
                    return
                }
                setNome(perfil.nome || "")
                setUrlImg(perfil.avatar_url)
                setSerie(perfil.serie || "")
                setSobreMim(perfil.sobre_mim || "")
            }else{
                const nomeDeUsuario = user.user_metadata?.full_name || ""
                setNome(nomeDeUsuario)
                const avatar = user.user_metadata?.avatar_url
                setUrlImg(avatar)
                setSerie(user.user_metadata?.serie || "")
                setSobreMim(user.user_metadata?.sobre_mim || "")
            }

            // busca os posts do dono do perfil, do mais recente para o mais antigo
            const { data: meusPosts, error: erroPosts } = await supabase
                .from("posts")
                .select("id, description, imagens, curtidas, create_at")
                .eq("id_user", idDoDono)
                .order("create_at", { ascending: false })
            if(erroPosts){
                console.error(erroPosts)
            }else{
                setPosts(meusPosts)
            }
            setCarregando(false)
        }
        buscarUser()
    }, [id])
    // função para mudar o nome de usuario
    async function editar() {
        const res = await supabase.auth.updateUser({
            data: { full_name: nome, serie: serie, sobre_mim: sobreMim }
        })
        if(res.error){
            alert("Não foi possivel realizar a mudança")
        }else{
            // quando mudar, ele retorna o user para a home
            if(img !== null){
                const imgUrl = await envImagensStorage("perfilFotoDefault", img)
                const res = await supabase.auth.updateUser({
                    data:{
                        avatar_url: imgUrl
                    }
                })
                alert("Edição Feito")
                setMudarNome(false)
                irPara("/home")
            } else{
                alert("nome alterado")
                setMudarNome(false)
                irPara("/home")
            }
        } 
    }
    // função para excluir um post do proprio usuario
    async function excluirPost(id) {
        // .select() devolve as linhas apagadas, se vier vazio o banco (RLS) n deixou apagar
        const { data, error } = await supabase.from("posts").delete().eq("id", id).select()
        if(error || !data || data.length === 0){
            alert("não foi possível excluir o post")
            return
        }
        setConfirmandoId(null)
        setSaindoId(id)
        // espera a animação de sumir antes de tirar da lista
        setTimeout(() => setPosts(anteriores => anteriores.filter(p => p.id !== id)), 300)
    }

    async function sair() {
        const { error } = await supabase.auth.signOut()
        if(error){
            alert("Algo deu errado, tente novamnete")
            return
        }
        irPara("/", {replace: true})
    }
    // enquanto busca os dados, mostra so a navbar (evita piscar textos de "vazio")
    if(carregando){
        return <div className="container-perfil"><Navbar /> <span style={{"display": "flex", "justifyContent":"center", "textAlign": "center"}}>carregando...</span></div>
    }
    // id da url n existe
    if(naoEncontrado){
        return(
            <div className="container-perfil">
                <Navbar />
                <div className="perfil-conteudo">
                    <section className="perfil-card ativ-vazia">
                        <h3>Perfil não encontrado</h3>
                        <p>Esse usuário não existe ou foi removido.</p>
                        <button onClick={() => irPara("/home")}>Voltar para o início</button>
                    </section>
                </div>
            </div>
        )
    }
    return(
        <div className="container-perfil">
            <Navbar />
            <div className="perfil-conteudo">
                <section className="perfil-card perfil-topo">
                    {urlImg
                        ? <img src={urlImg} id="imagem-do-perfil" alt="Foto de perfil" />
                        : <div id="imagem-do-perfil" className="avatar-vazio">{nome.charAt(0).toUpperCase()}</div>}
                    <div className="perfil-info">
                        <div className="perfil-nome">
                            <h3><span>{nome}</span></h3>
                            {serie && <span className="perfil-serie">{serie}</span>}
                        </div>
                        {ehMeuPerfil && (
                            <div className="perfil-botoes">
                                <button onClick={() => setMudarNome(true)} className="">Editar</button>
                                <button className="perfil-sair" onClick={sair}><LogOut size={14} /> Sair</button>
                            </div>
                        )}
                    </div>
                    <div className="perfil-stats">
                        <div className="perfil-posts">
                            <strong>{posts.length}</strong>
                            <span>{posts.length === 1 ? "POST" : "POSTS"}</span>
                        </div>
                        <div className="perfil-posts">
                            <strong>{totalCurtidas}</strong>
                            <span>CURTIDAS</span>
                        </div>
                    </div>
                </section>

                <div className="perfil-colunas">
                    <aside className="perfil-card perfil-sobre">
                        <h2><FileText size={18} /> Sobre mim</h2>
                        <p>{sobreMim || (ehMeuPerfil ? "Nada por aqui ainda. Clique em Editar para escrever algo sobre você." : "Esse usuário ainda não escreveu nada.")}</p>
                    </aside>

                    <section className="perfil-atividade">
                        <h2>Atividade <span className="contador-aba">{posts.length}</span></h2>
                        {posts.length === 0 && (
                            <div className="ativ-vazia">
                                <h3>{ehMeuPerfil ? "Você ainda não publicou nada" : "Esse usuário ainda não publicou nada"}</h3>
                                {ehMeuPerfil && <p>Os posts que você fizer aparecem aqui, e você pode excluir quando quiser.</p>}
                                {ehMeuPerfil && <button onClick={() => irPara("/home")}>Escrever um post</button>}
                            </div>
                        )}
                        {posts.map(item => (
                            <div key={item.id} className={`ativ-slot${saindoId === item.id ? " saindo" : ""}${confirmandoId === item.id ? " confirmando" : ""}`}>
                                <div className="ativ-dentro">
                                    <article className="ativ-post">
                                        <div className="ativ-corpo">
                                            <div>
                                                <span className="ativ-data">{new Date(item.create_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</span>
                                                <p>{item.description}</p>
                                            </div>
                                            {item.imagens && <img className="ativ-thumb" src={item.imagens} alt="" />}
                                        </div>
                                        <div className="ativ-rodape">
                                            <span className="ativ-meta"><Heart size={14} /> {item.curtidas || 0}</span>
                                            {confirmandoId === item.id ? (
                                                <div className="ativ-acoes">
                                                    <span>Excluir este post?</span>
                                                    <button className="ativ-btn" onClick={() => setConfirmandoId(null)}>Cancelar</button>
                                                    <button className="ativ-btn ativ-confirmar" onClick={() => excluirPost(item.id)}>Excluir</button>
                                                </div>
                                            ) : (
                                                <div className="ativ-acoes">
                                                    <Link className="ativ-btn" to={`/feed/${item.id}`}><ExternalLink size={14} /> Ver post</Link>
                                                    {ehMeuPerfil && <button className="ativ-btn ativ-excluir" onClick={() => setConfirmandoId(item.id)}><Trash2 size={14} /> Excluir</button>}
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>

            {mudarNome && (
                <div className="edicao-de-perfil">
                    <div className="prin">
                    <label htmlFor="imagem-envio" style={{cursor: "pointer"}}><ImageUp /><br />Escolher Foto De Perfil</label>
                    <input id="imagem-envio" type="file" accept="image/png,image/jpeg" onChange={e => setImg(e.target.files[0])} style={{display: "none"}}/> <br />
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)}/> <br />
                    <select value={serie} onChange={e => setSerie(e.target.value)}>
                        <option value="">Selecione sua série</option>
                        {SERIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select> <br />
                    <textarea
                        maxLength={LIMITE_SOBRE_MIM}
                        value={sobreMim}
                        onChange={e => setSobreMim(e.target.value)}
                        placeholder="Escreva um pouco sobre você"
                    ></textarea>
                    <span className="contador">{sobreMim.length}/{LIMITE_SOBRE_MIM}</span> <br />
                    <button onClick={() => editar()}>Alterar</button> <br/>
                    <button onClick={() => setMudarNome(false)} style={{margin: "10px"}}><CornerDownLeft /></button>
                    </div>
                </div>
            ) }
       </div>
    )
}