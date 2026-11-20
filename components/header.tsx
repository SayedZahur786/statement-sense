import Link from "next/link";

export function Header({
  name,
  links = [],
}: {
  name: string;
  links?: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:bg-white focus:p-4 focus:text-black"
      >
        Skip to content
      </a>
      <header className="border-b border-slate-200">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5"
        >
          <Link className="text-lg font-bold focus-visible:outline-2" href="/">
            {name}
          </Link>
          <ul className="flex flex-wrap gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  className="underline-offset-4 hover:underline focus-visible:outline-2"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
