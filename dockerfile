FROM node:latest as build

WORKDIR /usr/local/src/OT-editor
COPY ./ /usr/local/src/OT-editor

RUN npm install
RUN npm run build

# Serve app using nginx
FROM nginx:latest

# Replace nginx default output
COPY --from=build /usr/local/src/OT-editor/dist/ot-editor /usr/share/nginx/html
EXPOSE 80
EXPOSE 443