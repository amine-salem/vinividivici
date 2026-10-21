import { type Lang } from "@/lib/i18n";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-contact">
        <p>contact@vinividivici.tn</p>
        <p>+216 XX XXX XXX</p>
      </div>

      <div className="footer-social">
        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
        <a href="https://wa.me/216XXXXXXXX" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      </div>

      <p className="footer-copyright">© 2026 VINIVIDIVICI</p>
    </footer>
  );
}