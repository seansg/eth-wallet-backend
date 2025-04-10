FROM node:18

ARG APP_ROOT=/app
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR ${APP_ROOT}

COPY . .

RUN yarn install
RUN npx prisma generate
RUN npx prisma migrate deploy

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start"]