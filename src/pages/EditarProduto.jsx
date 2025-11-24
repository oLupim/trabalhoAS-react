import React, { useState, useRef, useEffect, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProdutos } from '../context/ProdutoContext.jsx'; // Caminho corrigido com a extensão .jsx
import { Loader2, ArrowLeft } from 'lucide-react';

// Componente FormInput (Reutilizado do CadastroProduto)
const FormInput = memo(({ label, name, type = 'text', value, onChange, inputRef, error }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            ref={inputRef}
            // Valor padrão para evitar problemas de valor indefinido
            value={value || (type === 'number' ? '' : '')}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none 
                ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}
            `}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
));

const EditarProduto = () => {
    const { id } = useParams(); // Obtém o ID da URL
    const navigate = useNavigate();
    
    // Usando o hook do Contexto
    const { getProdutoById, updateProduto, isLoading, error: contextError } = useProdutos(); 
    
    // Busca o produto pelo ID (se não for encontrado, ele é null/undefined)
    const produtoExistente = getProdutoById(id);

    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        preco: '',
        urlImagem: '',
        estoque: '',
    });
    
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const inputRefs = {
        nome: useRef(null),
        descricao: useRef(null),
        preco: useRef(null),
        urlImagem: useRef(null),
        estoque: useRef(null),
    };

    // Efeito para carregar os dados do produto no formulário
    useEffect(() => {
        if (produtoExistente) {
            setForm({
                nome: produtoExistente.nome || '',
                descricao: produtoExistente.descricao || '',
                // Converte números para string para o input type="number"
                preco: String(produtoExistente.preco) || '', 
                urlImagem: produtoExistente.urlImagem || '',
                estoque: String(produtoExistente.estoque) || '',
            });
            setIsInitialLoad(false);
        }
    }, [produtoExistente]);

    // Efeito para esconder a mensagem após 5 segundos
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);


    // Se o produto não for encontrado após a tentativa de busca, redireciona ou mostra erro.
    if (!produtoExistente && !isLoading && !isInitialLoad) {
        return (
            <div className="container mx-auto p-8 text-center min-h-[80vh] flex flex-col justify-center items-center">
                <h1 className="text-4xl text-red-500 font-bold mb-4">🚫 Produto Não Encontrado</h1>
                <p className="text-lg text-gray-600 mb-8">O ID "{id}" não corresponde a nenhum item em estoque para edição.</p>
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
    
    // Se o contexto está carregando ou é o carregamento inicial, exibe o loading
    if (isLoading || isInitialLoad) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-2" />
                <span className="text-lg text-indigo-600">A carregar detalhes do produto...</span>
            </div>
        );
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;
        let firstInvalidRef = null;

        if (!form.nome.trim()) { newErrors.nome = 'Nome é obrigatório.'; isValid = false; }
        if (!form.descricao.trim()) { newErrors.descricao = 'Descrição é obrigatória.'; isValid = false; }
        if (!form.urlImagem.trim()) { 
             newErrors.urlImagem = 'URL da Imagem é obrigatória.'; 
             isValid = false; 
        } else if (!/^https?:\/\/.+/.test(form.urlImagem.trim())) {
             newErrors.urlImagem = 'URL da Imagem inválida. Deve começar com http(s)://';
             isValid = false;
        }

        const precoNum = parseFloat(form.preco);
        if (form.preco === '' || isNaN(precoNum) || precoNum < 0) {
            newErrors.preco = 'Preço deve ser um número válido (maior ou igual a zero).'; isValid = false;
        }

        const estoqueInt = parseInt(form.estoque);
        if (form.estoque === '' || isNaN(estoqueInt) || estoqueInt < 0) {
            newErrors.estoque = 'Estoque deve ser um número inteiro válido (maior ou igual a zero).'; isValid = false;
        }

        for (const key in newErrors) {
            if (newErrors[key] && inputRefs[key]?.current) {
                firstInvalidRef = inputRefs[key].current;
                break;
            }
        }

        setErrors(newErrors);
        
        if (firstInvalidRef) {
            firstInvalidRef.focus();
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return; // Previne múltiplos submits

        if (validate()) {
            const produtoAtualizado = {
                ...form,
                preco: parseFloat(form.preco),
                estoque: parseInt(form.estoque),
            };

            try {
                // Chama a função de atualização do contexto
                const success = await updateProduto(id, produtoAtualizado);

                if (success) {
                    setMessage({ type: 'success', text: 'Produto atualizado com sucesso! A redirecionar...' });
                    setTimeout(() => navigate('/'), 1500);
                } else {
                    // O erro já foi definido dentro do contexto, mas pode ser exibido aqui também.
                    setMessage({ type: 'error', text: 'Falha ao atualizar produto. Verifique a conexão com o servidor.' });
                }
            } catch (error) {
                setMessage({ type: 'error', text: 'Erro inesperado durante a atualização.' });
                console.error("Erro na atualização:", error);
            }
        }
    };

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
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[80vh]">
            <MessageNotification />
            <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b-2 border-indigo-500 pb-2">
                Editar Produto: {produtoExistente.nome} <span className="text-indigo-600">#{id}</span>
            </h1>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
                
                <FormInput 
                    label="Nome do Produto" 
                    name="nome" 
                    value={form.nome}
                    onChange={handleChange}
                    inputRef={inputRefs.nome} 
                    error={errors.nome} 
                />

                <div className="mb-4">
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                    </label>
                    <textarea
                        id="descricao"
                        name="descricao"
                        rows="3"
                        ref={inputRefs.descricao}
                        value={form.descricao}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none 
                            ${errors.descricao ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}
                        `}
                    ></textarea>
                    {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>}
                </div>
                
                <FormInput 
                    label="Preço (R$)" 
                    name="preco" 
                    type="number" 
                    value={form.preco}
                    onChange={handleChange}
                    inputRef={inputRefs.preco} 
                    error={errors.preco} 
                />

                <FormInput 
                    label="Estoque" 
                    name="estoque" 
                    type="number" 
                    value={form.estoque}
                    onChange={handleChange}
                    inputRef={inputRefs.estoque} 
                    error={errors.estoque} 
                />

                <FormInput 
                    label="URL da Imagem" 
                    name="urlImagem" 
                    value={form.urlImagem}
                    onChange={handleChange}
                    inputRef={inputRefs.urlImagem} 
                    error={errors.urlImagem} 
                />
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full mt-6 py-3 text-white font-bold rounded-lg shadow-md transition duration-300 ${
                        isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 transform hover:scale-[1.01]'
                    }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            A Atualizar...
                        </span>
                    ) : (
                        'Salvar Alterações'
                    )}
                </button>
                
                <button
                    type="button"
                    onClick={() => navigate(`/produto/${id}`)}
                    className="w-full mt-3 py-3 text-indigo-600 bg-gray-100 border border-indigo-600 font-bold rounded-lg shadow-md transition duration-300 hover:bg-gray-200"
                >
                    Cancelar e Voltar
                </button>
            </form>
        </div>
    );
};

export default EditarProduto;