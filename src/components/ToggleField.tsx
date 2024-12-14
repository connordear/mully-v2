import { Label } from "@radix-ui/react-label";
import { forwardRef, useState } from "react";
import { FormDescription } from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";

type ToggleFieldPropsType = {
  id: string;
  toggleLabel: string;
  fieldLabel: string;
  yesLabel?: string;
  noLabel?: string;
  value: string;
  defaultValue?: string;
  offValue?: string;
  onChange: (value: string) => void;
};
// eslint-disable-next-line react/display-name
const ToggleField = forwardRef<
  React.ElementRef<typeof RadioGroup>,
  ToggleFieldPropsType
>(
  (
    {
      id,
      toggleLabel,
      fieldLabel,
      yesLabel = "Yes",
      noLabel = "No",
      value,
      defaultValue = "",
      offValue = "",
      onChange,
    }: ToggleFieldPropsType,
    ref
  ) => {
    const isEnabled = value !== offValue;
    const [prevValue, setPrevValue] = useState<string>(defaultValue);

    return (
      <>
        <div className="flex-col items-center">
          <FormDescription className="mb-3">{toggleLabel}</FormDescription>
          <RadioGroup
            ref={ref}
            onValueChange={(v: "yes" | "no") => {
              return onChange(v === "yes" ? prevValue : offValue);
            }}
            value={value === offValue ? "no" : "yes"}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${id}-yes`} />
              <Label htmlFor={`${id}-yes`}>{yesLabel}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${id}-no`} />
              <Label htmlFor={`${id}-no`}>{noLabel}</Label>
            </div>
          </RadioGroup>

          {isEnabled && (
            <>
              <FormDescription className="mt-3 mb-3">
                {fieldLabel}
              </FormDescription>
              <Textarea
                disabled={!isEnabled}
                value={value}
                onChange={(e) => {
                  setPrevValue(value);
                  onChange(e.currentTarget.value);
                }}
              />
            </>
          )}
        </div>
      </>
    );
  }
);

export default ToggleField;
