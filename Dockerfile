FROM node:22-alpine as builder
WORKDIR /usr/app
COPY package.json ./
RUN npm install
ADD . .
RUN npx prisma generate
RUN npm run build
RUN npm install --omit=dev

FROM node:22-alpine
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/build/* ./src
CMD [ "src/server.handler" ]
