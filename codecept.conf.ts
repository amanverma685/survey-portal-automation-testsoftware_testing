import expect from "expect";

export const config: CodeceptJS.MainConfig = {
  tests: './*_test.ts',
  output: './output',
  helpers: {
    REST: {
      endpoint: 'http://172.16.132.25:8090',
      defaultHeaders: {
        // 'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBiYmQyOTllODU2MmU3MmYyZThkN2YwMTliYTdiZjAxMWFlZjU1Y2EiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdnRzdXJ2ZXktZGNiYTAiLCJhdWQiOiJ2dHN1cnZleS1kY2JhMCIsImF1dGhfdGltZSI6MTcwMTA2OTc3NSwidXNlcl9pZCI6IlVTRVI1MzUxNDY4MSIsInN1YiI6IlVTRVI1MzUxNDY4MSIsImlhdCI6MTcwMTA2OTc3NSwiZXhwIjoxNzAxMDczMzc1LCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7fSwic2lnbl9pbl9wcm92aWRlciI6ImN1c3RvbSJ9fQ.kOGvHFjEMrGxYeybd_79Pa82EfJj9RXJGqktVr9_EC6og2pzrvjkWv6R3JA8vg058gMF1hCMdkSnsT2l3R-BxI8JnJU-gL8fhAhpwqmqAmJONlfGOn_F4_yD5FVf71mQTcUTclIh8SuHipR1Xfn5mJt_yJ8roR_pEfVBRMu6sgrZu59MfHoe9ihQsYihQVZQe2wRCR9AtrRDFGAoglGawuBjTjAlXJmm9LUjuKivn_S6OWgDS6RxPb2wzKt-cjAW3v8x3MJhPMxYL0IWjazRTEwSd759XKkSog0h2-ynQWSuEV1aeM6uViGcS1PYou4I0Q1Mnqb0BgZvaCaKE1oNVw',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    },
    ChaiWrapper: {
      require: 'codeceptjs-chai',
    },
    JSONResponse: {}
  },
  mocha: {
    reporterOptions: {
      chai: {
        expect
      }
    }
  },
  include: {
    I: './steps_file'
  },
  name: 'survey-portal-automation-test'
}