# sdda_backend

Backend em Node.js com TypeScript, Express, Zod, bcrypt e banco de dados SQLite embarcado (equivalente ao H2 no ecossistema Node.js).

## 🚀 Tecnologias

- **Node.js** (v22+)
- **TypeScript**
- **Express 5**
- **Zod**: Validação e tipagem de esquemas de requisições
- **bcryptjs**: Hash e verificação segura de senhas
- **better-sqlite3**: Banco de dados relacional embarcado/em memória de alta performance
- **tsx**: Execução de TypeScript em desenvolvimento com hot-reload

## 📁 Estrutura do Projeto

```
sdda_backend/
├── src/
│   ├── config/
│   │   └── database.ts            # Conexão e inicialização do banco SQLite
│   ├── middlewares/
│   │   └── validate.ts            # Middleware genérico de validação com Zod
│   ├── modules/
│   │   └── user/
│   │       ├── user.schema.ts     # Schemas Zod (cadastro e login)
│   │       ├── user.controller.ts # Handlers HTTP
│   │       └── user.service.ts    # Lógica de negócio, bcrypt e queries
│   ├── routes.ts                  # Registro das rotas
│   ├── app.ts                     # Configuração da aplicação Express
│   └── server.ts                  # Ponto de entrada do servidor
├── test/
│   └── api.test.ts                # Testes de integração automatizados
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

## 🛠️ Como Executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

### 3. Rodar em modo de desenvolvimento (hot-reload)
```bash
npm run dev
```
O servidor estará acessível em: `http://localhost:3333`

### 4. Executar os testes automatizados
```bash
npm test
```

### 5. Compilar para produção
```bash
npm run build
npm start
```

## 🔌 Rotas da API

### `GET /health`
Verifica a integridade da API.

### `POST /api/users/register`
Cadastro de usuário com validação de esquema via Zod e criptografia de senha via bcrypt.
- **Body:**
  ```json
  {
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "password": "senhaSegura123"
  }
  ```

### `POST /api/users/login`
Autenticação de usuário com validação via Zod e checagem de hash de senha via bcrypt.
- **Body:**
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senhaSegura123"
  }
  ```

### `GET /api/users`
Lista todos os usuários cadastrados (sem expor hashes de senhas).

