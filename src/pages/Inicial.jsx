import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import logoIcone from "./../assets/logo/logo-icone.png"
import imagemIcone from "./../assets/paginaInicial/iconeBackground.png"
import SectionPerguntar from "../components/SectionPerguntar";
import SectionAprender from "../components/SectionAprender";
import SectionResponder from "../components/SectionResponder";
import "./../styles/inicial.css"
import "./../styles/secoes.css"
import "./../styles/mockup.css"
import "./../styles/animacao-texto.css"
/* LOGO JA IMPORTADA */
export default function  Inicial(){
    /* pagina de explicação do projeto, onde mostra pequena historia, e praq server */
    const irPara = useNavigate()

        const scrollParaSection = (sectionId) => {
        const selectors = {
            inicio: '.hero-novo',
            perguntar: '.section-perguntar',
            responder: '.section-responder',
            aprender: '.section-aprender',
        };
        
        const element = document.querySelector(selectors[sectionId]);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };


    return(
        <div className="inicial-tudo">
            <nav className="navbar">
                <div className="cabeca-inicial">
                    <div className="nome-logo">
                        <img src={logoIcone} alt="logo-drm-connect" className="logoIcone"/>
                        <div className="navbar-links">
                            <button className="nav-link" onClick={() => scrollParaSection('inicio')}>
                                Início
                            </button>
                            <button className="nav-link" onClick={() => scrollParaSection('perguntar')}>
                                Pergunta
                            </button>
                            <button className="nav-link" onClick={() => scrollParaSection('responder')}>
                                Responder
                            </button>
                            <button className="nav-link" onClick={() => scrollParaSection('aprender')}>
                                Aprender
                            </button>
                        </div>

                    </div>
                </div>
                <div className="botoes-login">
                    <button className="login" onClick={() => irPara("/login")}><span>Logar</span></button>
                    <button className="cadastro" onClick={() => irPara("/cadastro")}><span>Cadastrar</span></button>
                </div>
            </nav>
            <header className="hero-novo">
                <div className="apresentacao">
                    <div className="titulos">
                        <h1>DRM <span>Connect</span></h1>
                    </div>
                    <div className="textos">
                        <h2>O conhecimento da DRM se conecta aqui.</h2>
                        <h3>
                            Uma plataforma de perguntas e respostas feita por e para alunos da<br/>
                            EEEP Deputado Roberto Mesquita. Tire dúvidas sobre as disciplinas, relatórios<br/>
                            de estágio e projetos técnicos.
                        </h3>
                    </div>
                    <button className="comecar" onClick={() => irPara("/login")}>Começar Agora</button>
                </div>
                <div className="imagembackground">
                    <img  src={imagemIcone}/>
                </div>
            </header>
            <div className="subHeader">
                <marquee direction="left" behavior="alternate" scrollamount="5">
                    <h2>
                        Aprendizado  Inovação  Capacidade  Evolução
                        Aprendizado  Inovação  Capacidade  Evolução
                        Aprendizado  Inovação  Capacidade  Evolução
                        Aprendizado  Inovação  Capacidade  Evolução
                        Aprendizado  Inovação  Capacidade  Evolução
                    </h2>
                </marquee>
                <marquee direction="right" behavior="alternate" scrollamount="5">
                    <h2>
                        Desenvolvimento Tecnologia Educação Ensino
                        Desenvolvimento Tecnologia Educação Ensino
                        Desenvolvimento Tecnologia Educação Ensino
                        Desenvolvimento Tecnologia Educação Ensino
                        Desenvolvimento Tecnologia Educação Ensino
                    </h2>
                </marquee>
                <marquee direction="left" behavior="alternate" scrollamount="5">
                    <h2>
                        Criatividade Potencial Conectar Capacitar
                        Criatividade Potencial Conectar Capacitar
                        Criatividade Potencial Conectar Capacitar
                        Criatividade Potencial Conectar Capacitar
                        Criatividade Potencial Conectar Capacitar
                    </h2>
                </marquee>        
            </div>
            <SectionPerguntar />
            <SectionResponder />
            <SectionAprender />
            <Footer/>
        </div>
    )
}