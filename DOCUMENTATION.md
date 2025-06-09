
# Dashboard de Projetos Rockfeller

## 📋 Visão Geral

Este é um sistema de gerenciamento de projetos desenvolvido para a Rockfeller, construído com tecnologias modernas para oferecer uma interface intuitiva e responsiva para controle e acompanhamento de projetos.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript que adiciona tipagem estática
- **Vite** - Build tool e dev server ultra-rápido
- **Tailwind CSS** - Framework CSS utilitário para estilização
- **shadcn/ui** - Biblioteca de componentes React reutilizáveis

### Bibliotecas Principais
- **@tanstack/react-query 5.56.2** - Gerenciamento de estado e cache para requisições
- **react-router-dom 6.26.2** - Roteamento para aplicações React
- **lucide-react 0.462.0** - Biblioteca de ícones SVG
- **recharts 2.12.7** - Biblioteca para gráficos e visualizações
- **date-fns 3.6.0** - Utilitários para manipulação de datas

### UI/UX
- **@radix-ui** - Componentes primitivos acessíveis
- **class-variance-authority** - Utilitário para variantes de classes CSS
- **tailwindcss-animate** - Animações com Tailwind CSS
- **sonner** - Sistema de notificações toast

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes React reutilizáveis
│   ├── ui/              # Componentes base do shadcn/ui
│   ├── ProjectDashboard.tsx    # Componente principal do dashboard
│   ├── ProjectCard.tsx         # Card individual de projeto
│   ├── ProjectModal.tsx        # Modal para criar/editar projetos
│   ├── ProjectTimeline.tsx     # Visualização em timeline
│   └── DashboardStats.tsx      # Estatísticas do dashboard
├── pages/               # Páginas da aplicação
│   ├── Index.tsx        # Página inicial
│   └── NotFound.tsx     # Página 404
├── lib/                 # Utilitários e configurações
│   └── utils.ts         # Funções utilitárias
├── hooks/               # Hooks customizados
├── App.tsx              # Componente raiz da aplicação
├── main.tsx             # Ponto de entrada da aplicação
└── index.css            # Estilos globais e design system
```

## 🗺️ Rotas da Aplicação

### Configuração de Rotas (`App.tsx`)

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

#### Rotas Disponíveis:
- **`/`** - Página principal com o dashboard de projetos
- **`/*`** - Catch-all para páginas não encontradas (404)

## 🧩 Componentes Principais

### 1. ProjectDashboard (`src/components/ProjectDashboard.tsx`)
**Funcionalidade:** Componente principal que gerencia todo o dashboard de projetos.

**Estado Principal:**
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  tasks: Task[];
  team: string[];
}

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignee: string;
}
```

**Funcionalidades:**
- ✅ Listagem de projetos em grid ou timeline
- ✅ Busca e filtros por nome/descrição
- ✅ Ordenação por nome, progresso ou data
- ✅ Criação e edição de projetos
- ✅ Tema claro/escuro
- ✅ Notificações por email para mudanças
- ✅ Estatísticas do dashboard

### 2. ProjectCard (`src/components/ProjectCard.tsx`)
**Funcionalidade:** Exibe informações de um projeto individual em formato de card.

**Recursos:**
- Progresso visual com barra de progresso
- Informações da equipe
- Data de entrega
- Ações rápidas

### 3. ProjectModal (`src/components/ProjectModal.tsx`)
**Funcionalidade:** Modal para criação e edição de projetos.

**Campos do Formulário:**
- Título do projeto
- Descrição
- Data de entrega
- Membros da equipe
- Tarefas associadas

### 4. DashboardStats (`src/components/DashboardStats.tsx`)
**Funcionalidade:** Exibe estatísticas gerais dos projetos.

**Métricas:**
- Total de projetos
- Projetos em andamento
- Projetos concluídos
- Progresso médio

### 5. ProjectTimeline (`src/components/ProjectTimeline.tsx`)
**Funcionalidade:** Visualização dos projetos em formato de linha do tempo.

## 🎨 Sistema de Design

### Paleta de Cores
O projeto utiliza um sistema de design baseado em CSS custom properties:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221 81% 45%;
  --secondary: 210 40% 96.1%;
  /* ... outras variáveis */
}
```

### Cores Customizadas
- **Orange:** `#FFBF33` - Cor principal da marca Rockfeller
- **Blue:** `#0068DE` - Cor secundária
- **Primary:** `#0B33DE` - Cor primária do sistema

### Componentes de UI
Todos os componentes seguem o padrão do **shadcn/ui**:
- Button, Input, Select, Dialog
- Progress, Badge, Card
- Toast notifications
- Hover cards e popovers

## 📧 Sistema de Notificações

### Envio de Emails
O sistema possui integração para envio de notificações por email:

```typescript
const sendNotificationEmail = async (project: Project, action: 'created' | 'updated') => {
  const emailData = {
    to: 'wade.venga@rockfeller.com.br',
    subject: `Projeto ${action === 'created' ? 'Criado' : 'Atualizado'}: ${project.title}`,
    message: `...conteúdo do email...`
  };
  // Integração com Supabase necessária para envio real
};
```

**Eventos que disparam emails:**
- ✅ Criação de novo projeto
- ✅ Atualização de projeto existente
- ✅ Mudanças no progresso do projeto

## 🔧 Configurações

### Vite (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react(), componentTagger()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  }
});
```

### Tailwind CSS (`tailwind.config.ts`)
- Configuração do tema personalizado
- Animações customizadas
- Paleta de cores da Rockfeller
- Breakpoints responsivos

## 🚦 Estados da Aplicação

### Estados Globais
- **projects**: Array de todos os projetos
- **searchTerm**: Termo de busca atual
- **sortBy**: Critério de ordenação
- **view**: Tipo de visualização (grid/timeline)
- **isDarkMode**: Estado do tema escuro

### Estados de Interface
- **isModalOpen**: Controle do modal de projeto
- **editingProject**: Projeto sendo editado
- **filteredAndSortedProjects**: Projetos processados

## 📱 Responsividade

O dashboard é totalmente responsivo com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptações por Dispositivo:
- Grid responsivo (1-3 colunas)
- Navigation adaptável
- Formulários otimizados para touch
- Tipografia escalonável

## 🔐 Boas Práticas Implementadas

### Código
- ✅ TypeScript strict mode
- ✅ Componentes funcionais com hooks
- ✅ Props tipadas com interfaces
- ✅ Separação de responsabilidades
- ✅ Reutilização de componentes

### Performance
- ✅ Lazy loading de componentes
- ✅ Memoização com useCallback
- ✅ Otimização de re-renders
- ✅ Bundle splitting automático

### UX/UI
- ✅ Loading states
- ✅ Error boundaries
- ✅ Feedback visual
- ✅ Animações suaves
- ✅ Acessibilidade (WCAG)

## 🔮 Próximos Passos

### Integrações Recomendadas
1. **Supabase** - Para backend e autenticação
2. **Email Service** - Para notificações reais
3. **File Upload** - Para anexos de projetos
4. **Real-time Updates** - Para colaboração

### Funcionalidades Futuras
- [ ] Autenticação de usuários
- [ ] Permissões por papel
- [ ] Chat em tempo real
- [ ] Relatórios avançados
- [ ] Integrações com calendário
- [ ] API REST completa

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <repository-url>

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview da build
- `npm run lint` - Verificação de código

## 📄 Licença

Este projeto foi desenvolvido para a Rockfeller e é propriedade da empresa.

---

**Desenvolvido com ❤️ usando React + TypeScript + Tailwind CSS**
