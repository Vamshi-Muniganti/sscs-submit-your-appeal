/* eslint-disable no-throw-literal  */
const { Page } = require('@hmcts/one-per-page');
const DateUtils = require('utils/DateUtils');

class DuplicateError extends Page {
  static get path() {
    return '/duplicate-case-error';
  }

  handler(req, res) {
    if (req.method === 'GET') {
      res.render(this.template, this.locals, (error, html) => {
        this.res.send(html);
      });
    }
  }

  get duplicateErrorMrnDate() {
    const d = this.req.session.MRNDate.mrnDate;
    return DateUtils.createMoment(d.day, DateUtils.getMonthValue(d), d.year).format('DD MMM YYYY');
  }
}

module.exports = DuplicateError;
