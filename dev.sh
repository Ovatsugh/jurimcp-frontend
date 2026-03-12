#!/bin/bash

# Portal Developer - Scripts de Desenvolvimento

case "$1" in
  "dev")
    echo "🚀 Iniciando servidor de desenvolvimento..."
    npm start
    ;;
  "build")
    echo "🔨 Fazendo build de produção..."
    npm run build
    ;;
  "install")
    echo "📦 Instalando dependências..."
    npm install
    ;;
  "test")
    echo "🧪 Executando testes..."
    npm run test
    ;;
  "lint")
    echo "🔍 Verificando código..."
    npx ng lint
    ;;
  *)
    echo "Portal Developer - Scripts Disponíveis:"
    echo ""
    echo "  ./dev.sh install  - Instalar dependências"
    echo "  ./dev.sh dev      - Iniciar servidor de desenvolvimento"
    echo "  ./dev.sh build    - Build de produção"
    echo "  ./dev.sh test     - Executar testes"
    echo "  ./dev.sh lint     - Verificar código"
    echo ""
    ;;
esac