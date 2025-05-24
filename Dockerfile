FROM node:20-alpine AS build-env
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run tsc \
    && cd patientor-frontend \
    && npm ci \
    && npm run build \
    && cd .. \
    && npm prune --production

FROM gcr.io/distroless/nodejs20-debian12:nonroot AS runtime
WORKDIR /app

COPY --from=build-env /app/build ./build
COPY --from=build-env /app/patientor-frontend/dist ./dist
COPY --from=build-env /app/node_modules ./node_modules

USER nonroot
CMD ["build/src/index.js"]
