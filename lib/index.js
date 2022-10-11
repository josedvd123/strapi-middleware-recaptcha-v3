"use strict";
const {isTokenValid} = require("./validator/recaptcha.validator");

module.exports = strapi => {
  return {
    /**
     * Initialize the hook
     */

    initialize() {
      let settings = strapi.config.middleware.settings;
      const recaptcha = settings["recaptcha-v3"] || {}
      if (recaptcha.enabled) {
        strapi.app.use(async (ctx, next) => {
          if (ctx.request.url === '/auth/local' && ctx.request.method === 'POST') {
            if (ctx.header["x-recaptcha-token"]) {
              const isValidToken = await isTokenValid(
                ctx.header["x-recaptcha-token"]
              );

              if (isValidToken) {
                await next();
              } else {
                ctx.unauthorized(`Not authorized!`);
              }
            } else {
              ctx.unauthorized(`Not authorized!`);
            }


          } else {
            await next();
          }

        });
      }
    }
  };
};
