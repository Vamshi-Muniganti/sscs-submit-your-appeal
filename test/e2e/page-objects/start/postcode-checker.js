function enterPostcodeAndContinue(commonContent, postcode) {
  const I = this;

  I.retry({ retries: 3, minTimeout: 2000 }).fillField({ id: 'postcode' }, postcode);
  I.click(commonContent.continue);
  I.wait(2);
}

module.exports = { enterPostcodeAndContinue };
