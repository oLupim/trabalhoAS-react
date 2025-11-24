import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';

const formatarPreco = (preco) => {
    const numericPrice = parseFloat(preco);
    if (isNaN(numericPrice)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numericPrice);
};

const ItemCarrinho = ({ item }) => {
    const { aumentarQuantidade, diminuirQuantidade, removerDoCarrinho } = useCarrinho();
    
    const totalItem = item.preco * item.quantidade;

    const podeAumentar = item.quantidade < item.estoque;
    const estoqueMaximoAtingido = item.quantidade >= item.estoque;
    const podeDiminuir = item.quantidade > 1;

    return (
        <div className="flex items-center p-4 border-b border-gray-200 transition duration-150 hover:bg-gray-50">
            
            <div className="flex-shrink-0 w-16 h-16 mr-4">
                <img 
                    src={item.urlImagem || 'https://via.placeholder.com/64'} 
                    alt={item.nome} 
                    className="w-full h-full object-cover rounded-md shadow-md"
                />
            </div>
            <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{item.nome}</h3>
                <p className="text-sm text-gray-500">Preço Unitário: {formatarPreco(item.preco)}</p>
                {estoqueMaximoAtingido && (
                    <p className="text-xs font-medium text-orange-600 mt-1">
                        Estoque máximo ({item.estoque}) atingido!
                    </p>
                )}
            </div>

            <div className="flex items-center space-x-2 mx-4">
                <button
                    onClick={() => diminuirQuantidade(item.id)}
                    disabled={!podeDiminuir}
                    className={`p-2 rounded-full font-bold transition duration-150 
                        ${podeDiminuir ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                    `}
                >
                    –
                </button>
                <span className="w-8 text-center font-bold text-lg">{item.quantidade}</span>
                <button
                    onClick={() => aumentarQuantidade(item.id)}
                    disabled={!podeAumentar}
                    className={`p-2 rounded-full font-bold transition duration-150 
                        ${podeAumentar ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                    `}
                >
                    +
                </button>
            </div>

            <div className="text-right w-32">
                <p className="text-lg font-bold text-gray-900">{formatarPreco(totalItem)}</p>
                <button
                    onClick={() => removerDoCarrinho(item.id)}
                    className="text-sm text-red-500 hover:text-red-700 mt-1 transition duration-150"
                >
                    Remover
                </button>
            </div>
        </div>
    );
};

const Carrinho = () => {
    const { carrinho, totalGeral } = useCarrinho();

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[80vh]">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b-2 border-indigo-400 pb-2">
                Seu Carrinho de Compras 🛍️
            </h1>

            {carrinho.length === 0 ? (
                <div className="text-center p-12 bg-gray-100 rounded-lg shadow-inner">
                    <p className="text-2xl text-gray-600 mb-6">Seu carrinho está vazio!</p>
                    <Link 
                        to="/" 
                        className="py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
                    >
                        Voltar para a Home
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    <div className="lg:w-3/5 bg-white shadow-xl rounded-lg divide-y divide-gray-100">
                        {carrinho.map(item => (
                            <ItemCarrinho key={item.id} item={item} />
                        ))}
                    </div>

                    <div className="lg:w-2/5 sticky top-20 h-fit">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-xl border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                                Resumo da Compra
                            </h2>
                            <div className="flex justify-between text-xl font-semibold text-gray-900 my-4">
                                <span>Total Geral:</span>
                                <span>{formatarPreco(totalGeral)}</span>
                            </div>
                            <button
                                className="w-full py-3 mt-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                            >
                                Finalizar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Carrinho;