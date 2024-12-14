import { NO_ALLERGIES, NO_MEDICAL_CONDITIONS } from "@/lib/medical";
import { Program, RegistrationInfo } from "@/lib/types";
import { ForwardedRef, forwardRef } from "react";
import LabelDisplay from "./LabelDisplay";
import "./RegistrationPrintout.css";

const secondColumnWidth = "170px";

type RegistrationPrintoutPropsType = {
  program: Program | undefined;
  data: RegistrationInfo[];
};
const RegistrationPrintout = forwardRef(
  (
    { data }: RegistrationPrintoutPropsType,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div ref={ref} className="w-full">
        {data.map((d) => (
          <div
            key={d.id}
            className="w-full flex flex-col gap-4 justify-space-between page-block"
            style={{
              border: "1px solid black",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div className="flex w-full gap-4">
              <div className="flex flex-col gap-1 w-1/3">
                <LabelDisplay
                  label="Name"
                  content={`${d.firstName} ${d.lastName}`}
                />
                <LabelDisplay label="Gender" content={d.gender} />
                <LabelDisplay label="Email" content={d.email} />
                <LabelDisplay
                  label="Address"
                  content={
                    <>
                      <p>{d.addressLine1}</p>
                      <p>{d.addressLine2}</p>
                      <p>
                        {d.city}, {d.stateProv} {d.postalZip}
                      </p>
                      <p>{d.country}</p>
                    </>
                  }
                />
              </div>
              <div className="flex-1">
                <LabelDisplay
                  label="Swimming Level"
                  content={d.swimmingLevel}
                  columnWidth={secondColumnWidth}
                />
                <LabelDisplay
                  label="Has Been to Camp"
                  content={d.hasBeenToCampBefore ? "Yes" : "No"}
                  columnWidth={secondColumnWidth}
                />
                <LabelDisplay
                  label="Cabin Request"
                  content={d.friendCabinRequest}
                  columnWidth={secondColumnWidth}
                />
                <LabelDisplay
                  label="T-Shirt Size"
                  content={d.tShirtSize}
                  columnWidth={secondColumnWidth}
                />
                <LabelDisplay
                  label="Photos Allowed"
                  content={d.arePhotosAllowed ? "Yes" : "No"}
                  columnWidth={secondColumnWidth}
                />
              </div>
            </div>
            <div className="px-5">
              <h1 className="font-semibold mb-1">Emergency Contacts</h1>
              <div className="flex flex-row gap-4 w-full">
                {d.emergencyContacts.map((e, i) => (
                  <div key={i} className="flex-1">
                    <p>
                      {e.firstName} {e.lastName} ({e.relationship})
                    </p>
                    <p>{e.phone}</p>
                    <p>{e.email}</p>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="px-5"
              style={{
                display:
                  (d.allergies === NO_ALLERGIES || !d.allergies) &&
                  (d.medicalConditions === NO_MEDICAL_CONDITIONS ||
                    !d.medicalConditions) &&
                  !d.dietaryRestrictions &&
                  !d.other
                    ? "none"
                    : "block",
              }}
            >
              <h1 className="font-semibold mb-3">Medical Summary</h1>
              <div className="flex flex-col gap-4 w-full justify-start">
                <LabelDisplay
                  label="Allergies"
                  content={d.allergies}
                  hidden={d.allergies === NO_ALLERGIES}
                  stacked
                />
                <LabelDisplay
                  label="Dietary Restrictions"
                  content={d.dietaryRestrictions}
                  stacked
                />
                <LabelDisplay
                  label="Medical Conditions"
                  hidden={d.medicalConditions === NO_MEDICAL_CONDITIONS}
                  content={d.medicalConditions}
                  stacked
                />
                <LabelDisplay label="Other" content={d.other} stacked />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);
RegistrationPrintout.displayName = "RegistrationPrintout";

export default RegistrationPrintout;
