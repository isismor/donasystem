FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY myna/ /usr/share/nginx/html/myna/
COPY clubmyna/ /usr/share/nginx/html/clubmyna/
COPY system/ /usr/share/nginx/html/system/
COPY assets/ /usr/share/nginx/html/assets/
COPY nginx.conf /etc/nginx/conf.d/default.conf
