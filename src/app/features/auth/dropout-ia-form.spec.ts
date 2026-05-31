import { buildDropoutPayload, DropoutFormValue } from './dropout-ia-form';

describe('buildDropoutPayload', () => {
  it('mapea los 21 campos a números', () => {
    const value: DropoutFormValue = {
      maritalStatus: 1,
      applicationMode: 2,
      applicationOrder: 1,
      course: 9,
      previousQualification: 3,
      nacionality: 1,
      motherQualification: 3,
      fatherQualification: 3,
      motherOccupation: 5,
      fatherOccupation: 5,
      displaced: 1,
      educationalSpecialNeeds: 0,
      debtor: 0,
      tuitionFeesUpToDate: 1,
      scholarshipHolder: 0,
      ageAtEnrollment: 18,
      international: 0,
      curricularUnits1stSemCredited: 0,
      curricularUnits1stSemEnrolled: 6,
      curricularUnits1stSemEvaluations: 6,
      curricularUnits1stSemApproved: 5,
    };
    const payload = buildDropoutPayload(value);
    expect(payload.maritalStatus).toBe(1);
    expect(payload.ageAtEnrollment).toBe(18);
    expect(payload.curricularUnits1stSemApproved).toBe(5);
    // 21 campos en el payload.
    expect(Object.keys(payload).length).toBe(21);
  });

  it('usa 0 como fallback para nulos', () => {
    const empty = {} as DropoutFormValue;
    const payload = buildDropoutPayload(empty);
    expect(payload.maritalStatus).toBe(0);
    expect(payload.international).toBe(0);
  });
});
