const https = require("https");

const isTokenValid = token => {
  return new Promise(async (resolve, reject) => {

    if (token) {
      let settings = strapi.config.middleware.settings;
      const recaptcha = settings["recaptcha-v3"] || {}
      const secretKey = recaptcha.RECAPTCHA_SERET_KEY;

      const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

      https.get(verificationURL, googleResponse => {

        let rawData = "";
        googleResponse.on("data", chunk => {
          rawData += chunk;
        });
        googleResponse.on("end", function () {
          try {
            var parsedData = JSON.parse(rawData);
            if (parsedData.success === true) {
              resolve(true);
            } else {
              resolve(false);
            }
          } catch (e) {
            resolve(false);
          }
        })


      });
    } else {
      resolve(false);
    }
  });
};

module.exports = {
  isTokenValid
};
