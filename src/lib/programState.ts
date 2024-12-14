import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { CamperInfo } from "./camper";
import { Program } from "./types";

export function useSelectedProgram(
  programs: Program[] | undefined,
  camperForm: UseFormReturn<CamperInfo>
) {
  const selectedProgramId = camperForm.watch("program");
  const selectedProgram = useMemo(() => {
    return programs?.find((program) => program.id === selectedProgramId);
  }, [programs, selectedProgramId]);
  return selectedProgram;
}
