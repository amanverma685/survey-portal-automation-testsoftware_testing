import expect from 'expect';
import responseSchema from './schemas/create_survey'
import payload from './payload/create_survey.json'
import axios from 'axios';
import getRequesterToken from './utils/get_requester_token';
import getSurveyDraftSchema from './schemas/get_survey_draft';
import publishSurveyResponseSchema from './schemas/publish_survey';
import getConstantresponseSchema from './schemas/constants';

Feature('1. Should create draft survey.');

let surveyId: string;
let completionCode: string;

Scenario('Fetching constant', async ({ I }) => {
    const response = await I.sendGetRequest('/admin/constants');
    I.seeResponseCodeIsSuccessful();
    var validationResult = await getConstantresponseSchema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
});

Scenario('Creating draft survey', async ({ I }) => {
    const requesterToken = await getRequesterToken();
    const response = await I.sendPostRequest('/requester/surveys/draft', payload, {
        "Authorization": requesterToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    });
    surveyId = response?.data?.data?.id
    console.log("Created survey " + surveyId)
    I.seeResponseCodeIsSuccessful();
    var validationResult = await responseSchema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
});

Scenario('Getting draft survey', async ({ I }) => {
    const requesterToken = await getRequesterToken();
    const response = await I.sendGetRequest('/requester/surveys/' + surveyId, {
        "Authorization": requesterToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    var validationResult = await getSurveyDraftSchema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
});

Scenario('Publishing draft survey', async ({ I }) => {
    const requesterToken = await getRequesterToken();
    const response = await I.sendPutRequest('/requester/surveys/publish/' + surveyId, {}, {
        "Authorization": requesterToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    var validationResult = await publishSurveyResponseSchema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
});
