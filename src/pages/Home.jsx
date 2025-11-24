import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProdutoCard from '../components/ProdutoCard';
import { useCarrinho } from '../context/CarrinhoContext';
import { useProdutos } from '../context/ProdutoContext';

const Home = () => {
    const { produtos, isLoading: loading, error } = useProdutos();
    const { adicionarAoCarrinho } = useCarrinho();
    const [msgEstoque, setMsgEstoque] = useState('');

    const handleAdicionarCarrinho = (produto) => {
        const sucesso = adicionarAoCarrinho(produto, 1);

        if (!sucesso) {
            setMsgEstoque(`Estoque máximo do(a) ${produto.nome} atingido!`);
            setTimeout(() => setMsgEstoque(''), 3000); 
        } else {
            setMsgEstoque(`"${produto.nome}" adicionado com sucesso!`);
            setTimeout(() => setMsgEstoque(''), 2000); 
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="ml-4 text-gray-700">Carregando produtos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 mx-auto mt-10 rounded max-w-lg">
                <p className="font-bold">Erro:</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Lista de Produtos 🛍️</h1>

            {msgEstoque && (
                <div className={`p-3 mb-4 rounded-lg text-center font-medium transition-opacity duration-500
                    ${msgEstoque.includes('atingido') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}
                `}>
                    {msgEstoque}
                </div>
            )}

            <div className="flex space-x-4 mb-8">
                <Link
                    to="/carrinho"
                    className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
                >
                    Ver Carrinho
                </Link>
                <Link
                    to="/cadastro"
                    className="py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                >
                    Cadastrar Produto
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {produtos.map((produto) => (
                    <ProdutoCard
                        key={produto.id}
                        produto={produto}
                        onAdicionarCarrinho={handleAdicionarCarrinho}
                    />
                ))}
            </div>

        </div>
    );
};

export default Home;