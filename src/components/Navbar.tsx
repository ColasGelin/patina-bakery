import Link from 'next/link';

interface NavbarProps {
  show?: boolean;
}

export default function Navbar({ show = false }: NavbarProps) {
  return (
    <nav className={`navbar ${show ? 'show' : ''}`}>
      <Link href="/" className="navbar-brand">
        Patina
      </Link>
      
      <ul className="navbar-nav">
        <li>
          <Link href="/news">News</Link>
        </li>
        <li>
          <Link href="/shop">Shop</Link>
        </li>
        <li>
          <Link href="/team">Team</Link>
        </li>
      </ul>
    </nav>
  );
}