import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../supabase/supabase"
import Logo from "./../assets/logo/logo-icone.png"
import GoogleIcon from "./../assets/loginCadastro/icones/googleIcon.jpg"
import "./../styles/cadastro.css"
/* auto explicativo tbm */
export default function Cadastro(){
    const [ userName, setUserName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ senha, setSenha ] = useState("")
    const [ marcado, setMarcado ] = useState(false)
    // estado para gurda suas devidas infos
    const irPara = useNavigate()

    async function cadastrar() {
        // aqui eu cadastro o usuario como uma foto padrão
        const res = await supabase.auth.signUp({
            email,
            password: senha,
            options:{
                data:{
                    full_name: userName,
                    avatar_url: import.meta.env.VITE_AVATAR_PADRAO
                }
            }
        })
        if(res.error){
            alert("algo deu errado, volte mais tarde")
        } else{
            // se der certo, o usuario tem que ir no email verificar sua conta
            alert("verifique seu email!")
        }
    }
    //função de cadastrar com o google (codigo do samuel/sudosam, grato)
    const handleOAuthLogin = async () => {
         // basicamente ele pega as chaves ja configurada no supabase, e usar dados vindo do google
        const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/home`,
            queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            },
        },
        });
        if (error) alert(error.message);
    };
    return(
        <div className="cadastro-tudo">
            <div className="logoName">
                <img src={Logo} alt="logoDrmConnect" />
                <h1>Cadastro</h1>
            </div>

            <div className="form-cadastro">
                <div className="informacoesCadastro">
                    <input type="text" placeholder="Nome de Usuario" onChange={e => setUserName(e.target.value)}/> <br />
                    <input type="text" placeholder="Email" onChange={e => setEmail(e.target.value)} /> <br />
                    <input type="text" placeholder="Senha" onChange={e => setSenha(e.target.value)}/> <br />
                </div>
                <div className="botoesCadastro">
                    <div className="check-box-termos">
                        <input type="checkbox" checked={marcado} onChange={(e) => setMarcado(e.target.checked)} />
                        <label>Li e aceito os <Link to="/termos">Termos De Uso</Link></label>
                    </div>
                    <button className="cadastroBTT" disabled={!marcado} onClick={() => cadastrar()}>Cadastrar</button>
                    <div className="loginLink">
                        <p>Já tem conta?</p> <br />
                        <button className="loginLinkBTT" onClick={() => irPara("/login")}>Logar</button>
                    </div>
                </div>
            </div>
            <div className="contaAlt">
                <p><span className="avisoGoogle">Não é possivel entrar/cadastrar (pelo google) com email instituicional</span></p>
                <button onClick={handleOAuthLogin}>
                    <img src={GoogleIcon} alt="icone do google" />
                </button>
            </div>
        </div>
    )
}