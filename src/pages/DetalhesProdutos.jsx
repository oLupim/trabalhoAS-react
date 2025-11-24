import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProdutos } from '../context/ProdutoContext.jsx';
import { Package, DollarSign, Archive, ArrowLeft, Loader2, Trash2, Edit } from 'lucide-react';

const formatarPreco = (preco) => {
    const numericPrice = parseFloat(preco);
    if (isNaN(numericPrice)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numericPrice);
};


const DetalhesProduto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { getProdutoById, deleteProduto, isLoading, error } = useProdutos();
    
    const produto = getProdutoById(id);

    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState(null);

    const handleDelete = async () => {
        if (window.confirm("Tem certeza que deseja DELETAR este produto? Esta ação é irreversível.")) {
            setIsDeleting(true);
            
            const success = await deleteProduto(id);
            
            if (success) {
                setMessage({ type: 'success', text: 'Produto deletado com sucesso. Redirecionando...' });
                setTimeout(() => navigate('/'), 1000); 
            } else {
                setMessage({ type: 'error', text: 'Falha ao deletar produto. Verifique a conexão com a API.' });
            }
            setIsDeleting(false);
        }
    };
    
    if (isLoading && !produto) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-2" />
                <span className="text-lg text-indigo-600">A carregar detalhes...</span>
            </div>
        );
    }
    
    if (error && !produto) {
        return (
            <div className="container mx-auto p-8 text-center min-h-[80vh] flex flex-col justify-center items-center">
                <h1 className="text-4xl text-red-500 font-bold mb-4">❌ Erro de Conexão</h1>
                <p className="text-lg text-gray-600 mb-8">Não foi possível carregar os dados: {error}</p>
            </div>
        );
    }

    if (!produto) {
        return (
            <div className="container mx-auto p-8 text-center min-h-[80vh] flex flex-col justify-center items-center">
                <h1 className="text-4xl text-red-500 font-bold mb-4">🚫 Produto Não Encontrado</h1>
                <p className="text-lg text-gray-600 mb-8">O ID "{id}" não corresponde a nenhum item em estoque.</p>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar à Lista
                </button>
            </div>
        );
    }

    const MessageNotification = () => {
        if (!message) return null;
        
        const baseClasses = "fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-xl z-50 text-white font-semibold transition-opacity duration-300";
        const successClasses = "bg-green-500";
        const errorClasses = "bg-red-500";

        return (
            <div className={`${baseClasses} ${message.type === 'success' ? successClasses : errorClasses}`}>
                {message.text}
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-12 min-h-[80vh]">
            <MessageNotification />
            
            <button
                onClick={() => navigate('/')}
                className="flex items-center text-indigo-600 font-semibold mb-6 hover:text-indigo-800 transition duration-200"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
            </button>

            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 flex flex-col lg:flex-row gap-10">
                
                <div className="lg:w-1/3">
                    <img
                        src={produto.urlImagem}
                        alt={produto.nome}
                        className="w-full h-auto rounded-lg shadow-lg object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/6b7280/ffffff?text=Sem+Imagem" }}
                    />
                </div>

                <div className="lg:w-2/3">
                    <div className="flex justify-between items-start">
                        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">{produto.nome}</h1>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => navigate(`/editar/${produto.id}`)} 
                                className="flex items-center p-3 rounded-full bg-blue-500 text-white transition duration-300 hover:bg-blue-600"
                                title="Editar Produto (Funcionalidade futura)"
                            >
                                <Edit className="w-5 h-5" />
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className={`flex items-center p-3 rounded-full text-white transition duration-300 ${
                                    isDeleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                                }`}
                                title="Deletar Produto"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Trash2 className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <p className="text-3xl font-bold text-green-600 mb-6 flex items-center">
                        <DollarSign className="w-7 h-7 mr-2" />
                        {formatarPreco(produto.preco)}
                    </p>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center text-gray-700">
                            <Archive className="w-5 h-5 mr-3 text-indigo-500" />
                            <span className="font-semibold">Estoque:</span> 
                            <span className={`ml-2 text-lg font-mono px-3 py-1 rounded-full ${produto.estoque > 0 ? 'bg-indigo-100 text-indigo-800' : 'bg-red-100 text-red-800 font-bold'}`}>
                                {produto.estoque} unidades
                            </span>
                        </div>
                        <div className="flex items-start text-gray-700">
                            <Package className="w-5 h-5 mr-3 text-indigo-500 mt-1" />
                            <span className="font-semibold">ID do Produto:</span> 
                            <span className="ml-2 bg-gray-100 p-2 rounded-md font-mono text-sm">{produto.id}</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-3 border-b pb-1">Descrição</h2>
                    <p className="text-gray-600 leading-relaxed">
                        {produto.descricao}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default DetalhesProduto;