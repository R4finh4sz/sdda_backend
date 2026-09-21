# sdda_backend

Backend em Node.js com TypeScript, Express, Zod, bcrypt, JWT e **Prisma ORM** com SQLite.
Arquitetura limpa organizada com **controllers** e **services**.

## 🚀 Tecnologias

- **Node.js** (v22+)
- **TypeScript**
- **Express 5**
- **Prisma ORM**: Modelagem de dados e queries tipadas
- **SQLite**: Banco de dados relacional
- **Zod**: Validação de requisições
- **bcryptjs**: Criptografia de senhas e e-mails com hash unidirecional
- **jsonwebtoken**: Emissão e verificação de tokens JWT
- **tsx**: Execução de TypeScript com hot-reload e testes

## 📁 Estrutura de Pastas

```
sdda_backend/
├── prisma/
│   └── schema.prisma             # Modelo Prisma e datasource SQLite
├── src/
│   ├── controllers/
│   │   └── auth/
│   │       └── AuthController.ts # Controlador HTTP de Login (validação Zod e resposta)
│   ├── services/
│   │   ├── auth/
│   │   │   └── AuthService.ts    # Lógica de login com Prisma: compara hashes e emite JWT
│   │   ├── hash/
│   │   │   └── HashService.ts    # Criptografia e comparação com bcrypt
│   │   ├── token/
│   │   │   └── TokenService.ts   # Geração e validação de JWT
│   │   └── seed/
│   │       └── SeedService.ts    # Provisionamento do usuário inicial a partir da .env via Prisma
│   ├── database/
│   │   └── Database.ts           # Instância e exportação do PrismaClient
│   ├── routes/
│   │   └── auth.routes.ts        # Rotas /api/auth/login e /health
│   ├── app.ts                    # Configuração da aplicação Express e middlewares
│   └── server.ts                 # Ponto de entrada e inicialização do servidor
├── test/
│   └── api.test.ts               # Suíte de testes de integração automatizados
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## ⚙️ Variáveis de Ambiente (.env)

```env
PORT=3333
DATABASE_URL="file:./database.sqlite"
JWT_SECRET=super_secret_jwt_key_sdda_backend_2026
JWT_EXPIRES_IN=1d

# Usuário Único Inicial (Provisionado automaticamente com e-mail e senha hasheados no banco)
DEFAULT_USER_FULL_NAME=Jacira
DEFAULT_USER_EMAIL=Jacira@bemestaranimal.com
DEFAULT_USER_PASSWORD=Jacira@123
```

---

## 🛠️ Comandos

- **Desenvolvimento:** `npm run dev`
- **Sincronizar Banco (Prisma):** `npx prisma db push`
- **Visualizar Banco (Prisma Studio):** `npx prisma studio`
- **Executar Testes:** `npm test`
- **Build de Produção:** `npm run build`
- **Iniciar Produção:** `npm start`