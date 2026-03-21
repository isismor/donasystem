FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY myna/ /usr/share/nginx/html/myna/
COPY assets/ /usr/share/nginx/html/assets/
COPY nginx.conf /etc/nginx/conf.d/default.conf
