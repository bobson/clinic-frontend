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
