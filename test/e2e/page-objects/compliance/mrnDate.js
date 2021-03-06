function enterAnMRNDateAndContinue(commonContent, date) {
  const I = this;

  I.scrollPageToBottom();
  I.fillField('input[name*="day"]', date.date().toString());
  I.fillField('input[name*="month"]', (date.month() + 1).toString());
  I.fillField('input[name*="year"]', date.year().toString());
  I.click(commonContent.continue);
}

module.exports = { enterAnMRNDateAndContinue };
