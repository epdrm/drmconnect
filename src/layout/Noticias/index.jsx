import { useState, useEffect } from "react"
import { supabase } from "../../supabase/supabase"

import "./noticias.css"
export default function Noticias() {
    const [ noticas, setNoticias ] = useState([])

    async function puxarNoticias() {
        const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", {ascending: false})

        if(error){
            return console.error(error)
        }

        setNoticias(data)
    }

    useEffect(() => {
        puxarNoticias()
    }, [])

    return(
        <>
            <div className="feed-noticias">
                {noticas.length > 0 ? noticas.map((item, index) => (
                    <div className="item-noticia" id={index}>
                        <div className="item-cabeca-noticia">
                            <p><span>News</span></p>
                            <p><span id="data-noticia">{(new Date(item.created_at)).toLocaleDateString("pt-BR")} às {(new Date(item.created_at)).toLocaleTimeString("pt-BR")}</span></p>
                            <h1 className="titulo-noticia">{item.titulo}</h1>
                        </div>
                        <div className="item-corpo-noticia">
                            <p id="texto-noticia">{item.descricao}</p>
                        </div>
                    </div>
                )) : <span>sem noticas por hoje!</span>}
            </div>
        </>
    )
}