
# io2019
[![Build Status](https://travis-ci.org/kasztaniaki/IO2019-web.svg?branch=master)](https://travis-ci.org/kasztaniaki/IO2019-web)

### Requirements

node.js >= 8.10.0

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Deployment

You need an `.env` configuration file:

```
VUE_APP_API_URL='url'
PORT=8080
```

Deploy by running

```
npm install
npm run build
node server.js
```


