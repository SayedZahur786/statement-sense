import Link from "next/link";

export function Footer({ name, year }: { name: string; year: number }) {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-4 px-6 py-8 text-sm">
        <p>
          © {year} {name}
        </p>
        <nav aria-label="Legal">
          <ul className="flex gap-5">
            <li>
              <Link className="underline" href="/privacy">
                Privacy
              </Link>
            </li>
            <li>
              <Link className="underline" href="/terms">
                Terms
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
