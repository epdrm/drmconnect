import { useState } from "react"
import { supabase } from "../supabase/supabase"
import { useNavigate } from "react-router-dom"
/* Pagina para resetar senha */
export default function ResetSenha(){
    const [ senha, setSenha ] = useState("")
    const irPara = useNavigate()
// função onde atualiza a senha do usuário atual
    async function mudarSenha() {
        if(senha == ""){
            alert("insira algo")
            return
        }
        const res = await supabase.auth.updateUser({
            password: senha
        })
        /* se não der erro, ele joga o user pra inicial, para fazer o login*/
        if(res.error){
            alert("Algo deu errado! tente novamente mais tarde")
        } else{
            alert("senha trocada, Você ja pode fazer login")
            irPara("/")
        }
    }
    return(
        <div>
            <h1>Redefina sua senha</h1> <br />
            <input type="password" onChange={e => setSenha(e.target.value)}/>
            <button onClick={() => mudarSenha()}>Confirmar</button>
        </div>
    )
}