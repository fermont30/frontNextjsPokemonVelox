'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full backdrop-blur-sm bg-black/30 border-b border-white/10">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between py-3 md:py-0 md:h-20">       
            <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
              <Link 
                href="/" 
                className="flex items-center space-x-3"
                onClick={handleLogoClick}
              >
                <img 
                  className="w-12 h-12 md:w-16 md:h-16 transition-all duration-300 hover:scale-110"
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" 
                  alt="Pikachu logo" 
                />
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                  <p className="text-xl md:text-2xl font-bold tracking-wider">Pokédex</p>
                  <p className="text-xs md:text-sm font-medium">Fernando</p>
                </div>
              </Link>            
              <button 
                className="md:hidden text-yellow-300 focus:outline-none"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            
            <nav className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8 w-full md:w-auto mt-2 md:mt-0">
              <Link 
                href="/404" 
                className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-yellow-300 transition-colors duration-300"
              >
                Explorar
              </Link>
              <Link 
                href="/404" 
                className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-yellow-300 transition-colors duration-300"
              >
                Tipos
              </Link>
              <Link 
                href="/404" 
                className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-yellow-300 transition-colors duration-300"
              >
                Generaciones
              </Link>
            </nav>
            <div className="hidden md:flex items-center space-x-4 w-full md:w-auto mt-3 md:mt-0">
              <Link 
                href="/404" 
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-yellow-300 hover:text-white border border-yellow-300/50 hover:bg-yellow-300/10 rounded-full transition-all duration-300"
              >
                ❤️ Favoritos
              </Link>
              <Link 
                href="/formpokemon" 
                className="inline-flex items-center px-5 py-2.5 text-sm font-bold text-black bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-200 hover:to-yellow-300 rounded-full shadow-lg shadow-yellow-400/20 transition-all duration-300"
              >
                + Nuevo Pokémon
              </Link>
            </div>
          </div>     
          <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="bg-black/80 p-4 border-t border-white/10 flex flex-col space-y-3">
              <Link 
                href="/404" 
                className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-yellow-300"
                onClick={toggleMenu}
              >
                Explorar
              </Link>
              <Link 
                href="/404" 
                className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-yellow-300"
                onClick={toggleMenu}
              >
                Tipos
              </Link>
              <Link 
                href="/404" 
                className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-yellow-300"
                onClick={toggleMenu}
              >
                Generaciones
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                <Link 
                  href="/404" 
                  className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-yellow-300 hover:text-white border border-yellow-300/50 hover:bg-yellow-300/10 rounded-full transition-all duration-300"
                  onClick={toggleMenu}
                >
                  ❤️ Favoritos
                </Link>
                <Link 
                  href="/formpokemon" 
                  className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-bold text-black bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-200 hover:to-yellow-300 rounded-full shadow-lg shadow-yellow-400/20 transition-all duration-300"
                  onClick={toggleMenu}
                >
                  + Nuevo Pokémon
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};