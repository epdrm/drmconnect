import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, MessageSquare, Newspaper } from "lucide-react";
import { buscarImagem } from "../../services/sercheAvatar";
import { supabase } from "../../supabase/supabase";
import logo from '../../assets/logo/logo-icone.png'
import "./navbar.css";
import Avatar from "../../components/Avatar";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function carregarAvatar() {
      const url = await buscarImagem();
      if (url) {
        setAvatarUrl(url);
      }
      // também pegar o nome do usuário
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.display_name || "Usuário");
      }
    }
    carregarAvatar();
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Logo */}
        <div className="navbar-logo">
            <img src={logo} alt="icone-logo" />
        </div>
      </div>

      {/* links nav */}
        <div className="navbar-links">
            <Link
            to="/home"
            className={`navbar-link ${isActive("/home") ? "active" : ""}`}
            >
            <Home size={18} />
            <span>Início</span>
            </Link>

            {/* so aparece em tablet e mobile (no desktop as noticias ficam na Home) */}
            <Link
            to="/noticias"
            className={`navbar-link navbar-link-noticias ${isActive("/noticias") ? "active" : ""}`}
            aria-label="Notícias"
            title="Notícias"
            >
            <Newspaper size={18} />
            <span>Notícias</span>
            </Link>

            <Link
            to="/feedback"
            className={`navbar-link ${isActive("/feedback") ? "active" : ""}`}
            >
            <MessageSquare size={18} />
            <span>Feedback</span>
            </Link>
        </div>

      {/* Avatar (clicável para perfil) */}
      <button
        className="navbar-avatar"
        onClick={() => navigate("/home/seuUser")}
        title="Ir para perfil"
      >
        <Avatar src={avatarUrl} alt={userName} size={36} className="avatar-md" />
      </button>
    </nav>
  );
}