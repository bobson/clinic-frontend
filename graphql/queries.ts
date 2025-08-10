import { gql } from "@apollo/client";

export const GET_PATIENTS = gql`
  query GetPatients {
    patients {
      id
      name
      email
      phone
    }
  }
`;

export const GET_PATIENT = gql`
  query GetPatient($id: ID!) {
    patient(id: $id) {
      id
      name
      email
      phone
    }
  }
`;

export const GET_APPOINTMENTS = gql`
  query GetAppointments {
    appointments {
      id
      date
      reason
      patient {
        id
        name
      }
    }
  }
`;

export const GET_APPOINTMENT = gql`
  query GetAppointment($id: ID!) {
    appointment(id: $id) {
      id
      date
      reason
      patient {
        id
        name
      }
    }
  }
`;
