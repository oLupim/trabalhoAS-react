import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Frown, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center bg-gray-100">
            <Frown className="w-24 h-24 text-indigo-600 mb-6 animate-pulse" />
            
            <h1 className="text-8xl font-extrabold text-gray-900 mb-4">404</h1>
            
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                Página Não Encontrada
            </h2>
            
            <p className="text-lg text-gray-500 mb-8 max-w-md">
                Desculpe, não conseguimos encontrar a página que você está procurando. Parece que o endereço está incorreto ou a página foi removida.
            </p>
            
            <button
                onClick={() => navigate('/')}
                className="flex items-center bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar à Página Inicial
            </button>
        </div>
    );
};

export default NotFound;