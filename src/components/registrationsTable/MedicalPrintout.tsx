import { Program, RegistrationInfo } from "@/lib/types";
import { ForwardedRef, forwardRef } from "react";
import LabelDisplay from "./LabelDisplay";
import "./RegistrationPrintout.css";

const secondColumnWidth = "170px";
const medColumnWidth = "150px";

type MedicalPrintoutPropsType = {
  program: Program | undefined;
  data: RegistrationInfo[];
};
const MedicalPrintout = forwardRef(
  ({ data }: MedicalPrintoutPropsType, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div ref={ref} className="w-full">
        {data.map((d) => (
          <div
            key={d.id}
            className="w-full flex flex-col gap-4 justify-space-between page-break"
            style={{
              padding: "1rem",
            }}
          >
            <h1 className="px-5 font-bold text-2xl">
              {d.firstName} {d.lastName}
            </h1>
            <div className="flex w-full gap-4 px-2">
              <div className="flex flex-col gap-1 w-1/3 px-1">
                <LabelDisplay label="Birthdate" content={d.birthdate} />
                <LabelDisplay label="Gender" content={d.gender} />
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
            <div className="px-5">
              <h1 className="font-semibold mb-3">Medical Summary</h1>
              <div className="flex flex-col gap-4 w-full justify-start">
                <div className="flex flex-row">
                  <div className="flex flex-col">
                    <LabelDisplay
                      label="Health Care #"
                      content={d.healthCareNumber}
                      columnWidth={medColumnWidth}
                    />
                    <LabelDisplay
                      label="Family Doctor"
                      content={`${d.familyDoctor} (${d.doctorPhone})`}
                      columnWidth={medColumnWidth}
                    />
                  </div>
                  <div className="flex flex-col">
                    <LabelDisplay
                      label="Height"
                      content={d.height}
                      columnWidth={medColumnWidth}
                    />
                    <LabelDisplay
                      label="Weight"
                      content={d.weight}
                      columnWidth={medColumnWidth}
                    />
                  </div>
                </div>
                <LabelDisplay label="Allergies" content={d.allergies} stacked />
                <LabelDisplay label="EpiPen" content={d.epiPen} stacked />
                <LabelDisplay
                  label="Medical Conditions"
                  content={d.medicalConditions}
                  stacked
                />
                <LabelDisplay
                  label="Medications"
                  content={d.medicationsTreatments}
                  stacked
                />
                <LabelDisplay
                  label="Regular Medications NOT Taking At Camp"
                  content={d.regularMedicationsNotTakingAtCamp}
                  stacked
                />
                <LabelDisplay
                  label="Allowed Over the Counter Medications"
                  content={d.allowedOverTheCounterMedications?.join(", ")}
                  stacked
                />

                <LabelDisplay
                  label="Dietary Restrictions"
                  content={d.dietaryRestrictions}
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
MedicalPrintout.displayName = "MedicalPrintout";

export default MedicalPrintout;
