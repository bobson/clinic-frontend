"use client";

import { useQuery, useMutation } from "@apollo/client";
import { Appointment, Patient } from "@/types";
import { GET_APPOINTMENTS, DELETE_APPOINTMENT, GET_PATIENTS } from "@/graphql";
import ListPage from "@/components/ListPage";
import AppointmentForm from "./AppointmentForm";

export default function AppointmentsPage() {
  const { data, loading, error, refetch } = useQuery<{
    appointments: Appointment[];
  }>(GET_APPOINTMENTS);

  const {
    data: patientsData,
    loading: patientsLoading,
    error: patientsError,
  } = useQuery<{ patients: Patient[] }>(GET_PATIENTS);

  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT);

  const columns = [
    {
      title: "Patient",
      dataIndex: ["patient", "name"],
      key: "patientName",
      render: (_: any, record: Appointment) =>
        record.patient?.name || "Unknown",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (dateStr: string) => {
        if (!dateStr) return "N/A";
        try {
          const date = new Date(dateStr);
          return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(date);
        } catch {
          return "Invalid date";
        }
      },
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
    },
  ];

  return (
    <ListPage<Appointment, { patients: Patient[] }>
      title="Appointments"
      data={data?.appointments || []}
      loading={loading || patientsLoading}
      error={error || patientsError}
      onDelete={async (id) => {
        await deleteAppointment({ variables: { id } });
      }}
      columns={columns}
      FormComponent={AppointmentForm}
      extraFormProps={{ patients: patientsData?.patients || [] }}
      refetch={refetch}
      drawerWidth={360}
    />
  );
}
