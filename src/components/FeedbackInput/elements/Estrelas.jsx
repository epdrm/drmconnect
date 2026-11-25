import { Angry, Frown, Meh, Smile, Laugh } from 'lucide-react';

export default function Estrelas({funcao}){

    function verificarCheckBox(estrelasMarcadas){
        funcao(estrelasMarcadas)
    }
    return(
        <>
        <div className="estrelas">
        <div style={{display: "flex", justifyContent: "center", margin: "10px 0"}}>
        <input type="radio" name="estrelas"  id="estrela1" onClick={() => {verificarCheckBox(1)}} className="estrela-checkbox"/>
        <label htmlFor="estrela1" className="estrela-label1"><Angry size={40}/></label>
        <input type="radio" name="estrelas"  id="estrela2" onClick={() => {verificarCheckBox(2)}} className="estrela-checkbox"/>
        <label htmlFor="estrela2" className="estrela-label2"><Frown size={40}/></label>   
        <input  type="radio" name="estrelas"  id="estrela3" onClick={() => {verificarCheckBox(3)}} className="estrela-checkbox"/>
        <label htmlFor="estrela3" className="estrela-label3"><Meh size={40}/></label>
        <input type="radio" name="estrelas"  id="estrela4" onClick={() => {verificarCheckBox(4)}} className="estrela-checkbox"/>
        <label htmlFor="estrela4" className="estrela-label4"><Smile size={40}/></label>
        <input type="radio" name="estrelas"  id="estrela5" onClick={() => {verificarCheckBox(5)}} className="estrela-checkbox"/>
        <label htmlFor="estrela5" className="estrela-label5"><Laugh size={40}/></label>
        </div>
        </div>
        </>
    )
}