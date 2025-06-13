import { neon, neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { EmergencyContact } from "./emergencyContacts";
import { RegistrationInfo } from "./types";
import { AllFormValues } from "./utils";

neonConfig.webSocketConstructor = ws; // <-- this is the key bit

export async function insertRegistration(values: AllFormValues) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  pool.on("error", (err) => console.error(err)); // deal with e.g. re-connect
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // check if the registration already exists
    const { rows } = await client.query(
      `SELECT * FROM registrations WHERE "paymentId" = $1`,
      [values.sessionId]
    );

    if (rows.length > 0) {
      return rows[0].id;
    }

    const {
      rows: [{ id: registrationId }],
    } = await client.query(
      `INSERT INTO registrations
        (
          "paymentId",
          "addressLine1",
          "addressLine2",
          "city",
          "stateProv",
          "postalZip",
          "country",
          "program",
          "firstName",
          "lastName",
          "email",
          "birthdate",
          "daysOfWeek",
          "allergies",
          "allowedOverTheCounterMedications",
          "arePhotosAllowed",
          "dietaryRestrictions",
          "doctorPhone",
          "epiPen",
          "familyDoctor",
          "friendCabinRequest",
          "gender",
          "hasBeenToCampBefore",
          "healthCareNumber",
          "height",
          "howDidYouHearAboutUs",
          "medicalConditions",
          "medicationsTreatments",
          "other",
          "parentSignature",
          "swimmingLevel",
          "tShirtSize",
          "weight",
          "siblingNameForDiscount",
          "regularMedicationsNotTakingAtCamp"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35)
        RETURNING id;
      `,
      [
        values.sessionId,
        values.address.line1,
        values.address.line2,
        values.address.city,
        values.address.stateProv,
        values.address.postalZip,
        values.address.country,
        values.program,
        values.firstName,
        values.lastName,
        values.email,
        values.birthdate,
        values.daysOfWeek,
        values.allergies,
        values.allowedOverTheCounterMedications,
        values.arePhotosAllowed,
        values.dietaryRestrictions,
        values.doctorPhone,
        values.epiPen,
        values.familyDoctor,
        values.friendCabinRequest,
        values.gender,
        values.hasBeenToCampBefore,
        values.healthCareNumber,
        values.height,
        values.howDidYouHearAboutUs,
        values.medicalConditions,
        values.medicationsTreatments,
        values.other,
        values.parentSignature,
        values.swimmingLevel,
        values.tShirtSize,
        values.weight,
        values.siblingNameForDiscount,
        values.regularMedicationsNotTakingAtCamp,
      ]
    );
    const emergencyContactValues = values.contacts?.map((contact) => [
      contact.email,
      contact.firstName,
      contact.lastName,
      registrationId, // Assuming `registrationId` is a variable available in scope
      contact.relationship,
      contact.phone,
    ]);

    if (emergencyContactValues && emergencyContactValues.length > 0) {
      const valuePlaceholders = emergencyContactValues
        .map(
          (_, index) =>
            `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${
              index * 6 + 4
            }, $${index * 6 + 5}, $${index * 6 + 6})`
        )
        .join(", ");

      const queryText = `
        INSERT INTO "emergencyContacts" (email, "firstName", "lastName", "forCamper", relationship, phone)
        VALUES ${valuePlaceholders}
        `;

      const queryParams = emergencyContactValues.flat();

      await client.query(queryText, queryParams);
    }

    await client.query("COMMIT");
    return registrationId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteRegistration(id: number) {
  const sql = neon(process.env.DATABASE_URL as string);
  const data = await sql`
    delete from registrations
    where id = ${id}
    returning id;
  `;
  return data[0].id;
}

export async function getRegistrations() {
  const sql = neon(process.env.DATABASE_URL as string);
  const data = await sql`
    SELECT registrations.*, "emergencyContacts"."firstName" AS "contactFirstName", "emergencyContacts"."lastName" AS "contactLastName", "emergencyContacts"."email" AS "contactEmail", "emergencyContacts"."phone" AS "contactPhone", "emergencyContacts"."relationship" AS "contactRelationship"
    FROM registrations
    LEFT JOIN "emergencyContacts" ON registrations.id = "emergencyContacts"."forCamper"
  `;

  const contactsMap = data.reduce((acc, row) => {
    const oldContacts = acc[row.id] ?? [];
    acc[row.id] = [
      ...oldContacts,
      {
        email: row.contactEmail,
        firstName: row.contactFirstName,
        lastName: row.contactLastName,
        forCamper: row.id,
        relationship: row.contactRelationship,
        phone: row.contactPhone,
      },
    ];
    return acc;
  }, {} as Record<string, EmergencyContact[]>);
  const registrationsMap = data.reduce((acc, row) => {
    acc[row.id] = {
      ...row,
      emergencyContacts: contactsMap[row.id],
    };
    return acc;
  }, {} as Record<string, RegistrationInfo>);

  const registrations = Object.keys(registrationsMap).map(
    (key) => registrationsMap[key]
  );

  return registrations;
}
