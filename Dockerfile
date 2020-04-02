FROM node:alpine AS builder


WORKDIR /Chat-Backend

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

RUN npm install

COPY . .

EXPOSE 3000
CMD /wait && npm start