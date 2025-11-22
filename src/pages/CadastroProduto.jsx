import React, { useState, useRef, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProdutos } from '../context/ProdutoContext';

// Componente FormInput movido para fora e usando memo para otimização
// Isso impede a re-renderização desnecessária e resolve o bug de perda de foco.
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

const CadastroProduto = () => {
    const navigate = useNavigate();

    const { addProduto } = useProdutos();

    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        preco: '',
        urlImagem: '',
        estoque: '',
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);

    const inputRefs = {
        nome: useRef(null),
        descricao: useRef(null),
        preco: useRef(null),
        urlImagem: useRef(null),
        estoque: useRef(null),
    };

    // Função para esconder a mensagem após 5 segundos
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Correção essencial: usando spread operator para manter o estado
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;
        let firstInvalidRef = null;

        if (!form.nome.trim()) { newErrors.nome = 'Nome é obrigatório.'; isValid = false; }
        if (!form.descricao.trim()) { newErrors.descricao = 'Descrição é obrigatória.'; isValid = false; }
        if (!form.urlImagem.trim()) { newErrors.urlImagem = 'URL da Imagem é obrigatória.'; isValid = false; }

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

        if (validate()) {
            const produtoParaAPI = {
                ...form,
                preco: parseFloat(form.preco),
                estoque: parseInt(form.estoque),
            };

            try {
                const created = await addProduto(produtoParaAPI);

                if (created) {
                    setMessage({ type: 'success', text: 'Produto cadastrado com sucesso!' });
                    setForm({ nome: '', descricao: '', preco: '', urlImagem: '', estoque: '' });
                    setTimeout(() => navigate('/'), 1200);
                } else {
                    setMessage({ type: 'error', text: 'Falha ao cadastrar produto. Tente novamente.' });
                }
            } catch (error) {
                setMessage({ type: 'error', text: 'Erro de conexão com a API.' });
                console.error('Erro no cadastro:', error);
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
            <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b-2 border-green-500 pb-2">
                Cadastrar Novo Produto 🆕
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
                    className="w-full mt-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-[1.01]"
                >
                    Cadastrar Produto
                </button>
            </form>
        </div>
    );
};

export default CadastroProduto;