const { createServer } = require('http');
const strapi = require('@strapi/strapi');

strapi()
  .start()
  .then((strapiInstance) => {
    createServer(strapiInstance.server.http).listen(process.env.PORT || 1337);
  });
