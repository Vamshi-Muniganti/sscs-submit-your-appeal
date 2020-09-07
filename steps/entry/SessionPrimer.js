const logger = require('logger');

const sessionPrimer = (req, res, next) => {

  function primeSession(retries) {
    try {
      const sessionExist = req.session !== undefined;

      if (sessionExist) {
        console.log('Found Session');
        return;
      }
      logger.trace('Session Primer Session is undefined. Attempting to recreate');
      req.session.generate();
      req.sessionCreated = true;
    } catch (exception) {
      logger.exception(`Session Primer Failed to read or recreate session due to ${exception.toString}`);
    }
    if(retries > 0) {
      primeSession(retries - 1);
    } else {
      res.redirect("bad.com");
    }
  }

  const retryAllowed = 3
  primeSession(retryAllowed);
  next();
};

module.exports = sessionPrimer;
