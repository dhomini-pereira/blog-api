# Blog API

Esta API tem como finalidade suprir as necessidades do Front-End para gerenciar `Users`, `Roles`, `Permissions`, `Posts` e `Comments`.

### Dependências

- TypeScript
  - Supertipo do JavaScript.
- Fastify
  - Gerenciador de Rotas e servidor HTTP.
- Prisma ORM
  - ORM para modelagem e manipulação de dados (DDL/DML).
- PostgreSQL
  - Banco de Dados Relacional.
- Zod
  - Validação de entrada e saída de dados.

### Estrutura

- **src**: Pasta raiz do projeto.
  - **configs**: Arquivos de configuração.
  - **controllers**: Controladores das rotas da API.
  - **guards**: Middlewares para autenticação e autorização.
  - **routes**: Rotas da API.
  - **server.ts**: Arquivo principal do servidor.
  - **types.ts**: Arquivo de definição de tipos.
- **prisma**: Pasta com os arquivos de configuração do Prisma ORM.

### Instalação

Clonar o repositório:

```ps
$ git clone <repositorio>
```

Instalar as dependências:

```ps
$ npm install
```

> Altere o arquivo `example.env` para apenas `.env` e preencha-o de acordo com a sua configuração antes de prosseguir.

Sincronizar o banco de dados com o modelo do Prisma:

```ps
$ npx prisma db push
```

Iniciar o servidor HTTP (Porta 3000):

```ps
$ npm run dev
```
