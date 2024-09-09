FROM node AS builder

WORKDIR /app

COPY ./package.json /app

RUN npm install

COPY . /app

RUN npx tsc

FROM node

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 8080

CMD ["npm", "start"]