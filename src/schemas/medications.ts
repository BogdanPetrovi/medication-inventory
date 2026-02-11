import { MedicationSchedules } from "@prisma/client";
import z from "zod";

export const Schedules = z.enum(
    Object.values(MedicationSchedules) as [MedicationSchedules, ...MedicationSchedules[]]
)

export const MedicationId = z.coerce.number().positive()