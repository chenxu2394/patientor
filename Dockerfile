FROM node:24-alpine AS build-env
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY patientor-frontend/package*.json ./patientor-frontend/
RUN npm ci --prefix patientor-frontend

COPY . .
RUN npm run lint \
    && npm run lint --prefix patientor-frontend \
    && npm run tsc \
    && npm run build --prefix patientor-frontend \
    && npm prune --production

FROM gcr.io/distroless/nodejs24-debian13:nonroot AS runtime
WORKDIR /app

COPY --from=build-env /app/build ./build
COPY --from=build-env /app/patientor-frontend/dist ./dist
COPY --from=build-env /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3001

USER nonroot
CMD ["build/src/index.js"]
