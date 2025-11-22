// src/App.jsx
import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';

// Importe as Pages
import Home from './pages/Home';
// Você precisará criar estas páginas:
import DetalhesProduto from './pages/DetalhesProdutos';
import Carrinho from './pages/Carrinho';
import CadastroProduto from './pages/CadastroProduto';
import EditarProduto from './pages/EditarProduto';

// Componente de Layout Básico (Header e Footer)
const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Outlet /> {/* Aqui as rotas filhas serão renderizadas */}
    </main>
    <Footer />
  </div>
);

// Componente de Header com Tailwind
const Header = () => (
  <header className="bg-gray-800 shadow-lg sticky top-0 z-10">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-white hover:text-indigo-400 transition duration-300">
        Mini E-commerce 🛍️
      </Link>
      <nav className="space-x-4">
        <Link
          to="/"
          className="text-white hover:text-indigo-400 transition duration-300 font-medium"
        >
          Home
        </Link>
        <Link
          to="/carrinho"
          className="text-white hover:text-indigo-400 transition duration-300 font-medium"
        >
          Carrinho
        </Link>
        <Link
          to="/cadastro"
          className="text-white hover:text-indigo-400 transition duration-300 font-medium"
        >
          Cadastro
        </Link>
      </nav>
    </div>
  </header>
);

// Componente de Footer com Tailwind
const Footer = () => (
  <footer className="bg-gray-800 text-white mt-8 py-4">
    <div className="container mx-auto px-4 text-center text-sm">
      <p>&copy; {new Date().getFullYear()} ULBRA - Desenvolvimento de Aplicação Orientada a Componentes</p>
      <p>Projeto de Avaliação Prática AS por Jonas Santos</p>
    </div>
  </footer>
);


// Componente de Página 404
const Pagina404 = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 p-8">
    <h1 className="text-9xl font-extrabold text-indigo-600">404</h1>
    <p className="text-4xl font-semibold text-gray-800 mb-4">Página Não Encontrada</p>
    <p className="text-gray-600 mb-8">A rota que você tentou acessar não existe.</p>
    <Link
      to="/"
      className="py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
    >
      Voltar para Home
    </Link>
  </div>
);


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rotas Principais */}
        <Route index element={<Home />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/cadastro" element={<CadastroProduto />} />

        {/* Rotas com Parâmetro ID */}
        <Route path="/produto/:id" element={<DetalhesProduto />} />
        <Route path="/editar/:id" element={<EditarProduto />} />

        {/* Rota 404 (deve ser a última) */}
        <Route path="*" element={<Pagina404 />} />
      </Route>
    </Routes>
  );
}

export default App;