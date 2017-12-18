'use strict';

const {
    CheckYourAnswers: CYA,
    section
} = require('@hmcts/one-per-page/checkYourAnswers');

const { goTo, action } = require('@hmcts/one-per-page/flow');
const sections = require('steps/check-your-appeal/sections');
const request = require('superagent');
const paths = require('paths');

class CheckYourAppeal extends CYA {

    constructor(...args) {

        super(...args);
        this.sendToAPI = this.sendToAPI.bind(this);
    }

    static get path() {

        return paths.checkYourAppeal
    }

    sendToAPI() {

        // Temporary
        console.log(JSON.stringify(this.journey.values));
        console.log(this.journey.settings.apiUrl);

        return request.post(this.journey.settings.apiUrl).send(this.journey.values);
    }

    sections() {

        return [
            section(sections.benefitType,           { title: this.content.benefitType }),
            section(sections.mrnDate,               { title: this.content.compliance.mrnDate }),
            section(sections.noMRN,                 { title: this.content.compliance.noMRN }),
            section(sections.appellantDetails,      { title: this.content.appellantDetails }),
            section(sections.textMsgReminders,      { title: this.content.smsNotify.textMsgReminders }),
            section(sections.representative,        { title: this.content.representative }),
            section(sections.reasonsForAppealing,   { title: this.content.reasonsForAppealing }),
            section(sections.theHearing,            { title: this.content.hearing.theHearing }),
            section(sections.hearingArrangements,   { title: this.content.hearing.arrangements })
        ];
    }

    next() {

        return action(this.sendToAPI)
            .then(goTo(this.journey.steps.Confirmation))
    }
}

module.exports = CheckYourAppeal;
