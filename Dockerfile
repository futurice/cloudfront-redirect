From node:7-alpine
LABEL maintainer kimmo.ahokas@futurice.com

EXPOSE 8000
ENV LISTEN_PORT=8000

RUN adduser -h /var/app -D app
WORKDIR /var/app

COPY package.json /var/app
RUN npm install

COPY . /var/app
RUN chown -R app:app /var/app
RUN chmod -R 755 /var/app

CMD ["node", "app.js"]
