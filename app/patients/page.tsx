"use client";

import { useQuery, useMutation } from "@apollo/client";
import { Patient } from "@/types";
import { GET_PATIENTS, DELETE_PATIENT } from "@/graphql";
import ListPage from "@/components/ListPage";
import PatientForm from "./PatientForm";

export default function PatientsPage() {
  const { data, loading, error, refetch } = useQuery<{ patients: Patient[] }>(
    GET_PATIENTS
  );

  const [deletePatient] = useMutation(DELETE_PATIENT);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
  ];

  return (
    <ListPage
      title="Patients"
      data={data?.patients || []}
      loading={loading}
      error={error}
      onDelete={async (id) => {
        await deletePatient({ variables: { id } });
      }}
      columns={columns}
      FormComponent={PatientForm}
      refetch={refetch}
      drawerWidth={360}
    />
  );
}
