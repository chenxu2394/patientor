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

const hospitalEntrySchema = baseDetailEntryToPatientSchema.extend({
  type: z.literal(DetailEntryToPatientType.Hospital),
  discharge: z.object({
    date: dateSchema,
    criteria: z.string()
  })
});

const occupationalHealthcareEntrySchema = baseDetailEntryToPatientSchema.extend({
  type: z.literal(DetailEntryToPatientType.OccupationalHealthcare),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: dateSchema,
    endDate: dateSchema,
  }).optional()
});

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
  name: z.string(),
  dateOfBirth: dateSchema,
  ssn: z.string(),
  gender: genderSchema,
  occupation: z.string(),
  entries: z.array(detailEntryToPatientSchema).default([])
});

export type PatientEntry = z.infer<typeof patientEntrySchema>;

export type NonSensitivePatientEntry =
  Omit<PatientEntry, 'ssn' | 'entries'>;

const patientEntryNoIdSchema = patientEntrySchema.omit({id: true});

export type PatientEntryNoID = z.infer<typeof patientEntryNoIdSchema>;

export default {
  genderSchema,
  diagnosisSchema,
  dateSchema,
  healthCheckRatingSchema,
  detailEntryToPatientTypeSchemma,
  detailEntryToPatientSchema,
  patientEntrySchema,
  patientEntryNoIdSchema,
  healthCheckEntrySchema,
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
  detailEntryNoIdToPatientSchema
};