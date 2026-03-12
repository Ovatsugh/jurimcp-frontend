# Portal Developer - Frontend

Portal de desenvolvedores para gerenciamento de API Keys e acesso ao MCP Server.

## Funcionalidades

- ✅ **Autenticação**: Sistema de login e registro com JWT
- ✅ **Dashboard**: Interface completa para desenvolvedores
- ✅ **Gerenciamento de API Keys**: Criar, visualizar e revogar keys
- ✅ **Interface Moderna**: Built com Angular 21 + Tailwind CSS

## Tecnologias

- **Frontend**: Angular 21 (Standalone Components)
- **Styling**: Tailwind CSS
- **HTTP Client**: Angular HttpClient com interceptors
- **Routing**: Angular Router com guards
- **Forms**: Reactive Forms

## Estrutura do Projeto

```
src/
├── app/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   └── home/
│   └── shared/
│       ├── guards/
│       ├── interceptors/
│       ├── models/
│       └── services/
```

## Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento**:
   ```bash
   npm start
   ```

3. **Acessar**: http://localhost:4200

## API Endpoints

O frontend consome as seguintes APIs do backend:

### Autenticação
- `POST /api/developer/register` - Criar conta
- `POST /api/developer/login` - Fazer login
- `GET /api/developer/me` - Dados do usuário

### API Keys
- `GET /api/developer/keys` - Listar API keys
- `POST /api/developer/keys` - Criar nova API key
- `DELETE /api/developer/keys/{key}/revoke` - Revogar API key
- `POST /api/developer/keys/exchange-token` - Trocar key por JWT

## Configuração

A aplicação está configurada para se conectar com o backend Laravel em:
- **Base URL**: `http://localhost:8000/api/developer`

Para alterar, edite os serviços em `src/app/shared/services/`.

## Recursos

### Guards
- `authGuard`: Protege rotas autenticadas
- `guestGuard`: Protege rotas para não-autenticados

### Interceptors
- `authInterceptor`: Adiciona automaticamente o token Bearer nas requisições

### Serviços
- `AuthService`: Gerenciamento de autenticação e estado do usuário
- `ApiKeysService`: CRUD de API keys

## Deploy

Para build de produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/developer/`.