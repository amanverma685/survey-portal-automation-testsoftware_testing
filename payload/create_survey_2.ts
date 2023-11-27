export default {
    "title": "Sample Survey",
    "description": "Sample Survey",
    "devices": [
        "mobile",
        "tablet",
        "desktop"
    ],
    "surveyUrl": "www.sample.com",
    "surveyTimeValue": "20",
    "surveyTimeUnit": "min",
    "creditsReward": 3,
    "studentsRequired": 20,
    "startDate": new Date().toISOString(),
    "endDate": new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    "recordIdMethod": "URLParameter",
    "parameters": [
        {
            "name": "Survey ID",
            "value": "SURVEY_ID"
        },
        {
            "name": "Student ID",
            "value": "STUDENT_ID"
        },
        {
            "name": "Session ID",
            "value": "SESSION_ID"
        }
    ],
    "studentsCriteria": {
        "studentsRequired": 20,
        "householdIncomeMax": 6000,
        "householdIncomeMin": 0
    }
}