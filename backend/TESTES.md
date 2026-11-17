# Testes da API VemDeCar

* **API:** VemDeCar
* **Entidades:** Anunciante e Veículo
* **Tecnologias:** Node.js e Express 5
* **Servidor Base:** `http://localhost:3000`

---

## 1. Como Executar o Projeto

Antes de realizar os testes, é necessário iniciar o servidor da API. Siga os passos abaixo:

### 1.1. Abrir o terminal na pasta `backend`
* No VS Code, acesse **Terminal → Novo Terminal**.
* Certifique-se de que o terminal esteja aberto dentro da pasta `backend`.
* Para conferir o diretório atual, execute: `Get-Location` .
* Caso o terminal esteja na raiz do repositório, entre na pasta do backend:
  ```bash
  cd backend
  ```

### 1.2. Instalar as dependências
Na primeira execução do projeto, instale as dependências necessárias utilizando:
```bash
npm install
```
> **Observação:** Não é necessário executar `npm install` toda vez que iniciar a API. Caso as dependências já estejam instaladas e não tenham sido alteradas, siga diretamente para a próxima etapa.

### 1.3. Iniciar o servidor
Com o terminal localizado na pasta `backend`, execute:
```bash
npm run dev
```
* Esse comando inicia a API utilizando o recurso `--watch` do Node.js, permitindo que o servidor seja reiniciado automaticamente quando os arquivos forem modificados e salvos.
* Quando a inicialização ocorrer corretamente, será exibida uma mensagem semelhante a: 
  `🚗 VemDeCar API rodando em http://localhost:3000`

> **Importante:** Mantenha o terminal aberto durante a execução dos testes. Fechar o terminal ou pressionar `Ctrl + C` encerra o servidor.

### 1.4. Verificar se a API está funcionando
Com o servidor iniciado, abra o navegador e acesse:
`http://localhost:3000/`

A resposta esperada será:
```json
{
  "api": "VemDeCar API",
  "versao": "1.0.0",
  "rotas": [
    "/anunciantes",
    "/veiculos"
  ]
}
```
Essa rota funciona como um *health check*, permitindo verificar se a API está em execução e apresentando os recursos disponíveis.

### 1.5. Endereços dos recursos
A API está configurada para utilizar a porta `3000`. Seus principais recursos podem ser acessados pelos seguintes endereços:

| Recurso | Endereço |
| :--- | :--- |
| **Health check** | `http://localhost:3000/` |
| **Anunciantes** | `http://localhost:3000/anunciantes` |
| **Veículos** | `http://localhost:3000/veiculos` |
| **Veículos de um anunciante** | `http://localhost:3000/veiculos?anuncianteId=1` |

---

## 2. Testes da API

Os testes devem ser realizados utilizando a extensão **Thunder Client**, disponível no VS Code.

> **Dica:** Execute as requisições na ordem indicada, pois alguns testes dependem de dados cadastrados anteriormente. Os identificadores dos registros são gerados sequencialmente e os dados ficam armazenados temporariamente em memória. Portanto, ao reiniciar o servidor, os registros são apagados e a sequência de IDs começa novamente.

### 2.1. Sequência de Testes

| # | Método | URL | Body (JSON) | Status Esperado | Status Obtido | Observação |
|---|---|---|---|:---:|:---:|---|
| **1** | `GET` | `/` | — | **200** | [ ] | Health check |
| **2** | `POST` | `/anunciantes` | `{"nome":"Auto Exemplo","tipo":"EMPRESA","documento":"12345678000199","email":"contato@autoexemplo.com","telefone":"83999990000"}` | **201** | [ ] | Cria anunciante |
| **3** | `GET` | `/anunciantes` | — | **200** | [ ] | Lista anunciantes |
| **4** | `GET` | `/anunciantes/1` | — | **200** | [ ] | Busca anunciante existente |
| **5** | `GET` | `/anunciantes/99` | — | **404** | [ ] | Anunciante inexistente |
| **6** | `POST` | `/anunciantes` | `{"nome":"Outra Empresa","tipo":"EMPRESA","documento":"12345678000199","email":"outro@empresa.com","telefone":"83988887777"}` | **409** | [ ] | Documento duplicado |
| **7** | `POST` | `/anunciantes` | `{"nome":"Pessoa Exemplo","tipo":"TIPO_INVALIDO","documento":"12345678900","email":"pessoa@email.com","telefone":"83977776666"}` | **400** | [ ] | Tipo inválido |
| **8** | `POST` | `/veiculos` | `{"anuncianteId":1,"marca":"Fiat","modelo":"Argo","ano":2023,"placa":"ABC1D23","valorDiaria":150}` | **201** | [ ] | Cria veículo ligado ao anunciante |
| **9** | `GET` | `/veiculos` | — | **200** | [ ] | Lista veículos |
| **10** | `GET` | `/veiculos?anuncianteId=1` | — | **200** | [ ] | Filtro 1:N por anunciante |
| **11** | `GET` | `/veiculos/1` | — | **200** | [ ] | Busca veículo existente |
| **12** | `GET` | `/veiculos/99` | — | **404** | [ ] | Veículo inexistente |
| **13** | `POST` | `/veiculos` | `{"anuncianteId":999,"marca":"Fiat","modelo":"Mobi","ano":2022,"placa":"DEF2G34","valorDiaria":120}` | **422** | [ ] | Anunciante relacionado não existe |
| **14** | `POST` | `/veiculos` | `{"anuncianteId":1,"marca":"Fiat","modelo":"Argo","ano":2023,"placa":"ABC1D23","valorDiaria":150}` | **409** | [ ] | Placa duplicada |
| **15** | `POST` | `/veiculos` | `{"anuncianteId":1,"marca":"Fiat","modelo":"Mobi","ano":2022,"placa":"DEF2G34","valorDiaria":0}` | **400** | [ ] | Diária deve ser maior que zero |
| **16** | `PUT` | `/veiculos/1` | `{"valorDiaria":180}` | **200** | [ ] | Atualiza diária |
| **17** | `PUT` | `/anunciantes/1` | `{"telefone":"83996665555"}` | **200** | [ ] | Atualiza telefone |
| **18** | `DELETE` | `/veiculos/1` | — | **204** | [ ] | Remove veículo |
| **19** | `DELETE` | `/anunciantes/1` | — | **204** | [ ] | Remove anunciante |
| **20** | `DELETE` | `/anunciantes/99` | — | **404** | [ ] | Tenta remover anunciante inexistente |

---

## 3. Exemplos de Requisição

### Criar Anunciante — `POST /anunciantes`
```json
{
  "nome": "Auto Exemplo",
  "tipo": "EMPRESA",
  "documento": "12345678000199",
  "email": "contato@autoexemplo.com",
  "telefone": "83999990000"
}
```
> *Nota: O campo `tipo` aceita os valores `PESSOA_FISICA` ou `EMPRESA`.*

### Criar Veículo — `POST /veiculos`
```json
{
  "anuncianteId": 1,
  "marca": "Fiat",
  "modelo": "Argo",
  "ano": 2023,
  "placa": "ABC1D23",
  "valorDiaria": 150
}
```

### Filtrar Veículos por Anunciante — `GET /veiculos?anuncianteId=1`
* Retorna somente os veículos associados ao anunciante informado.

---

## 4. Observações sobre a Execução

* Nesta etapa, os dados são armazenados temporariamente em **arrays nos Models**, sem integração com banco de dados.
* Os registros são perdidos quando o servidor é encerrado ou reiniciado.
* Os exemplos de teste consideram que a API foi iniciada sem registros cadastrados.
* Caso a porta `3000` esteja sendo utilizada por outro processo, será necessário encerrar esse processo ou configurar outra porta para a aplicação.
* Para encerrar o servidor manualmente, acesse o terminal em que a API está sendo executada e pressione `Ctrl + C`.