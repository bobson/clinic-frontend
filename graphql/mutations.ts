import { gql } from "@apollo/client";

export const ADD_PATIENT = gql`
  mutation AddPatient($name: String!, $email: String!, $phone: String!) {
    addPatient(name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
    }
  }
`;

export const UPDATE_PATIENT = gql`
  mutation UpdatePatient(
    $id: ID!
    $name: String
    $email: String
    $phone: String
  ) {
    updatePatient(id: $id, name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
    }
  }
`;

export const DELETE_PATIENT = gql`
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id)
  }
`;

export const ADD_APPOINTMENT = gql`
  mutation AddAppointment($input: AddAppointmentInput!) {
    addAppointment(input: $input) {
      id
    }
  }
`;

export const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment($input: UpdateAppointmentInput!) {
    updateAppointment(input: $input) {
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

export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($id: ID!) {
    deleteAppointment(id: $id)
  }
`;
