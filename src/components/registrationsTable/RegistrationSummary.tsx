import { NO_ALLERGIES } from "@/lib/medical";
import { Program, RegistrationInfo } from "@/lib/types";
import { getBirthdays } from "@/utils/dateUtils";

type RegistrationSummaryPropsType = {
  program: Program | undefined;
  data: RegistrationInfo[];
};

const RegistrationSummary = ({
  data,
  program,
}: RegistrationSummaryPropsType) => {
  const allergies = data
    .filter((d) => d.allergies && d.allergies !== NO_ALLERGIES)
    .map((d) => `${d.firstName} ${d.lastName} - ${d.allergies}`);

  const dietaryRestrictions = data
    .filter((d) => d.dietaryRestrictions)
    .map((d) => `${d.firstName} ${d.lastName} - ${d.dietaryRestrictions}`);

  const cabinRequests = data
    .filter((d) => d.friendCabinRequest)
    .map((d) => `${d.firstName} ${d.lastName} - ${d.friendCabinRequest}`);

  const tShirtCounts = data.reduce((acc, d) => {
    const size = d.tShirtSize;
    if (!size) return acc;
    if (!acc[size]) acc[size] = 0;
    acc[size]++;
    return acc;
  }, {} as Record<string, number>);

  const noPhotos = data.filter((d) => !d.arePhotosAllowed);

  const firstTimers = data.filter((d) => !d.hasBeenToCampBefore);

  const birthdays = getBirthdays(program, data);

  return (
    <div className="grid grid-flow-row-dense gap-10 grid-cols-3 w-full">
      {allergies.length > 0 && (
        <div className="col-span-2">
          <h1 style={styles.header}>Allergies</h1>
          {allergies.map((a, i) => (
            <div key={i}>
              <p style={styles.summaryText}>{a}</p>
            </div>
          ))}
        </div>
      )}
      {
        <div>
          <h1 style={styles.header}>T-Shirt Size Counts</h1>
          {Object.entries(tShirtCounts).map(([size, count], i) => (
            <div key={i} className="flex-1">
              <p style={styles.summaryText}>
                {size}: {count}
              </p>
            </div>
          ))}
        </div>
      }

      {dietaryRestrictions.length > 0 && (
        <div className="col-span-2">
          <h1 style={styles.header}>Dietary Restrictions</h1>
          {dietaryRestrictions.map((d, i) => (
            <div key={i}>
              <p style={styles.summaryText}>{d}</p>
            </div>
          ))}
        </div>
      )}
      {firstTimers.length > 0 && (
        <div>
          <h1 style={styles.header}>First Timers</h1>
          {firstTimers.map((d, i) => (
            <div key={i} className="flex-1">
              <p style={styles.summaryText}>
                {d.firstName} {d.lastName}
              </p>
            </div>
          ))}
        </div>
      )}
      {cabinRequests.length > 0 && (
        <div>
          <h1 style={styles.header}>Cabin Requests</h1>
          <div className="flex-col">
            {cabinRequests.map((c, i) => (
              <div key={i} className="flex-1">
                <p style={styles.summaryText}>{c}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {noPhotos.length > 0 && (
        <div>
          <h1 style={styles.header}>No Photos</h1>
          {noPhotos.map((d, i) => (
            <div key={i} className="flex-1">
              <p style={styles.summaryText}>
                {d.firstName} {d.lastName}
              </p>
            </div>
          ))}
        </div>
      )}
      {birthdays.length > 0 && (
        <div>
          <h1 style={styles.header}>Birthdays</h1>
          {birthdays.map((b, i) => (
            <div key={i} className="flex-1">
              <p
                style={styles.summaryText}
              >{`${b.firstName} ${b.lastName} - ${b.birthdate}`}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginTop: "1rem",
    marginBottom: "0.5rem",
  },
  summaryText: {
    display: "flex",
    fontSize: "1rem",
    marginBottom: "0.5rem",
  },
};

export default RegistrationSummary;
