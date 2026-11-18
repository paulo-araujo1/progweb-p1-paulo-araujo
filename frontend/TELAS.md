# Telas do projeto 1 - VemDeCar (S4)

Front: `npx http-server -p 5500 -c-1` dentro de `frontend/`  
API: `npm run dev` dentro de `backend/`  
Endereço do front: `http://localhost:5500`  
Endereço da API: `http://localhost:3000`

## Estados da lista de anunciantes

| Estado | Como provocar | O que aparece |
|---|---|---|
| Carregando | Ativar Network throttling (3G) e atualizar a página | Spinner e texto "Carregando anunciantes…" |
| Vazio | Iniciar a API sem anunciantes cadastrados | Mensagem "Nenhum anunciante cadastrado." |
| Erro | Parar a API com Ctrl+C e atualizar a página | Mensagem de falha e botão "Tentar de novo" |
| Sucesso | Cadastrar um anunciante válido | Tabela com os dados do anunciante |

## Estados da lista de veículos

| Estado | Como provocar | O que aparece |
|---|---|---|
| Carregando | Ativar Network throttling (3G) e atualizar a página | Spinner e texto "Carregando veículos…" |
| Vazio | Não cadastrar veículos | Mensagem "Nenhum veículo cadastrado." |
| Erro | Parar a API e atualizar a página | Mensagem de falha e botão "Tentar de novo" |
| Sucesso | Cadastrar um veículo associado a um anunciante existente | Tabela com o veículo e o nome do anunciante |

## Regras testadas pela interface

- Documento repetido de anunciante: backend responde 409.
- Tipo de anunciante inválido: backend responde 400.
- Placa repetida: backend responde 409.
- Valor da diária menor ou igual a zero: frontend impede o envio; backend também valida e responde 400.
- Anunciante inexistente: backend responde 422.
- O formulário de veículo possui um `<select>` abastecido pelos anunciantes cadastrados.
- O filtro de veículos utiliza `GET /veiculos?anuncianteId=...`.

## Camadas
- api: `js/api.js` · services: `js/services/` · state: `js/state/store.js` · ui: `js/ui/