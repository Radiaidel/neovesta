FROM node:20 AS frontend-build

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ ./

RUN npm run build

RUN echo "Build output structure:" && \
    find dist -type f | grep -E "\.html$|\.js$|\.css$" | head -10 && \
    echo "Root directories:" && \
    ls -la

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=frontend-build /app/dist/frontend/browser/* /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN echo "Files in Nginx HTML directory:" && ls -la /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]