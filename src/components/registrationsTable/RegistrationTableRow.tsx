import { RegistrationInfo } from "@/lib/types";
import { TableCell, TableRow } from "../ui/table";
import { TableColumn } from "./RegistrationsTable";

type RegistrationTableRowPropsType = {
  data: RegistrationInfo;
  columns: TableColumn<RegistrationInfo>[];
};
const RegistrationTableRow = ({
  data,
  columns,
}: RegistrationTableRowPropsType) => {
  return (
    <TableRow>
      {columns.map((column, i) => (
        <TableCell
          key={`${column.key}-${i}`}
          style={{
            ...((data[column.key]?.toString().length || 0) > 30
              ? { minWidth: "200px" }
              : {}),
            ...column.cellStyle,
          }}
        >
          {column.render ? column.render(data) : data[column.key]?.toString()}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default RegistrationTableRow;
