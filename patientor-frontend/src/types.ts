import { z } from "zod";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

const genderSchema = z.nativeEnum(Gender);

const diagnosisSchema = z.object({
  code: z.string(),
  name: z.string(),
  latin: z.string().optional()
});

export type DiagnosisEntry = z.infer<typeof diagnosisSchema>;

const dateSchema = z.coerce.date().transform((date) => date.toISOString().split('T')[0]);

const baseDetailEntryToPatientSchema = z.object({
  id: z.string(),
  description: z.string(),
  date: dateSchema,
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional()
});

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

const healthCheckRatingSchema = z.nativeEnum(HealthCheckRating);

export enum DetailEntryToPatientType {
  HealthCheck = "HealthCheck",
  Hospital = "Hospital",
  OccupationalHealthcare = "OccupationalHealthcare"
}

const detailEntryToPatientTypeSchemma = z.nativeEnum(DetailEntryToPatientType);

const healthCheckEntrySchema = baseDetailEntryToPatientSchema.extend({
  type: z.literal(DetailEntryToPatientType.HealthCheck),
  healthCheckRating: healthCheckRatingSchema
});
export type HealthCheckEntry = z.infer<typeof healthCheckEntrySchema>;

const hospitalEntrySchema = baseDetailEntryToPatientSchema.extend({
  type: z.literal(DetailEntryToPatientType.Hospital),
  discharge: z.object({
    date: dateSchema,
    criteria: z.string()
  })
});
export type HospitalEntry = z.infer<typeof hospitalEntrySchema>;

const occupationalHealthcareEntrySchema = baseDetailEntryToPatientSchema.extend({
  type: z.literal(DetailEntryToPatientType.OccupationalHealthcare),
  employerName: z.string().min(3).max(150),
  sickLeave: z.object({
    startDate: dateSchema,
    endDate: dateSchema,
  }).optional()
});
export type OccupationalHealthcareEntry = z.infer<typeof occupationalHealthcareEntrySchema>;

const detailEntryToPatientSchema = z.discriminatedUnion("type", [
  healthCheckEntrySchema,
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema
]);

const detailEntryNoIdToPatientSchema = z.discriminatedUnion("type", [
  healthCheckEntrySchema.omit({id: true}),
  hospitalEntrySchema.omit({id: true}),
  occupationalHealthcareEntrySchema.omit({id: true})
]);

export type DetailEntryToPatient = z.infer<typeof detailEntryToPatientSchema>;

export type DetailEntryNoIdToPatient = z.infer<typeof detailEntryNoIdToPatientSchema>;

const patientEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(50),
  occupation: z.string().min(3).max(150),
  gender: genderSchema,
  ssn: z.string().min(11).max(11),
  dateOfBirth: dateSchema,
  entries: z.array(detailEntryToPatientSchema).default([])
});

export type PatientEntry = z.infer<typeof patientEntrySchema>;

const patientFormValuesSchema = patientEntrySchema.omit({ id: true, entries: true });

export type PatientFormValues = z.infer<typeof patientFormValuesSchema>;

export interface onSubmitInterface{
  (values: unknown) : void;
}

export interface onCancelInterface{
  () : void
}

export default {
  genderSchema,
  diagnosisSchema,
  dateSchema,
  healthCheckRatingSchema,
  detailEntryToPatientTypeSchemma,
  detailEntryToPatientSchema,
  patientEntrySchema,
  patientFormValuesSchema,
  healthCheckEntrySchema,
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
  detailEntryNoIdToPatientSchema
};