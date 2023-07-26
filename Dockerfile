#
# --- base image ---
FROM node:20.2-alpine3.17 as base

# install curl/timezone
RUN apk --no-cache add curl tzdata && \
  cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
  echo "Asia/Seoul" > /etc/timezone

# set workdir
WORKDIR /home/node

# copy package.json, package-lock.json into image
COPY yarn.lock package.json ./

# package.json에 작성한 그대로 설치
RUN yarn --frozen-lockfile --production;

# 캐시 제거
RUN rm -rf ./.next/cache

# --- release ---
FROM base AS builder

WORKDIR /home/node

COPY --from=base ./node_modules ./node_modules

COPY . .

RUN yarn run build

FROM builder as runner

WORKDIR /home/node

COPY --from=builder ./dist .

CMD ["node", "main.js"]
