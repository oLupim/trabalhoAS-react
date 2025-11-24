import React, { createContext, useState, useContext, useEffect } from 'react';

const ProdutoContext = createContext();

export const useProdutos = () => useContext(ProdutoContext);

const API_URL = 'http://localhost:3001/produtos';

export const ProdutoProvider = ({ children }) => {
    const [produtos, setProdutos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProdutos = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Falha ao buscar produtos');
            const data = await res.json();
            setProdutos(data || []);
            return data;
        } catch (err) {
            setError(err.message || 'Erro desconhecido');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const addProduto = async (novoProduto) => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoProduto),
            });
            if (!res.ok) throw new Error('Falha ao salvar produto');
            const created = await res.json();
            setProdutos(prev => [...prev, created]);
            return created;
        } catch (err) {
            console.error('addProduto error:', err);
            return null;
        }
    };

    const getProdutoById = (id) => {
        if (!id) return undefined;
        return produtos.find(p => p.id?.toString() === id.toString());
    };

    const updateProduto = async (id, dadosAtualizados) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados),
            });
            if (!res.ok) throw new Error('Falha ao atualizar produto');
            const updated = await res.json();
            setProdutos(prev => prev.map(p => (p.id?.toString() === id.toString() ? updated : p)));
            return updated;
        } catch (err) {
            console.error('updateProduto error:', err);
            return null;
        }
    };

    const deleteProduto = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Falha ao deletar produto');
            setProdutos(prev => prev.filter(p => p.id?.toString() !== id.toString()));
            return true;
        } catch (err) {
            console.error('deleteProduto error:', err);
            return false;
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    const contextValue = {
        produtos,
        isLoading,
        error,
        fetchProdutos,
        addProduto,
        updateProduto,
        deleteProduto,
        getProdutoById,
    };

    return (
        <ProdutoContext.Provider value={contextValue}>
            {children}
        </ProdutoContext.Provider>
    );
};