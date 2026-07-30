# UOMO CATTIVO Frontend

Este proyecto está construido como una interfaz de tienda virtual moderna en React + TypeScript + Vite.

## Arquitectura

- Los datos mock se centralizan en la carpeta src/data.
- Las vistas consumen esos datos a través de servicios en src/services.
- El estado compartido de favoritos y carrito vive en src/context.
- Los componentes reutilizables están en src/components.

## Futuro backend

Cuando se integre un backend, solo será necesario reemplazar los archivos JSON en src/data por llamadas a API dentro de los servicios existentes en src/services, sin modificar la interfaz ni las páginas.

## Comandos

- npm install
- npm run dev
- npm run build
