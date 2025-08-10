export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AddPatientInput {
  name: string;
  email: string;
  phone: string;
}

export interface Appointment {
  id: string;
  date: string; // ISO string (from backend)
  reason: string;
  patient: Patient;
}

export interface AddAppointmentInput {
  date: string;
  reason: string;
  patientId: string;
}
