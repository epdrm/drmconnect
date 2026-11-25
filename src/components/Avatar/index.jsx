import "./avatar.css";

export default function Avatar({ src, alt, size = 36, className = "" }) {
  const initial = alt?.charAt(0).toUpperCase() || "?";

  if (!src) {
    return (
      <div className={`avatar-vazio ${className}`} style={{ width: size, height: size, fontSize: size * 0.4 }}>
        {initial}
      </div>
    );
  }

  return <img src={src} alt={alt} className={`avatar-img ${className}`} style={{ width: size, height: size }} />;
}