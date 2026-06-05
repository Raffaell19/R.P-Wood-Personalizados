import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sobre: resolve(__dirname, 'sobre.html'),
        colecao: resolve(__dirname, 'colecao.html'),
        produtos: resolve(__dirname, 'produtos.html'),
        carrinho: resolve(__dirname, 'carrinho.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        contato: resolve(__dirname, 'contato.html'),
      },
    },
  },
});
