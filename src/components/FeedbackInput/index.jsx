import Estrelas from "./elements/Estrelas";
import Inputs from "./elements/Inputs";
import { useState } from "react";
import { supabase } from "../../supabase/supabase"
import { useNavigate } from "react-router-dom";
import "../../styles/feedbackCSS.css"
import { MessageCircleMore, Send, Shield } from 'lucide-react';
/* Componente de feedback */
export default function FeedbackInput(){
    const [ titulo, setTitulo ] = useState("")
    // assunto do feedback, aqui onde guardaa isso
    const [ descricao, setDescricao ] = useState("")
    // descrição do feedback
    const [ estrelas, setEstrelas ] = useState(0)
    // estado para amazenar as estrelas/avaliação
    const irPara = useNavigate()

    async function enviar(){
      if(!titulo.trim() && !descricao.trim()){
        alert("descreva seu feedback com titulo e descrição!")
        return
      }

        const res = await supabase
        .from("feedbacks")
        .insert({
            titulo,
            descricao,
            avaliacao: estrelas
        })

        if(res.error){
            alert("envio falhou, tente novamente mais tarde")
        } else{
            alert("feedback enviado! Muito obrigado pela a sua opinião!")
            setTitulo("")
            setDescricao("")
        }
    }
    return(
        <>
        <div className="telaFeedback">
            <div className="areaDoTexto">
                <div className="icon">
         <div style={{ position: "relative", width: 90, height: 90 }}>
      
      <svg width="0" height="0">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A3DC5" />
            <stop offset="100%" stopColor="#4A2571" />
          </linearGradient>
        </defs>
      </svg>

      <MessageCircleMore
        size={90}
        stroke="url(#grad)"
        fill="none"
      />

      <svg
        width="90"
        height="90"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        <circle cx="34" cy="45" r="3" fill="url(#grad)" />
        <circle cx="45" cy="45" r="3" fill="url(#grad)" />
        <circle cx="56" cy="45" r="3" fill="url(#grad)" />
      </svg>
    </div>
    </div>
        <div className="areaFeedback">
        <h1>Feedbacks</h1>
        <p>Sua opinião nos ajuda a evoluir</p>
        <p>Conte para a gente o que você achou da plataforma <br /> e como podemos melhorar sua experiência.</p>
        </div>
        </div>
        <div className="cardFeedback">
        <Inputs funcaoTitulo={setTitulo} estadoTitulo={titulo} funcaoDescricao={setDescricao} esatadoDescricao={descricao}/>
        <div className="experienciaUsuario">
            <Shield stroke="url(#grad)" fill="url(#grad)" size={60} />
        <h3>Seus feedbacks são importantes e nos ajudam <br /> a oferecer a melhor experiência para você e <br /> toda a comunidade.</h3>
        </div>
        <Estrelas funcao={setEstrelas}/>
        <div className="enviarFeedback">
              <button onClick={() => enviar()} style={{marginTop: "10px"}}><Send />Enviar Feedback</button>
            </div>
          </div>
        </div>
        </>
    )
}