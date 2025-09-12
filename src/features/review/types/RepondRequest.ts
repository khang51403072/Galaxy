export interface RespondRequest {
  surveyId: string;
  employeeId: string;
  response: string;
  sendEmailAction: boolean;
  sendSmsAction: boolean;
}

