FROM node:18-alpine AS builder
# Copy app files
COPY . /app

WORKDIR /app
RUN npm install
# Build the app
RUN npm run build

# start a new build stage so that the final image will only contain
# the compiled release and other runtime necessities
FROM nginx:1.19.7-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]