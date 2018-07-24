const applicationInsights = require('applicationinsights');
const config = require('config');

const enable = () => {
  const iKey = config.get('appInsights.instrumentationKey');
  applicationInsights.setup(iKey).start();
};

const trackException = exception => {
  applicationInsights.defaultClient.trackException({ exception });
};

module.exports = {
  enable,
  trackException
};
