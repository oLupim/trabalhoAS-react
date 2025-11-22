// src/pages/EditarProduto.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ***********************************************
// NOTA: Assumindo que você criou e importou o ProdutoContext
// ***********************************************
// Importe o hook do Contexto do Produto (para buscar e atualizar os dados)
// import { useProdutos } from '../context/ProdutoContext';

// Hook Simples de Exemplo para simular busca e atualização
const useProdutosSimples = () => {
    // Dados de exemplo (SUBSTITUA PELO SEU ProdutoContext REAL)
    const mockProdutos = [
        { id: '1', nome: 'Camiseta Básica', descricao: 'Algodão Pima, 100% orgânico.', preco: 89.90, estoque: 5, urlImagem: 'https://via.placeholder.com/800x600/6366f1/ffffff?text=Camiseta' },
        { id: '2', nome: 'Notebook Gamer X300', descricao: 'Processador i9, 32GB RAM, RTX 4070.', preco: 8500.00, estoque: 1, urlImagem: 'https://via.placeholder.com/800x600/f59e0b/ffffff?text=Notebook' },
    ];

    const getProdutoById = (id) => mockProdutos.find(p => p.id === id); 
    
    // Função simulada de PUT
    const updateProduto = async (id, data) => {
        console.log(`Enviando PUT para a API (ID: ${id}) com dados:`, data);
        // Simula o sucesso
        return true; 
    };
    return { getProdutoById, updateProduto };
};


const EditarProduto = () => {
    const { id } = useParams(); // Captura o ID do produto a ser editado
    const navigate = useNavigate();
    
    // Hooks de Contexto (substitua por useProdutos() do seu Context)
    const { getProdutoById, updateProduto } = useProdutosSimples(); 

    // 1. Estado para os dados do formulário
    const [form, setForm] = useState(null); // Inicia como null para controlar o carregamento
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    
    // 2. Referências para os campos
    const inputRefs = {
        nome: useRef(null),
        descricao: useRef(null),
        preco: useRef(null),
        urlImagem: useRef(null),
        estoque: useRef(null),
    };

    // 3. Efeito para carregar os dados iniciais
    useEffect(() => {
        const produto = getProdutoById(id);
        if (produto) {
             // Preenche o formulário com os dados existentes, convertendo números para strings para o input
            setForm({
                nome: produto.nome,
                descricao: produto.descricao,
                preco: produto.preco.toString(),
                urlImagem: produto.urlImagem,
                estoque: produto.estoque.toString(),
            });
            setLoading(false);
        } else {
            // Se não encontrar, redireciona para uma 404 ou Home
            alert("Produto não encontrado para edição.");
            navigate('/'); 
        }
    }, [id, navigate, getProdutoById]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Função de Validação (Requisito 4.1 - Reutilizada do Cadastro)
    const validate = () => {
        let newErrors = {};
        let isValid = true;
        let firstInvalidRef = null;

        if (!form.nome.trim()) { newErrors.nome = 'Nome é obrigatório.'; isValid = false; }
        if (!form.descricao.trim()) { newErrors.descricao = 'Descrição é obrigatória.'; isValid = false; }
        if (!form.urlImagem.trim()) { newErrors.urlImagem = 'URL da Imagem é obrigatória.'; isValid = false; }

        const precoNum = parseFloat(form.preco);
        if (form.preco === '' || isNaN(precoNum)) {
            newErrors.preco = 'Preço deve ser um número válido.'; isValid = false;
        } else if (precoNum < 0) {
            newErrors.preco = 'Preço deve ser maior ou igual a zero.'; isValid = false;
        }

        const estoqueInt = parseInt(form.estoque);
        if (form.estoque === '' || isNaN(estoqueInt)) {
            newErrors.estoque = 'Estoque deve ser um número inteiro válido.'; isValid = false;
        } else if (estoqueInt < 0) {
            newErrors.estoque = 'Estoque deve ser maior ou igual a zero.'; isValid = false;
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

            const success = await updateProduto(id, produtoParaAPI);

            if (success) {
                alert("Produto atualizado com sucesso!");
                // Redirecionar para os detalhes após a atualização
                navigate(`/produto/${id}`);
            } else {
                alert("Falha ao atualizar produto. Verifique a conexão com a API.");
            }
        }
    };

    // Componente auxiliar de Input (reutilizado do CadastroProduto)
    const FormInput = ({ label, name, type = 'text', inputRef, error }) => (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                ref={inputRef}
                value={form?.[name] || ''} // Usa optional chaining e valor padrão
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none 
                    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}
                `}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
    
    if (loading || form === null) {
        return (
             <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="ml-4 text-gray-700">Carregando dados do produto...</p>
            </div>
        );
    }


    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[80vh]">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b-2 border-indigo-500 pb-2">
                Editar Produto: {form.nome} 📝
            </h1>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
                
                <FormInput 
                    label="Nome do Produto" 
                    name="nome" 
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
                    inputRef={inputRefs.preco} 
                    error={errors.preco} 
                />

                <FormInput 
                    label="Estoque" 
                    name="estoque" 
                    type="number" 
                    inputRef={inputRefs.estoque} 
                    error={errors.estoque} 
                />

                <FormInput 
                    label="URL da Imagem" 
                    name="urlImagem" 
                    inputRef={inputRefs.urlImagem} 
                    error={errors.urlImagem} 
                />
                
                <button
                    type="submit"
                    className="w-full mt-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.01]"
                >
                    Salvar Alterações
                </button>
                
                <button
                    type="button"
                    onClick={() => navigate(`/produto/${id}`)}
                    className="w-full mt-3 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition duration-300"
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditarProduto;