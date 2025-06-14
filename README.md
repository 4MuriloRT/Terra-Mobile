
# Terra Mobile

Aplicativo de dashboard para gerenciamento agrícola.

**Stack Principal:** React Native | Expo | TypeScript | React Navigation

## 🔧 Pré-requisitos

-   Node.js (LTS)
-   NPM / Yarn
-   Expo CLI: `npm install -g expo-cli`
-   Git
-   Android Studio / Xcode (para builds nativos)

## ⚠️ Configuração Essencial do Backend

A aplicação requer conexão com um servidor backend. O endereço IP está fixado no código e **precisa ser atualizado** para o IP da máquina local que está executando o servidor.

**Arquivos para modificar:**
-   `src/services/api.ts`
-   `src/pages/SignIn/index.tsx`
-   `src/pages/Register/index.tsx`

**Altere a seguinte constante nos arquivos listados acima:**
```typescript
// Substitua pelo IP da sua máquina local
const API_BASE_URL = "http://SEU_IP_LOCAL:3000";
```

## ⚙️ Setup e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/joaopedrofreitas9/terra-mobile.git
    cd terra-mobile
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm start
    ```
    -   Após iniciar, escaneie o QR Code com o aplicativo **Expo Go**.
    -   Alternativamente, use os scripts abaixo para builds nativos.

## 📜 Scripts Disponíveis

-   `npm start`: Inicia o Metro Bundler para desenvolvimento com Expo Go.
-   `npm run android`: Compila e executa a aplicação em um emulador/dispositivo Android.
-   `npm run ios`: Compila e executa a aplicação em um simulador/dispositivo iOS (requer macOS).
-   `npm run web`: Inicia a versão web do aplicativo.