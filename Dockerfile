FROM node:22-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN rm -rf src
RUN mv build src
RUN npx prisma generate
RUN npm install --omit=dev
CMD [ "npm", "start" ]