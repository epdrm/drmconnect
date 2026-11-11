import { supabase } from "../supabase/supabase"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/Login.css"
import Logo from "./../assets/logo/logo-icone.png"
import GoogleIcon from "./../assets/loginCadastro/icones/googleIcon.jpg"
/* auto explicativo */
export default function Login(){
    const [ email, setEmail ] = useState("")
    const [ senha, setSenha ] = useState("")
    //aqui ele vai guarda os estados, para enviar para auth dps
    const irPara = useNavigate()
    // função para logar
     async function logar() {
        const res = await supabase.auth.signInWithPassword({
            email,
            password: senha
        })
        if(res.error){
           alert("Você inseriu algo errado!") 
        } else{
            alert("login feito!")
            irPara("/Home")
        }
    }
    // função para entrar com o google (codigo dado pelo samuel/sudosam)
    const handleOAuthLogin = async () => {
        // basicamente ele pega as chaves ja configurada no supabase, e usar dados vindo do google para entrar no site
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
        if (error) toast.error(error.message);
    };
    // função para envio do email para reseta senha
    async function resetSenha() {
        if(email == " " || email == ""){
            alert("insira seu email!")
            return
        }
        // aq ele vai enviar pro servidor SMTP enviar um email pre-configurado, com link para alterar a senha
        const res = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/resetSenha`
        })
        if(res.error){
            alert("Algo deu errado, verifique se inseriu o email corretamente!")
        } else{
            alert("vá no email e mude sua senha")   
        }
    }

    return(
        <div className="login-tudo">
            <div className="logoName">
                <img src={Logo} alt="logoDrmConnect" />
                <h1>Login</h1>
            </div>
        
            <div className="form-login">
                <div className="informacoes">
                    <input type="text" onChange={e => setEmail(e.target.value)} placeholder="Insira seu email"/>
                    <div className="senhaArea">
                        <input type="password" onChange={e => setSenha(e.target.value)} placeholder="Insira sua senha"/> <br />
                        <button className="esqueciSenha" onClick={() => resetSenha()}>Esqueci minha senha</button>
                    </div>
                </div>
                <div className="botoes">
                    <button className="logarBTT" onClick={logar}>Logar</button>
                    <div className="cadastroLink">
                        <p>Não tem conta?</p>
                        <button className="cadastroLinkBTT" onClick={() => irPara("/cadastro")}>Cadastre-se</button> 
                    </div>
                </div>
            </div>
            <div className="contaAlt">
                <p><span className="avisoGoogle">Não é possivel entrar/cadastrar (pelo google) com email instituicional</span></p>
                <button onClick={handleOAuthLogin}><img src={GoogleIcon} alt="foto do google" /></button>
            </div>
        </div>
    )
}