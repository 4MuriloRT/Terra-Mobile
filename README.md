# Terra Mobile

Aplicativo móvel para gerenciamento agrícola, complementar à plataforma web Terra Manager.

## 🌾 Sobre o Projeto

**Terra Mobile** oferece aos agricultores uma forma ágil e intuitiva de gerenciar suas operações de campo diretamente do celular. O aplicativo permite o controle total sobre fazendas, cultivares, e todo o ciclo de plantio, incluindo a gestão detalhada de análises de solo e a visualização de recomendações agronômicas.

## ✨ Funcionalidades

  - **Dashboard Dinâmico:** Visualização de informações essenciais como clima, cotação da soja e as últimas notícias do agronegócio.
  - **Autenticação de Usuário:** Sistema completo de registro e login de usuários com persistência de sessão.
  - **Gerenciamento de Fazendas:** CRUD completo para criação, listagem, edição e exclusão de fazendas.
  - **Gerenciamento de Cultivos:** CRUD completo para cadastro detalhado, edição e exclusão de cultivares.
  - **Fluxo Completo de Plantio:**
      - **Navegação Guiada:** Um fluxo multi-etapas que guia o usuário desde a seleção da cultura e da fazenda até o registro detalhado.
      - **Listagem Contextual:** Visualização de plantios existentes filtrados por cultura e fazenda.
      - **Formulário Abrangente:** Registro de dezenas de parâmetros do plantio, incluindo dados base, irrigação, adubação, defensivos e custos.
      - **Edição e Exclusão:** Funcionalidades completas para atualizar e remover registros de plantio.
  - **Análise de Solo Integrada:**
      - **Criação e Edição via Modal:** Um formulário acessível diretamente da tela de plantio permite adicionar ou editar uma análise de solo de forma opcional.
      - **Associação Automática:** A análise criada ou editada é automaticamente vinculada ao plantio.
      - **Visualização de Resultados Calculados:** Um botão dedicado (🌐) nos cards de plantio abre uma tela com os resultados e recomendações agronômicas processadas pelo backend, incluindo:
          - Cálculo de Calagem.
          - Recomendação de Adubação (NPK).
          - Tabela de Comparativo de Nutrientes (Análise vs. Ideal).

## 🚀 Tecnologias Utilizadas

  - **React Native**: Para o desenvolvimento de uma aplicação móvel nativa para Android e iOS.
  - **Expo**: Para facilitar o desenvolvimento, build e deploy da aplicação.
  - **TypeScript**: Para garantir um código mais robusto, seguro e de fácil manutenção.
  - **React Navigation**: Para o gerenciamento de rotas e navegação entre telas.
  - **Context API**: Para o gerenciamento de estado global, como a autenticação do usuário.

## 🏁 Como Começar

### 🔧 Pré-requisitos

  - [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
  - [Git](https://git-scm.com/)
  - Expo CLI: `npm install -g expo-cli`
  - (Opcional) Android Studio / Xcode para builds nativos.

### ⚙️ Setup e Execução

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/joaopedrofreitas9/terra-mobile.git
    cd terra-mobile
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**

      - A aplicação requer conexão com o servidor backend. O endereço da API deve ser configurado no arquivo `src/services/api.ts`.
      - **É crucial atualizar a constante `API_BASE_URL` para o IP da máquina local que está executando o servidor.**

    <!-- end list -->

    ```typescript
    // Em: src/services/api.ts
    const API_BASE_URL = "http://SEU_IP_LOCAL:3000"; 
    ```

4.  **Execute o servidor de desenvolvimento:**

    ```bash
    npx expo start
    ```

      - Após iniciar, escaneie o QR Code com o aplicativo **Expo Go** no seu celular (Android ou iOS).

### 📜 Scripts Disponíveis

  - `npm start`: Inicia o Metro Bundler para desenvolvimento com Expo Go.
  - `npm run android`: Compila e executa a aplicação em um emulador/dispositivo Android.
  - `npm run ios`: Compila e executa a aplicação em um simulador/dispositivo iOS (requer macOS).
  - `npm run web`: Inicia a versão web do aplicativo.