import React from 'react';
import { Link } from 'react-router-dom';     
import { useCarrinho } from '../context/CarrinhoContext';

const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
};

const ProdutoCard = ({ produto, onAdicionarCarrinho }) => {
    const { carrinho } = useCarrinho();
    
    const itemNoCarrinho = carrinho.find(item => item.id === produto.id);
    const quantidadeNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
    
    const esgotado = produto.estoque <= 0;

    const estoqueMaximoAtingido = quantidadeNoCarrinho >= produto.estoque;

    const desativarBotao = esgotado || estoqueMaximoAtingido;

    return (
        <div className={`
            bg-white shadow-lg rounded-xl overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-[1.03]
            ${desativarBotao ? 'opacity-70' : 'hover:shadow-xl'} flex flex-col
        `}>
            <img 
                className="w-full h-48 object-cover object-center" 
                src={produto.urlImagem || 'https://via.placeholder.com/400x300'} 
                alt={produto.nome} 
            />
            
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-1 truncate">
                    {produto.nome}
                </h3>
                <p className="text-2xl font-bold text-indigo-600 mb-3">
                    {formatarPreco(produto.preco)}
                </p>

                <div className="mt-auto mb-3">
                    {esgotado ? (
                        <span className="text-sm font-bold text-red-600 bg-red-100 p-1 rounded">Esgotado</span>
                    ) : estoqueMaximoAtingido ? (
                        <span className="text-sm font-bold text-orange-600 bg-orange-100 p-1 rounded">Estoque Máximo Atingido!</span>
                    ) : (
                        <span className="text-sm text-gray-500">Em estoque: {produto.estoque}</span>
                    )}
                </div>

                <div className="flex space-x-3 mt-2">
                    <Link 
                        to={`/produto/${produto.id}`} 
                        className="flex-1 text-center py-2 px-4 border border-indigo-600 text-indigo-600 rounded-lg font-medium 
                                   hover:bg-indigo-50 transition duration-150"
                    >
                        Ver Detalhes
                    </Link>
                    
                    <button
                        onClick={() => onAdicionarCarrinho(produto)}
                        disabled={desativarBotao}
                        className={`
                            flex-1 text-center py-2 px-4 rounded-lg font-medium transition duration-150
                            ${desativarBotao
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                            }
                        `}
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProdutoCard;