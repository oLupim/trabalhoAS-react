Mini E-commerce com React + JSON Server

Este é um projeto de um pequeno e-commerce desenvolvido em React, utilizando React Router, Context API, hooks, JSON Server para simular uma API e TailwindCSS para estilização.

⚙️ Instruções de Instalação e Execução

Para executar este projeto localmente, siga os passos abaixo:

1️⃣ Clone o repositório
git clone https://github.com/seu-usuario/mini-ecommerce-react.git

2️⃣ Acesse o diretório do projeto
cd mini-ecommerce-react

3️⃣ Instale as dependências
npm install

4️⃣ Configure o JSON Server

Entre na pasta do servidor (se existir):

cd server


Crie o arquivo db.json com a estrutura mínima:

{
  "produtos": [
    {
      "id": 1,
      "nome": "Produto 1",
      "descricao": "Descrição do produto 1",
      "preco": 99.9,
      "imagem": "https://via.placeholder.com/150",
      "estoque": 10
    }
  ]
}


Inicie o JSON Server:

npx json-server --watch db.json --port 3001

5️⃣ Rode o projeto React

Volte para a pasta raiz, se necessário:

cd ..


Inicie o servidor React:

npm start


A aplicação abrirá em:
👉 http://localhost:3000

📌 Funcionalidades

Listagem de produtos

Detalhes do produto

Carrinho com quantidade, remoção e total

Validação de estoque

Cadastro de produtos

Edição de produtos

Exclusão

Navegação com react-router-dom

Context API para carrinho

📦 Dependências Principais

React

react-router-dom

TailwindCSS

JSON Server

Hooks (useState, useEffect, useContext, useRef, useParams, useNavigate)

▶️ Como Rodar o JSON Server Separadamente
npx json-server --watch db.json --port 5000

📝 Observação

Se desejar, adicione outras seções como documentação, prints da tela ou vídeo explicativo.
