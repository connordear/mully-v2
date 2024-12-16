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

export function useSelectedPrice(
  programs: Program[] | undefined,
  camperForm: UseFormReturn<CamperInfo>
) {
  const selectedProgram = useSelectedProgram(programs, camperForm);
  const selectedPriceId = camperForm.watch("priceId");
  const selectedPrice = useMemo(() => {
    if (selectedProgram && selectedPriceId) {
      return (
        selectedProgram.weekPrices?.find(
          (price) => price.id === selectedPriceId
        ) ??
        selectedProgram.dayPrices?.find((price) => price.id === selectedPriceId)
      );
    }
    return undefined;
  }, [selectedProgram, selectedPriceId]);

  return selectedPrice;
}
