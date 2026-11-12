import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabase/supabase";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import PrivateRoute from "./components/hooks/PrivateRouter";
import Home from "./pages/Home";
import PaginaDeUsuario from "./pages/PaginaDeUsuario";
import FeedBack from "./pages/FeedBack";
import ResetSenha from "./pages/ResetSenha";
import PerguntaClicada from "./pages/PerguntaClicada";
import Inicial from "./pages/Inicial";
import TermosDeUso from "./pages/TermosDeUso";
import PaginaNoticias from "./pages/PaginaNoticias";

export default function App(){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Adicionado para controlar o carregamento inicial

  useEffect(() => {
    async function carregarSessao() {
      // tenta buscar um sessão ja exixtente
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // se sim, ele guarda o Usuario e vai para verificação de token
          setUser(session.user)
        }
      } catch (error) {
        console.error("Erro ao carregar sessão:", error)
      } finally {
        setLoading(false) 
      }
    }
    
    carregarSessao()
    //aqui ele vai escuta as mudanças de sessões e de tokens
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        //se tem uma sessão
        setUser(session.user)
        // ele limpa os tokens do Google da URL sem recarregar a página
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
        //e guadar o token novo para enviar
      } else {
        setUser(null)
      }
      setLoading(false) // garante que o loading pare quando o Google responder
    });

    return () => subscription.unsubscribe()
    // aqui ele reenviar o token, independente de se é do google ou do proprio banco
  }, [])

  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Autenticando sessão...</p>
          </div>
        ): user ? (<Navigate to={'/home'} replace />) : (<Inicial />)} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/resetSenha" element={<ResetSenha />} />
        <Route path="/termos" element={<TermosDeUso />}/>
        <Route 
          path="/home" 
          element={
            // Passamos o loading para o PrivateRoute não barrar o usuário antes da hora
            <PrivateRoute user={user} loading={loading}>
              <Home />
            </PrivateRoute>
          } 
        />
        <Route path="/home/seuUser" element={
          <PrivateRoute user={user} loading={loading}>
            <PaginaDeUsuario />
          </PrivateRoute>
        }/>
        <Route path="/feedback" element={
          <PrivateRoute user={user} loading={loading}>
            <FeedBack />
          </PrivateRoute>
        }/>     
        <Route path="/feed/:id" element={
          <PrivateRoute user={user} loading={loading}>
            <PerguntaClicada />
          </PrivateRoute>
        }/>
        <Route path="/perfil/:id" element={
          <PrivateRoute user={user} loading={loading}>
            <PaginaDeUsuario />
          </PrivateRoute>
        }/>
        <Route path="/noticias" element={
          <PrivateRoute user={user} loading={loading}>
            <PaginaNoticias />
          </PrivateRoute>
        }/>
      </Routes>
    </BrowserRouter>
  )
}
