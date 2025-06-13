import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { convertToTitleCase } from "@/lib/stringUtils";
import { Program, RegistrationInfo } from "@/lib/types";
import {
  ReactNode,
  RefObject,
  createRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "../ui/button";
import CopyButton from "../ui/copy-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import MedicalPrintout from "./MedicalPrintout";
import RegistrationPrintout from "./RegistrationPrintout";
import RegistrationSummary from "./RegistrationSummary";
import RegistrationTableRow from "./RegistrationTableRow";

const OMIT_COLUMNS = [
  "id",
  "program",
  "lastName",
  "paymentId",
  "created_at",
  "addressLine1",
  "addressLine2",
  "city",
  "stateProv",
  "postalZip",
  "country",
  "emergencyContacts",
];

type RegistrationsTablePropsType = {
  programs: Program[] | undefined;
  registrations: RegistrationInfo[] | undefined;
};

export type TableColumn<T> = {
  key: keyof T;
  header: ReactNode;
  render?: (row: RegistrationInfo) => string | ReactNode;
  headerStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
};

const RegistrationsTable = ({
  programs,
  registrations: data,
}: RegistrationsTablePropsType) => {
  const registrationPrintRef = createRef<Element>();
  const medicalPrintRef = createRef<Element>();
  const [selectedTab, setSelectedTab] = useState<string>();
  const selectedProgram = useMemo(
    () => programs?.find((p: Program) => selectedTab === p.name),
    [programs, selectedTab]
  );

  const programRegistrationLookup = useMemo(() => {
    const lookup =
      data?.reduce((acc, row, i) => {
        const programName =
          programs?.find((p) => p.id === row.program)?.name ?? `Program ${i}`;
        const oldRegs = acc[programName] ?? [];

        // check if the registration already exists
        if (oldRegs.some((r) => r.paymentId === row.paymentId)) {
          return acc;
        }

        acc[programName] = [...oldRegs, row];
        return acc;
      }, {} as Record<string, RegistrationInfo[]>) ?? {};

    return lookup;
  }, [data, programs]);

  const programsTabs = useMemo(() => {
    return Object.keys(programRegistrationLookup).map((key) => ({
      key,
      title: `${programRegistrationLookup[key].length} - ${key}`,
    }));
  }, [programRegistrationLookup]);

  const registrations = useMemo(() => {
    if (!selectedTab) return [];
    return programRegistrationLookup[selectedTab] ?? [];
  }, [programRegistrationLookup, selectedTab]);

  useEffect(() => {
    if (!selectedTab && programsTabs.length > 0) {
      setSelectedTab(programsTabs[0].key);
    }
  }, [programsTabs, selectedTab]);

  const programRegistrationsEmails = useMemo(() => {
    const emails: string[] = [];
    registrations.forEach((r) => {
      if (r.email) emails.push(r.email);
    });
    return emails.join("; ");
  }, [registrations]);

  const emergencyContactsEmails = useMemo(() => {
    const emails: string[] = [];
    registrations.forEach((row) => {
      row.emergencyContacts.forEach((contact) => {
        emails.push(contact.email);
      });
    });
    return emails.join("; ");
  }, [registrations]);

  const registrationColumns: TableColumn<RegistrationInfo>[] = [
    {
      key: "firstName",
      header: "Name",
      render: (row: RegistrationInfo) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: "email",
      header: (
        <>
          Email{" "}
          <CopyButton
            text={programRegistrationsEmails}
            hoverText="Copy All Emails"
          />
        </>
      ),
    },
    {
      key: "emergencyContacts",
      header: "Contact Name(s)",
      render: (row: RegistrationInfo) => (
        <div className="flex-col">
          {row.emergencyContacts.map((e, i) => (
            <div key={i} className="flex-1">
              {e.firstName} {e.lastName}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "emergencyContacts",
      header: "Contact Number(s)",
      render: (row: RegistrationInfo) => (
        <div className="flex-col">
          {row.emergencyContacts.map((e, i) => (
            <div key={i} className="flex-1">
              {e.phone}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "emergencyContacts",
      header: (
        <>
          Contact Email(s){" "}
          <CopyButton
            text={emergencyContactsEmails}
            hoverText="Copy All Emails"
          />
        </>
      ),
      render: (row: RegistrationInfo) => (
        <div className="flex-col">
          {row.emergencyContacts.map((e, i) => (
            <div key={i} className="flex-1">
              {e.email}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "addressLine1",
      header: "Address",
      headerStyle: { minWidth: "200px" },
      render: (row: RegistrationInfo) => (
        <div className="flex-col">
          <div>{row.addressLine1}</div>
          <div>{row.addressLine2}</div>
          <div>
            {row.city}, {row.stateProv}
          </div>
          <div>{row.postalZip}</div>
          <div>{row.country}</div>
        </div>
      ),
    },
  ];

  const defaultColumns: TableColumn<Partial<RegistrationInfo>>[] = Object.keys(
    data?.[0] ?? {}
  )
    .filter(
      (d) =>
        !registrationColumns.find((c) => c.key === d) &&
        !OMIT_COLUMNS.includes(d)
    )
    .map((key) => ({
      key: key as keyof RegistrationInfo,
      header: convertToTitleCase(key),
    }));

  const allColumns = [...registrationColumns, ...defaultColumns];

  const reactToPrintFnMedical = useReactToPrint({
    contentRef: medicalPrintRef as RefObject<HTMLDivElement>,
  });
  const reactToPrintFnRegistration = useReactToPrint({
    contentRef: registrationPrintRef as RefObject<HTMLDivElement>,
  });

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100% - 5rem)",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "2rem",
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
        }}
      >
        Mulhurst Registrations
      </h1>
      <div className="flex flex-row gap-4 justify-space-between w-full">
        <Select onValueChange={(v) => setSelectedTab(v)} value={selectedTab}>
          <SelectTrigger>
            <SelectValue>{selectedTab ?? "Select a program"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {programsTabs.map((row) => (
              <SelectItem key={row.key} value={row.key}>
                {row.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => reactToPrintFnRegistration()}>
          Print Camper Info
        </Button>
        <Button onClick={() => reactToPrintFnMedical()}>
          Print Medical Info
        </Button>
      </div>
      <div
        style={{
          display: "none",
        }}
      >
        <RegistrationPrintout
          ref={registrationPrintRef as RefObject<HTMLDivElement>}
          data={registrations}
          program={selectedProgram}
        />
        <MedicalPrintout
          ref={medicalPrintRef as RefObject<HTMLDivElement>}
          data={registrations}
          program={selectedProgram}
        />
      </div>
      <RegistrationSummary data={registrations} program={selectedProgram} />
      <Table
        style={{
          maxWidth: "1000px",
        }}
      >
        <TableHeader>
          <TableRow>
            {allColumns.map((col, i) => (
              <TableHead
                key={`${col.key}-${i}`}
                style={{ textWrap: "nowrap", ...col.headerStyle }}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations?.map((row) => (
            <RegistrationTableRow
              key={row.id}
              data={row}
              columns={allColumns}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RegistrationsTable;
