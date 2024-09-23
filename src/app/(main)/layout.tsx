import Link from "next/link";
import type {ReactNode} from "react";

let now = new Date().getFullYear();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <header>
        <div className="mx-auto flex h-20 max-w-screen-xl justify-between">
          <Link href="/">
            <strong>learning is fun</strong>
          </Link>
          <nav>
            <ul className="flex gap-2">
              <li>
                <Link href="/">Blog</Link>
              </li>
              <li>
                <Link href="/">Docs</Link>
              </li>
              <li>
                <Link href="/">Log in</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex min-h-[calc(100dvh-10rem)]">
        <aside className="basis-52 border border-red-400">
          {/* search */}
          {/* Dashboard */}
          {/* Settings */}
          {/* Profile */}
          {/* {Descs} */}
          {/* Logout */}

          <div>
            <p>Decks</p>
            <ul className="pl-1">
              {/* Render decks here */}
              <button>New deck</button>
            </ul>
          </div>
        </aside>
        <div className="flex-1 border border-blue-700 px-5">
          {children}
        </div>
      </main>
      <footer>
        <div className="mx-auto flex h-20 max-w-screen-xl justify-between">
          <small>@ {now} Learning is fun</small>
        </div>
      </footer>
    </>
  );
}
