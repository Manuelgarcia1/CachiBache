import { MyReportsScreen } from "@features/reports";

const reports = [
  {
    title: "Entre Ríos 742",
    status: "PENDIENTE",
    date: "25 abr, 2025",
    location: "Entre Ríos 742",
  },
  {
    title: "Av. San Lorenzo 123",
    status: "EN REPARACION",
    date: "17 abr, 2025",
    location: "Av. San Lorenzo 123",
  },
  {
    title: "Boulevard Central 456",
    status: "FINALIZADO",
    date: "5 abr, 2025",
    location: "Boulevard Central 456",
  },
  {
    title: "Entre Ríos 742",
    status: "PENDIENTE",
    date: "25 abr, 2025",
    location: "Entre Ríos 742",
  },
  {
    title: "Av. San Lorenzo 123",
    status: "EN REPARACION",
    date: "17 abr, 2025",
    location: "Av. San Lorenzo 123",
  },
  {
    title: "Boulevard Central 456",
    status: "FINALIZADO",
    date: "5 abr, 2025",
    location: "Boulevard Central 456",
  },
  {
    title: "Entre Ríos 742",
    status: "PENDIENTE",
    date: "25 abr, 2025",
    location: "Entre Ríos 742",
  },
  {
    title: "Av. San Lorenzo 123",
    status: "EN REPARACION",
    date: "17 abr, 2025",
    location: "Av. San Lorenzo 123",
  },
  {
    title: "Boulevard Central 456",
    status: "FINALIZADO",
    date: "5 abr, 2025",
    location: "Boulevard Central 456",
  },
];

export default function ReportsTab() {
  return <MyReportsScreen reports={reports} />;
}