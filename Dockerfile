# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Instala deps
COPY package.json package-lock.json* ./
RUN npm install

# Copia o projeto e builda
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Instala apenas dependências de produção
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copia build e servidor
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js

# Railway injeta PORT; seu server.js já usa process.env.PORT
EXPOSE 3000

CMD ["node", "server.js"]
