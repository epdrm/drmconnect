import instagram from "./../../assets/paginaInicial/socialMedias/Instagram_logo.png"
import tiktok from "./../../assets/paginaInicial/socialMedias/tiktok_logo.png"
import animeProfile from "./../../assets/paginaInicial/patrocinadores/animeprofile.png";
import logoEp from "./../../assets/paginaInicial/patrocinadores/logoEP.png";
import { useNavigate } from "react-router-dom";
import "./footer.css"

export default function Footer() {
    const irPara = useNavigate()
    return (
        <footer className="footer">
            <div className="redesSociais">
                <h3>DRM Connect</h3>

                <div className="social">
                    <a href="https://www.instagram.com/2anodesenv.sistemas/" target="_blank"><img src={instagram} alt="Instagram" /></a>
                    <a href="https://www.tiktok.com/@segundo.ds2025" target="_blank"><img src={tiktok} alt="TikTok" /></a>
                </div>
            </div>

            <div className="suporte">
                <h3>Suporte</h3>
                <a href="#">Política de Privacidade</a>
                <a onClick={() => irPara("/termos")}>Termos de Uso</a>
                <a href="#">Fale Conosco</a>
            </div>

            <div className="sobre-nos">
                <h3>Sobre nós</h3>
                <p>
                    Conectando aprendizado, inovação e evolução em uma única plataforma.
                </p>
            </div>
            <div className="patrocinadores">
                <h3>Patrocinadores</h3>
                <div className="patrocinadoresIcon">
                    <a  href="https://comunidade.animeprofile.com.br/" target="_blank"><img src={animeProfile} alt="anime Profile" /></a>
                    <a href="https://www.instagram.com/eeepdeputadorobertomesquita/" target="_blank"><img src={logoEp} alt="logoEp DRM" /></a>
                </div>
            </div>
        </footer>
    )
}