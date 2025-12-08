
```markdown
# 🌐 Projeto Imobiliaria - Frontend (imobil-front)

Frontend da aplicação Imobiliaria desenvolvido em **Next.js** com **TypeScript**, **Tailwind CSS** e **ShadCN UI**, integrado com uma API REST backend em Spring Boot.

## 🎯 Funcionalidades

### 👤 Gestão de Usuários
- ✅ Cadastro de novos usuários com criptografia de senha.
- ✅ Autenticação e login seguro via sessão.
- ✅ Listagem de todos os usuários (administradores).
- ✅ Detalhamento de usuário específico.
- ✅ Edição de dados cadastrais (usuário logado ou admin).
- ✅ Exclusão de usuários (admin ou proprietário).
- ✅ Recuperação de senha (em desenvolvimento).
- ✅ Edição de perfil próprio (usuário logado).

### 📦 Gestão de Bairros
- ✅ Listagem de todos os bairros.
- ✅ Detalhamento de bairro específico.
- ✅ Cadastro de novos bairros (usuário logado).
- ✅ Edição de bairros (usuário logado ou admin).
- ✅ Exclusão de bairros (usuário logado ou admin).

### 🏢 Gestão de Tipos de Imóveis
- ✅ Listagem de todos os tipos de imóveis.
- ✅ Detalhamento de tipo específico.
- ✅ Cadastro de novos tipos de imóveis (usuário logado).
- ✅ Edição de tipos de imóveis (usuário logado ou admin).
- ✅ Exclusão de tipos de imóveis (usuário logado ou admin).

### 🏠 Gestão de Imóveis
- ✅ Listagem de todos os imóveis (pública e protegida).
- ✅ Listagem de imóveis por usuário logado ("Meus Imóveis").
- ✅ Detalhamento de imóvel específico.
- ✅ Cadastro de novos imóveis (usuário logado).
- ✅ Edição de imóveis (usuário proprietário ou admin).
- ✅ Exclusão de imóveis (usuário proprietário ou admin).
- ✅ Upload de fotos para imóveis (via formulário multipart).
- ✅ Listagem de fotos associadas a um imóvel.
- ✅ Definição de foto de capa.
- ✅ Controle de ordem de exibição das fotos.

### 🔐 Controle de Acesso
- Áreas restritas protegidas por sessão de login.
- Usuários só podem editar/excluir seus próprios imóveis/bairros/tipos (exceto admin).
- Sessão é verificada via `AuthContext` e interceptores.

## 🛠️ Tecnologias Utilizadas

### Frameworks e Bibliotecas
- **[Next.js](https://nextjs.org/)** (v16.0.2) - Framework React para renderização no servidor e cliente.
- **[React](https://react.dev/)** - Biblioteca JavaScript para construção de interfaces de usuário.
- **[TypeScript](https://www.typescriptlang.org/)** (opcionalmente, se estiver usando) - Superconjunto de JavaScript com tipagem estática.
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário para estilização rápida e responsiva.
- **[ShadCN UI](https://ui.shadcn.com/)** - Biblioteca de componentes acessíveis e estilizados baseados em Radix UI e Tailwind.
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones SVG como componentes React.
- **[Sonner](https://sonner.emilkowal.ski/)** - Biblioteca de notificações (toasts) elegantes e acessíveis.
- **[Axios](https://axios-http.com/)** - Cliente HTTP para requisições à API REST.

### Ambiente de Desenvolvimento
- **[Node.js](https://nodejs.org/)** (v21+) - Ambiente de execução JavaScript no servidor.
- **[npm](https://www.npmjs.com/)** ou **[yarn](https://yarnpkg.com/)** - Gerenciadores de pacotes.
- **[VS Code](https://code.visualstudio.com/)** - Editor de código recomendado.

## 📁 Estrutura de Pastas

```
imob-front/
├── public/                 # Arquivos estáticos (imagens, favicons, etc.)
├── src/
│   ├── app/                # Páginas e layouts do Next.js App Router
│   │   ├── globals.css     # Estilos globais do Tailwind
│   │   ├── layout.js       # Layout principal da aplicação
│   │   ├── page.js         # Página inicial
│   │   ├── login/          # Página de login
│   │   ├── cadastro/       # Página de cadastro
│   │   ├── dashboard/      # Página do painel do usuário
│   │   ├── usuarios/       # Páginas de gestão de usuários
│   │   ├── bairros/        # Páginas de gestão de bairros
│   │   ├── tipos-imoveis/  # Páginas de gestão de tipos de imóveis
│   │   └── imoveis/        # Páginas de gestão de imóveis
│   ├── components/         # Componentes reutilizáveis
│   │   ├── common/         # Componentes genéricos (Header, Footer)
│   │   ├── ui/             # Componentes do ShadCN UI
│   │   ├── usuarios/       # Componentes específicos de usuário
│   │   ├── bairros/        # Componentes específicos de bairro
│   │   ├── tiposImoveis/   # Componentes específicos de tipo de imóvel
│   │   └── imoveis/        # Componentes específicos de imóvel
│   ├── context/            # Contextos globais (ex: AuthContext)
│   │   └── AuthContext.js
│   ├── hooks/              # Hooks personalizados (ex: useAuth)
│   ├── services/           # Serviços para comunicação com a API
│   │   ├── authService.js
│   │   ├── usuarioService.js
│   │   ├── bairroService.js
│   │   ├── tiposImoveisService.js
│   │   └── imoveisService.js
│   ├── lib/                # Funções utilitárias (ex: utils.js)
│   └── types/              # Tipos TypeScript (se aplicável)
├── .env.local              # Variáveis de ambiente locais (ex: NEXT_PUBLIC_API_URL)
├── next.config.mjs         # Configurações do Next.js
├── tailwind.config.js      # Configurações do Tailwind CSS
├── components.json         # Configurações do ShadCN CLI
├── package.json            # Dependências e scripts do projeto
└── README.md               # Este arquivo
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Backend da aplicação (`imobiliaria`) rodando em `http://localhost:8080`

### 1. Clonar o Repositório

```bash
git clone <url-do-seu-repositorio>
cd imob-front
```

### 2. Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto `imob-front` com o seguinte conteúdo:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

*   `NEXT_PUBLIC_API_URL`: URL base da sua API REST backend (Spring Boot).

### 4. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Acesse a aplicação em: `http://localhost:3000`

## 🌐 Endpoints da API Consumidos

### Autenticação
- `POST /auth/login` - Realizar login de usuário.
- `POST /auth/logout` - Encerrar sessão.
- `GET /auth/status` - Verificar status de login.

### Usuários
- `GET /users` - Listar todos os usuários.
- `GET /users/{id}` - Buscar usuário por ID.
- `POST /users` - Criar novo usuário.
- `PUT /users/{id}` - Atualizar usuário.
- `DELETE /users/{id}` - Excluir usuário.

### Bairros
- `GET /bairros` - Listar todos os bairros.
- `GET /bairros/{id}` - Buscar bairro por ID.
- `POST /bairros` - Criar novo bairro.
- `PUT /bairros/{id}` - Atualizar bairro.
- `DELETE /bairros/{id}` - Excluir bairro.

### Tipos de Imóveis
- `GET /tipos-imoveis` - Listar todos os tipos.
- `GET /tipos-imoveis/{id}` - Buscar tipo por ID.
- `POST /tipos-imoveis` - Criar novo tipo.
- `PUT /tipos-imoveis/{id}` - Atualizar tipo.
- `DELETE /tipos-imoveis/{id}` - Excluir tipo.

### Imóveis
- `GET /imoveis` - Listar todos os imóveis.
- `GET /imoveis/{id}` - Buscar imóvel por ID.
- `POST /imoveis` - Criar novo imóvel.
- `PUT /imoveis/{id}` - Atualizar imóvel.
- `DELETE /imoveis/{id}` - Excluir imóvel.
- `GET /imoveis/meus` - Listar imóveis do usuário logado.
- `GET /imoveis/usuario/{id}` - Listar imóveis de um usuário específico.

### Fotos de Imóveis
- `GET /fotos-imoveis` - Listar todas as fotos.
- `GET /fotos-imoveis/{id}` - Buscar foto por ID.
- `POST /fotos-imoveis` - **Upload de nova foto** (multipart/form-data).
- `PUT /fotos-imoveis/{id}` - Atualizar foto.
- `DELETE /fotos-imoveis/{id}` - Excluir foto.
- `GET /fotos-imoveis/imovel/{idImovel}` - Listar fotos de um imóvel específico.

### Exemplo de requisição de upload de foto:

```http
POST /fotos-imoveis
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="arquivo"; filename="foto.jpg"
Content-Type: image/jpeg

[data_binária_da_imagem_aqui]
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="dados"

{"imovelId": 1, "capa": true, "ordem": 1}
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

## 🎨 Design e Estilo

O frontend utiliza:

- **ShadCN UI** para componentes consistentes e acessíveis.
- **Tailwind CSS** para estilização responsiva e personalizável.
- **Gradientes e sombras** para um visual moderno e profissional.
- **Ícones do Lucide React** para melhorar a experiência visual.
- **Toasts do Sonner** para feedbacks claros e amigáveis.
- **Layout responsivo** que funciona bem em dispositivos móveis e desktop.

## 🔐 Segurança

- **Autenticação baseada em sessão** com cookies.
- **Token de sessão (`JSESSIONID`)** enviado automaticamente com `withCredentials: true`.
- **Controle de acesso** nos componentes frontend com base no `AuthContext`.
- **Validação de permissão** antes de executar ações críticas (editar/excluir).
- **Senhas criptografadas no backend** (BCrypt).

## 🧪 Testes

(Adicione esta seção se tiver testes unitários/integração)

## 📈 Próximas Melhorias

- [ ] Implementar paginação nas listagens.
- [ ] Adicionar filtros avançados.
- [ ] Melhorar a interface de upload de fotos (pré-visualização, arrastar e soltar).
- [ ] Adicionar sistema de busca global.
- [ ] Implementar internacionalização (i18n).
- [ ] Documentar a API REST com Swagger/OpenAPI.

## 👨‍💻 Desenvolvedor

**Weverton F. Mesquita**
- GitHub: [@wevertonf](https://github.com/wevertonf)
- Email: wevertoff@yahoo.com

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e não possui licença específica. Sinta-se livre para estudar e modificar o código.

## 🙏 Agradecimentos

- Professor Ederson e colegas da disciplina de Programação Web IV.
- Comunidade de desenvolvedores React e Next.js.
- Documentação oficial das tecnologias utilizadas.
- Agentes de IA como o Qwen3-Coder para auxílio no desenvolvimento.

## 🆘 Suporte

Para dúvidas ou problemas com a execução do projeto, entre em contato através do GitHub Issues ou envie um email.
```

---

## 📤 Como enviar para o GitHub

1.  **Adicione o arquivo `README.md` à pasta `imob-front`.**
2.  **No terminal, dentro da pasta `imob-front`:**
    ```bash
    git add README.md
    git commit -m "Add README.md for frontend project"
    git push origin main # ou a branch que você estiver usando
    ```
3.  **Se quiser que ele fique na raiz do repositório (junto com `imobiliaria`), copie o conteúdo deste `README.md` para o `README.md` principal do repositório `wevertonf/web4` e adicione uma seção como:**

    ```markdown
    # 🌐 Projeto Imobiliaria (web4)

    Repositório para o projeto completo de uma imobiliária desenvolvido em Java (Spring Boot) e Next.js.

    ## 📁 Estrutura

    - [`imobiliaria/`](./imobiliaria/): Backend em Java com Spring Boot, JPA e MySQL.
    - [`imob-front/`](./imob-front/): Frontend em Next.js com Tailwind e ShadCN UI.

    ## 📖 Documentação

    - [Backend (Spring Boot)](./imobiliaria/README.md)
    - [Frontend (Next.js)](#frontend-imob-front) <-- Coloque o conteúdo do README acima aqui

    # ... resto do README principal ...
    ```
