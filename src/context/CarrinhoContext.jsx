import React, { createContext, useState, useContext, useMemo } from 'react';

const CarrinhoContext = createContext();

export const useCarrinho = () => {
    return useContext(CarrinhoContext);
};

export const CarrinhoProvider = ({ children }) => {
    const [carrinho, setCarrinho] = useState([]);

    const calcularTotalItem = (item) => item.preco * item.quantidade;

    const adicionarAoCarrinho = (produto, quantidade = 1) => {
        const itemExistente = carrinho.find(item => item.id === produto.id);

        if (itemExistente) {
            const novaQuantidade = itemExistente.quantidade + quantidade;

            if (novaQuantidade > produto.estoque) {
                return false; 
            }

            setCarrinho(prevCarrinho =>
                prevCarrinho.map(item =>
                    item.id === produto.id
                        ? { ...item, quantidade: novaQuantidade }
                        : item
                )
            );
        } else {
            if (quantidade > produto.estoque) {
                 return false; 
            }
            setCarrinho(prevCarrinho => [...prevCarrinho, { ...produto, quantidade }]);
        }
        return true;
    };

    const aumentarQuantidade = (id) => {
        setCarrinho(prevCarrinho =>
            prevCarrinho.map(item => {
                if (item.id === id) {
                    const novaQuantidade = item.quantidade + 1;
                    if (novaQuantidade > item.estoque) {
                        return item; 
                    }
                    return { ...item, quantidade: novaQuantidade };
                }
                return item;
            })
        );
    };

    const diminuirQuantidade = (id) => {
        setCarrinho(prevCarrinho =>
            prevCarrinho.map(item => {
                if (item.id === id) {
                    const novaQuantidade = item.quantidade - 1;
                    if (novaQuantidade < 1) {
                        return item; 
                    }
                    return { ...item, quantidade: novaQuantidade };
                }
                return item;
            })
        );
    };

    const removerDoCarrinho = (id) => {
        setCarrinho(prevCarrinho => prevCarrinho.filter(item => item.id !== id));
    };
    
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