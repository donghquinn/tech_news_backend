FROM node:20.2-alpine3.17 AS builder
# 2
WORKDIR /app
# 3
COPY . .
# 4
RUN yarn
# 5
RUN yarn build

# STEP 2
#6
FROM node:20.2-alpine3.17
#7
WORKDIR /app

#8
ENV NODE_ENV production

#9
COPY --from=builder /app ./

#10
CMD ["yarn","start"]