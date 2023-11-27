import expect from 'expect';
import responseSchema from './schemas/create_survey'
import payload from './payload/create_survey_2'
import axios from 'axios';
import getRequesterToken from './utils/get_requester_token';
import getSurveyDraftSchema from './schemas/get_survey_draft';
import publishSurveyResponseSchema from './schemas/publish_survey';
import getConstantresponseSchema from './schemas/constants';
import getRespondentToken from './utils/get_respondent_token';
import get_assigned_survey_respondent_schema from './schemas/get_assigned_survey_respondent';
import accept_student_survey_by_respondent_payload from './payload/accept_student_survey_by_respondent';
import empty_schema from './schemas/empty_schema';
import start_survey_by_respondent from './payload/start_survey_by_respondent';
import complete_survey_by_respondent from './payload/complete_survey_by_respondent';
import four_hundred_schema from './schemas/four_hundred_schema';
import approve_survey_response_requester from './payload/approve_survey_response_requester';
import add_bonus_requester from './payload/add_bonus_requester';

Feature('Test survey end to end ');

let surveyId: string;
let completionCode: string;
let respondentPreviousCredits: number
let surveyCredits: number
let surveyBonus: number = 1.5

Scenario('Requester is able to fetch constants.', async ({ I }) => {
    const response = await I.sendGetRequest('/admin/constants');
    I.seeResponseCodeIsSuccessful();
    var validationResult = await getConstantresponseSchema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
});

Scenario('Requester is able to create a draft survey.', async ({ I }) => {
    const requesterToken = await getRequesterToken();
    const response = await I.sendPostRequest('/requester/surveys/draft', payload, {
        "Authorization": requesterToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    });
    surveyId = response?.data?.data?.id
    completionCode = response?.data?.data?.completionCode
    surveyCredits = response?.data?.data?.maxCredits
    console.log("Created survey " + surveyId + " with completion code " + completionCode)
    I.seeResponseCodeIsSuccessful();
    var validationResult = await responseSchema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
});

Scenario('Requester is able to get draft survey.', async ({ I }) => {
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

Scenario('Requester is able to publish draft survey.', async ({ I }) => {
    const requesterToken = await getRequesterToken();
    const response = await I.sendPutRequest('/requester/surveys/publish/' + surveyId, {}, {
        "Authorization": requesterToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    var validationResult = await publishSurveyResponseSchema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
});

Scenario('Respondent is able to see the published survey in assigned list.', async ({ I }) => {
    const respondentToken = await getRespondentToken();
    const response = await I.sendGetRequest('/respondent/surveys/' + surveyId, {
        "Authorization": respondentToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    var validationResult = await get_assigned_survey_respondent_schema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
    expect(response?.data?.data?.surveyStatus).toBe("Assigned")
});

Scenario('Respondent is able to accept the survey.', async ({ I }) => {
    const respondentToken = await getRespondentToken();
    const response = await I.sendPostRequest('/respondent/surveys/action', accept_student_survey_by_respondent_payload(surveyId), {
        "Authorization": respondentToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    var validationResult = await empty_schema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
});

Scenario('Survey status should change to Accepted after accepting the survey.', async ({ I }) => {
    const respondentToken = await getRespondentToken();
    const response = await I.sendGetRequest('/respondent/surveys/' + surveyId, {
        "Authorization": respondentToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    var validationResult = await get_assigned_survey_respondent_schema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
    expect(response?.data?.data?.surveyStatus).toBe("Accepted")
});

Scenario('Respondent is able to start the survey.', async ({ I }) => {
    const respondentToken = await getRespondentToken();
    const response = await I.sendPostRequest('/respondent/surveys/start', start_survey_by_respondent(surveyId), {
        "Authorization": respondentToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    var validationResult = await empty_schema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
});

Scenario('Survey status is changed to Started after starting the survey.', async ({ I }) => {
    const respondentToken = await getRespondentToken();
    const response = await I.sendGetRequest('/respondent/surveys/' + surveyId, {
        "Authorization": respondentToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    var validationResult = await get_assigned_survey_respondent_schema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
    expect(response?.data?.data?.surveyStatus).toBe("Started")
});

Scenario('Respondent is not able to see completion code in survey response.', async ({ I }) => {
    const respondentToken = await getRespondentToken();
    const response = await I.sendGetRequest('/respondent/surveys/' + surveyId, {
        "Authorization": respondentToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    var validationResult = await get_assigned_survey_respondent_schema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
    expect(response?.data?.data?.survey?.completionCode).toBe(null)
});

Scenario('Error is shown if invalid completion code is used to complete the survey.', async ({ I }) => {
    const respondentToken = await getRespondentToken();
    const response = await I.sendPostRequest('/respondent/surveys/complete', complete_survey_by_respondent(surveyId, "AAAA"), {
        "Authorization": respondentToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsClientError();
    var validationResult = await four_hundred_schema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
});

Scenario('Respondent is able to complete the survey.', async ({ I }) => {
    const respondentToken = await getRespondentToken();
    const response = await I.sendPostRequest('/respondent/surveys/complete', complete_survey_by_respondent(surveyId, completionCode), {
        "Authorization": respondentToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    // var validationResult = await four_hundred_schema.validateAsync(response?.data);
    // expect(validationResult?.error).toBeUndefined()
});

Scenario('Respondent is able to fetch credits balance.', async ({ I }) => {
    const respondentToken = await getRespondentToken();
    const response = await I.sendGetRequest('/respondent/credits', {
        "Authorization": respondentToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    respondentPreviousCredits = response?.data?.data?.credits
    // var validationResult = await four_hundred_schema.validateAsync(response?.data);
    // expect(validationResult?.error).toBeUndefined()
});

Scenario('Requester is able to approve survey response.', async ({ I }) => {
    const requesterToken = await getRequesterToken();
    const response = await I.sendPostRequest('/requester/surveys/responses/action', approve_survey_response_requester(surveyId), {
        "Authorization": requesterToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    var validationResult = await empty_schema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
});

Scenario('Requester is able to add bonus.', async ({ I }) => {
    const requesterToken = await getRequesterToken();
    const response = await I.sendPostRequest('/requester/surveys/add-bonus', add_bonus_requester(surveyId, surveyBonus), {
        "Authorization": requesterToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    var validationResult = await empty_schema.validateAsync(response?.data);
    expect(validationResult?.error).toBeUndefined()
});

Scenario('Respondent credit is increased after survey response acceptation.', async ({ I }) => {
    const respondentToken = await getRespondentToken();
    const response = await I.sendGetRequest('/respondent/credits', {
        "Authorization": respondentToken,
        'Accept': 'application/json',
    });
    I.seeResponseCodeIsSuccessful();
    // var validationResult = await four_hundred_schema.validateAsync(response?.data);
    expect(response?.data?.data?.credits).toBe(respondentPreviousCredits + surveyCredits + surveyBonus)
});