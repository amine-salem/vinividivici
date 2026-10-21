import Link from "next/link";
import Image from "next/image";
import { clients } from "@/lib/clients";
import { t, type Lang } from "@/lib/i18n";

export function Clients({ lang }: { lang: Lang }) {
  return (
    <section className="clients">
      <div className="clients-header">
        <span className="clients-label">{t(lang, "clientsLabel")}</span>
      </div>

      <ul className="clients-grid">
        {clients.map((client) => (
          <li key={client.slug}>
            <Link
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="client-card"
            >
              <span className="client-logo">
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={160}
                  height={160}
                  className="client-logo-img"
                />
              </span>
              <span className="client-name">{client.name}</span>
              <span className="client-category">
                {client.category[lang]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}