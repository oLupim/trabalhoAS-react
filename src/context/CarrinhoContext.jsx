// src/context/CarrinhoContext.jsx
import React, { createContext, useState, useContext, useMemo } from 'react';

// 1. Cria o Context
const CarrinhoContext = createContext();

// 2. Hook customizado para uso
export const useCarrinho = () => {
    return useContext(CarrinhoContext);
};

// 3. O CarrinhoProvider
export const CarrinhoProvider = ({ children }) => {
    const [carrinho, setCarrinho] = useState([]);

    // Função auxiliar para calcular o total de um item
    const calcularTotalItem = (item) => item.preco * item.quantidade;

    // === LÓGICA CHAVE: Adicionar ao Carrinho com Validação de Estoque ===
    const adicionarAoCarrinho = (produto, quantidade = 1) => {
        // Assume-se que 'produto' possui as propriedades 'id' e 'estoque'
        const itemExistente = carrinho.find(item => item.id === produto.id);

        if (itemExistente) {
            // 1. Verifica se a nova quantidade ultrapassa o estoque
            const novaQuantidade = itemExistente.quantidade + quantidade;

            if (novaQuantidade > produto.estoque) {
                // Estoque máximo atingido. Retorna falso ou lança um alerta.
                return false; 
            }

            // Aumenta a quantidade do item existente
            setCarrinho(prevCarrinho =>
                prevCarrinho.map(item =>
                    item.id === produto.id
                        ? { ...item, quantidade: novaQuantidade }
                        : item
                )
            );
        } else {
            // Adiciona um novo item (validação de quantidade=1 contra estoque já deve ter ocorrido na UI)
            if (quantidade > produto.estoque) {
                 return false; 
            }
            setCarrinho(prevCarrinho => [...prevCarrinho, { ...produto, quantidade }]);
        }
        return true; // Sucesso
    };

    // === Aumentar Quantidade (com limite de estoque) ===
    const aumentarQuantidade = (id) => {
        setCarrinho(prevCarrinho =>
            prevCarrinho.map(item => {
                if (item.id === id) {
                    // Impede o aumento se a quantidade atual for igual ou maior que o estoque
                    const novaQuantidade = item.quantidade + 1;
                    if (novaQuantidade > item.estoque) {
                        return item; // Não faz nada
                    }
                    return { ...item, quantidade: novaQuantidade };
                }
                return item;
            })
        );
    };

    // === Diminuir Quantidade (mínimo 1) ===
    const diminuirQuantidade = (id) => {
        setCarrinho(prevCarrinho =>
            prevCarrinho.map(item => {
                if (item.id === id) {
                    // Impede a diminuição se a quantidade for 1
                    const novaQuantidade = item.quantidade - 1;
                    if (novaQuantidade < 1) {
                        return item; // Não faz nada (o botão de Remover deve ser usado)
                    }
                    return { ...item, quantidade: novaQuantidade };
                }
                return item;
            })
        );
    };

    // === Remover Item ===
    const removerDoCarrinho = (id) => {
        setCarrinho(prevCarrinho => prevCarrinho.filter(item => item.id !== id));
    };
    
    // === Cálculo do Total Geral (useMemo para otimização) ===
    const totalGeral = useMemo(() => {
        return carrinho.reduce((acc, item) => acc + calcularTotalItem(item), 0);
    }, [carrinho]);


    const contextValue = {
        carrinho,
        totalGeral,
        adicionarAoCarrinho,
        aumentarQuantidade,
        diminuirQuantidade,
        removerDoCarrinho,
    };

    return (
        <CarrinhoContext.Provider value={contextValue}>
            {children}
        </CarrinhoContext.Provider>
    );
};