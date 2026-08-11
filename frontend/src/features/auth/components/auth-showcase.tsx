import Image from "next/image";
import { LOGIN_ILLUSTRATION, LOGIN_SHOWCASE } from "@/config/branding";

export function AuthShowcase() {
  return (
    <section className="hidden items-center justify-center bg-surface-accent p-10 lg:flex">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="w-full overflow-hidden rounded-md border border-outline-variant/40 bg-surface-container-lowest shadow-overlay">
          <Image
            src={LOGIN_ILLUSTRATION.src}
            alt={LOGIN_ILLUSTRATION.alt}
            width={LOGIN_ILLUSTRATION.width}
            height={LOGIN_ILLUSTRATION.height}
            priority
            className="h-auto w-full"
          />
        </div>

        <h2 className="mt-8 text-h2">{LOGIN_SHOWCASE.title}</h2>
        <p className="mt-3 max-w-xs text-body-sm text-on-surface-muted">{LOGIN_SHOWCASE.description}</p>

        {/* Decorative: a single slide is shown until the remaining artwork exists. */}
        <div className="mt-8 flex items-center gap-2" aria-hidden>
          <span className="h-1.5 w-5 rounded-full bg-accent" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent-muted" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent-muted" />
        </div>
      </div>
    </section>
  );
}
