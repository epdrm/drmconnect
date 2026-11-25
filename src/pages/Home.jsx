import { useEffect, useState, useRef, use } from "react";
import { supabase } from "../supabase/supabase";
import { envImagensStorage } from "../services/uploadImages";
import { useNavigate, Link } from "react-router-dom";
import iconImagem from "./../assets/iconImagem.png"
import "./../styles/home.css"
import { buscarImagem } from "../services/sercheAvatar";
import PostComunidade from "../components/PostComunidade";
import AcoesPost from "../components/AcoesPost";
import Sidebar from "../layout/Sidebar"
import Navbar from "../layout/Navbar";
import { ChevronLeft } from 'lucide-react';
import Noticias from "../layout/Noticias";
import useMediaQuery, { TELA_SEM_COLUNA_NOTICIAS } from "../components/hooks/useMediaQuery";
import Avatar from "../components/Avatar";

/* ESSA É A PAGINA DE COMUNIDADE */
export default function Home(){
  const [ posts, setPosts ] = useState([])
  // acima, o estado onde amazena os objetos do posts vindo do banca 
  const [ descricao, setDescricao ] = useState("")
  // acima, o estado, para a descricao do post
  const [ img, setImg ] = useState(null)
  // acima, caso o usuario queira imagem no post, fica nesse estado ai
  const [ fotoDoPerfil, setFotoDoPerfil ] = useState("")
  // acima, link da foto do perfil do usuario vindo do banco
  const textareaRef = useRef(null)
  // estado usado para se referir a textarea, para a função que ele fica maior quando existe bastante texto
  const [pagina, setPagina] = useState(0)
  const [carregamento, setCarregamento] = useState(false)
  const [temMais, setTemMais] = useState(true)
  const [idPostReport, setIdPostReport] = useState('')
  const [motivoReport, setMotivoReport] = useState('')
  const [modalReport, setModalReport] = useState(false)
  const [scrollBody, setScrollBody] = useState(false)
  const [enviando, setEnviando] = useState(false)
  /* acima, são os estados usado para a função de puxar 10 posts por vez,
  pagina = quando o sistema puxa os primeiros 10, ele vai esta em 0, mas quando ele subir 1, significa pro sistema que tem mais 10 sendo
  puxados
  carregamento = controle do carregamento da função de puxar posts
  temMais = se tiver mais post que ainda n foram vistos, ele fica true, se não, false
  */
  const irPara = useNavigate()
  const telaPequena = useMediaQuery(TELA_SEM_COLUNA_NOTICIAS)

   async function buscarPosts(estaPagina){
    setCarregamento(true)
    /* Quando ele receber a pagina atual (quantos post devem aparecer) ele faz a seguite conta,
    a pagina atual * 10, para saber onde o banco deve começar a puxa, e o começo + 10 - 1, onde resultará no numero onde ele deve puxar
    EX: 
    estaPagina = 0
    comeca: 0 * 10 = 0   ate: 0 + 10 - 9 = 9  --> ent ele deve puxar do index 0 ate o 9 (10 posts) 
    */
    const comeca = estaPagina * 10
    const ate = comeca + 10 - 1

    const res = await supabase
    .from("posts")
    .select('*')
    .order('create_at', {ascending: false}) // ordenar do mais recente para o mais antigo
    .range(comeca, ate) // range de post q ele deve puxar, usando as variveis que eu expliquei acima

    if(res.error){
      alert("olha o console")
      console.error(res.error)
    } else{
      // se no data tiver menos que 10 post, temMais se torna false, pois so tem 10 post
      if(res.data.length < 10){
        setTemMais(false)
      }
      // filtra posts, para evitar post repetitos
      setPosts((postAnteriores) => {
        // ele analise os post existente no estado, e ao puxar os novos, se vinher algum repetito (verificado atravez do id) ele tirar o obj
      const postFiltro = res.data.filter((novoPost) => {
        //Verifica se já está na lista de anteriores
        const jaExiste = postAnteriores.some((postAntigo) => postAntigo.id === novoPost.id)
        //Verifica se a chave existe no localStorage
        const estaBloqueado = localStorage.getItem(`block_${novoPost.id}`) !== null
        return !jaExiste && !estaBloqueado
      })
      return [...postAnteriores, ...postFiltro]
      })
    }
    setCarregamento(false)
  }

  async function desFazerLogin() {
    const res = supabase.auth.signOut()
  }
// função para criar post
  async function criarPost() {
    if(!descricao.trim()){
      alert("escreva algo")
      return
    }

    setEnviando(true)
    try{
      // chama função do /services, para joga a imagem que o usuario quer colocar, no bucket do supa
      let imgUrlLocal = await envImagensStorage("imagens-posts", img)

      // se tinha imagem e o upload falhou (retornou null), interrompe e avisa
      if (img && imgUrlLocal === null) {
        alert("Falha ao enviar a imagem. Tente novamente.")
        return
      }

      // faz verificação de sessao/usuario para consegui nome de usuario e foto do tal
      const { data: { user }, error } = await supabase.auth.getUser()
      if(!user || error){
        alert("usuário não logado!!")
        return
      }
      const usuarioNome = user.user_metadata?.full_name || user.user_metadata?.name ||  user.user_metadata?.display_name || "???"
      const avatar = user.user_metadata?.avatar_url || null
      const res = await supabase
      .from("posts")
      .insert({
        user: usuarioNome,
        description: descricao,
        imagens: imgUrlLocal,
        id_user: user.id,
        avatar
      })
      .select()
      // quando ele inserir o novo post, ele ja puxa para exibir na tela
      if(!res.error && res.data){
        setPosts((postAnteriores) => [res.data[0], ...postAnteriores])
        // limpa inputs
        setImg(null)
        setDescricao("")
      }


  }catch(error){
    console.error(error)
  } finally {
    setEnviando(false)
  }}
// função para ver mais posts (se o temMais == true)
  const verMais = () => {
    if(!carregamento && temMais){
      // ele apenas adiciona mais 1, para o sistema puxar mais 10
      setPagina((paginaAnterio) => paginaAnterio + 1)
    }
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

  useEffect(() => {
    buscarPosts(pagina)
    // pega a foto de usuario para exibir para o proprio user
    async function carregarUrlAvatar() {
      const url = await buscarImagem()
      if(url == null || !url ){
        setFotoDoPerfil(null)
      }else{
        setFotoDoPerfil(url)
      }
    }
    carregarUrlAvatar()
  }, [pagina]) // quando o estado pagina for atualizado, ele ja puxa mais 10 post
  // quando o estado descricao for sendo mudado, ele vai verificando se passa do limite de pixeis
  useEffect(() =>{
    const textarea = textareaRef.current
    if(textarea){
      // se passar, ele auto redimensionar
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [descricao])

  return(
    <div className='tudo-comunidade'>
      <Navbar />
      <div className="home-layout">
        <div className="posts">
          <div className="form-post">
            <div className="form-text">
              <Avatar src={fotoDoPerfil} alt="Você" size={40} className="avatar-lg" />
              <textarea maxLength={200} ref={textareaRef} value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="O que você está pensando hoje?" ></textarea>
            </div>

            <div className="form-envio">
              <input type="file" accept="image/png,image/jpeg" onChange={e => setImg(e.target.files[0])} id="input-file" style={{display: "none"}}/>
              <label htmlFor="input-file"><img src={iconImagem} alt="Icon de imagem" style={{width: "30px", height: "30px", cursor: "pointer"}}/></label>
              <button onClick={criarPost} disabled={enviando}>
                {enviando ? "Enviando..." : "postar"}
              </button>
            </div>

          </div>

          {posts.map((item) =>(
            <div key={item.id} className="perguntas-home">
              <div className="postContainer">
                <Link 
                to={`/feed/${item.id}`}
                key={item.id}>
                <PostComunidade user={item.user} titulo={item.titulo} conteudo={item.description} imgs={item.imagens} avatar={item.avatar} idUser={item.id_user}/> <br />
                </Link>
                <AcoesPost idP={item.id} quantidadeDeCurtidas={item.curtidas} modalReport={setModalReport} funcaoDeEnviarId={setIdPostReport}/>
              </div> 
            </div>
          ))}

          {carregamento && <p>Carregando posts...</p>}

          {modalReport && (
            <div className="modalReport">
              <div className="prinReport">
                <button id="reportbtn" onClick={() => setModalReport(false)}><ChevronLeft /></button> <br />
                <h1>Descreva sua Denuncia</h1>
                <textarea className="input-motivo" onChange={(e) => setMotivoReport(e.target.value)}></textarea> <br />
                <button onClick={() => report()}>Enviar</button>
              </div>
            </div>
          )}

          {temMais && !carregamento && (
            <button onClick={verMais} style={{ cursor: 'pointer' }}>
              Carregar mais
            </button>
          )}

          {!temMais && <p style={{ color: 'gray' }}></p>}
        </div>
        
        {!telaPequena && <Noticias />}
        
      </div>
    </div>
  )
}