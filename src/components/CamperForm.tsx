"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  CamperInfo,
  NO_SIBLING,
  heardAboutUsOptions,
  swimmingLevelOptions,
  tShirtSizeOptions,
} from "@/lib/camper";
import { useSelectedProgram } from "@/lib/programState";
import { Program } from "@/lib/types";
import { getDaysOfWeek } from "@/utils/dateUtils";
import { Label } from "@radix-ui/react-label";
import { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import ToggleField from "./ToggleField";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface CamperFormProps {
  programs: Program[];
  form: UseFormReturn<CamperInfo>;
  onSubmit: (values: CamperInfo) => void;
}

const CamperForm = ({
  form: camperForm,
  onSubmit,
  programs,
}: CamperFormProps) => {
  const selectedProgram = useSelectedProgram(programs, camperForm);
  function onSubmitCamperInfo(values: CamperInfo) {
    // ✅ This will be type-safe and validated.
    onSubmit(values);
  }

  const selectedProgramId = camperForm.watch("program");
  const selectedPriceId = camperForm.watch("priceId");
  const selectedPrice = useMemo(() => {
    if (selectedProgram && selectedPriceId) {
      return (
        selectedProgram.weekPrices.find(
          (price) => price.id === selectedPriceId
        ) ??
        selectedProgram.dayPrices?.find((price) => price.id === selectedPriceId)
      );
    }
    return undefined;
  }, [selectedProgram, selectedPriceId]);

  // const selectedDaysOfWeek = camperForm.watch("daysOfWeek");

  useEffect(() => {
    if (!selectedProgramId && programs.length) {
      camperForm.setValue("program", programs[0].id);
      camperForm.setValue("priceId", programs[0].defaultPriceId ?? "0");
    }
  }, [programs, selectedProgramId, camperForm]);

  useEffect(() => {
    if (selectedProgram && (!selectedPriceId || selectedPriceId === "0")) {
      camperForm.setValue("priceId", selectedProgram.defaultPriceId ?? "0");
    }
  }, [camperForm, selectedPriceId, selectedProgram]);

  const availablePrices = useMemo(() => {
    if (selectedProgram) {
      return [
        ...selectedProgram.weekPrices,
        ...(selectedProgram.dayPrices ?? []),
      ];
    }
    return [];
  }, [selectedProgram]);

  const availableDaysOfWeek = useMemo(() => {
    if (
      selectedProgram &&
      selectedProgram.dayPrices &&
      selectedProgram.startDate &&
      selectedProgram.endDate
    ) {
      return getDaysOfWeek(selectedProgram.startDate, selectedProgram.endDate);
    }
    return [];
  }, [selectedProgram]);

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Welcome to Mulhurst Camp registration! We are trying a new online
          registration portal this year. Your progress will be saved as you work
          through the forms.
          <br />
          <br />
          If you wish to register a camper for multiple weeks, your information
          will be saved after each submission, so you can register with the same
          information for a separate camp.
          <br />
          <br />
          You can reset your progress at any time by clicking the &quot;Clear
          Form&quot; button.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...camperForm}>
          <form
            onSubmit={camperForm.handleSubmit(onSubmitCamperInfo)}
            className="space-y-8"
          >
            <FormField
              control={camperForm.control}
              name="program"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      onChange={(e) => {
                        const newProgram = programs.find(
                          (program) => program.id === e.currentTarget.value
                        );
                        field.onChange(e.currentTarget.value);
                        if (newProgram) {
                          camperForm.setValue(
                            "daysOfWeek",
                            getDaysOfWeek(
                              newProgram?.startDate,
                              newProgram?.endDate
                            )
                          );
                        }
                      }}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      style={{ maxWidth: "100%" }}
                    >
                      {programs.map((program) => (
                        <option
                          key={program.id}
                          value={program.id}
                          style={{ maxWidth: "100%" }}
                          className="text-wrap"
                        >
                          {program.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {availablePrices.length > 1 && (
              <FormField
                name="priceId"
                control={camperForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Options</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        style={{ maxWidth: "100%" }}
                      >
                        {availablePrices.map((price) => (
                          <option key={price.id} value={price.id}>
                            {price.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {selectedPrice?.isDayPrice && (
              <FormField
                name="daysOfWeek"
                control={camperForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Days Camper Will Attend ({field.value?.length || 0} days
                      selected)
                    </FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="multiple"
                        value={field.value}
                        onValueChange={(v) => {
                          field.onChange(v);
                        }}
                      >
                        {availableDaysOfWeek.map((dayOfWeek) => (
                          <ToggleGroupItem
                            key={dayOfWeek}
                            value={dayOfWeek}
                            aria-label={`Toggle ${dayOfWeek}`}
                          >
                            {dayOfWeek}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={camperForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row justify-between gap-5">
              <FormField
                control={camperForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Camper First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={camperForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Camper Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={camperForm.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birthdate</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={camperForm.control}
              name="address.line1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={camperForm.control}
              name="address.line2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row justify-between gap-5">
              <FormField
                control={camperForm.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={camperForm.control}
                name="address.stateProv"
                render={({ field }) => (
                  <FormItem className="flex-2">
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-5">
              <FormField
                control={camperForm.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel> Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={camperForm.control}
                name="address.postalZip"
                render={({ field }) => (
                  <FormItem className="flex-2">
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={camperForm.control}
              name="swimmingLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Swimming Level</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      style={{ maxWidth: "100%" }}
                    >
                      {swimmingLevelOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={camperForm.control}
              name="hasBeenToCampBefore"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Has the camper been to camp before?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(v: "yes" | "no") => {
                        return field.onChange(v === "yes");
                      }}
                      value={field.value ? "yes" : "no"}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="camp-before-yes" />
                        <Label htmlFor="camp-before-yes">Yes</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="camp-before-no" />
                        <Label htmlFor="camp-before-no">No</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={camperForm.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={camperForm.control}
              name="friendCabinRequest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Friend/Cabin mate Requests</FormLabel>
                  <FormDescription>
                    Please list any friends or siblings the camper would like to
                    share a cabin with.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={camperForm.control}
              name="tShirtSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>T-Shirt Size</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      style={{ maxWidth: "100%" }}
                    >
                      {tShirtSizeOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={camperForm.control}
              name="arePhotosAllowed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Are photos allowed?</FormLabel>
                  <FormDescription>
                    At Mulhurst we like to take photos and videos during camp
                    for archives, powerpoint updates for meetings, PR, marketing
                    and promotional use.
                    <br />
                    <br />
                    Please complete the following section either giving or
                    denying permission to release personal information in the
                    context of Mulhurst Camp setting as indicated below. Please
                    let your child know prior to camp if they are not allowed to
                    be in pictures or videos, so they are not disappointed when
                    we do not allow them to be in a photograph.
                    <br />
                    <br />
                    Mulhurst Lutheran Church Camp follows the principles under
                    the Provincial Information Privacy Act (PIPA) as it relates
                    to non-profit organizations. The use of photographs and/or
                    videos of me or my child, if applicant is under 18 years of
                    age, for the use of Mulhurst Camp publications, documents,
                    displays or website use. By clicking box below identified as
                    &quot;yes&quot; I am in agreeance and give consent to the
                    use of my child&apos;s photo and/or video to be used for the
                    purposes outlined above.
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(v: "yes" | "no") => {
                        return field.onChange(v === "yes");
                      }}
                      value={field.value ? "yes" : "no"}
                    >
                      <div className="flex items-center space-x-2 pt-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes">
                          Yes, I consent to Mulhurst Camp&apos;s use of my
                          child&apos;s photos/video for promotion
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no">No, I do not consent</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={camperForm.control}
              name="howDidYouHearAboutUs"
              render={({ field }) => (
                <FormItem style={{ maxWidth: "470px" }}>
                  <FormLabel>How did you hear about us?</FormLabel>
                  <FormDescription>
                    This information will help us get a better understanding of
                    how we can encourage growth within our camp community.
                  </FormDescription>
                  <FormControl>
                    <select
                      {...field}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      style={{ maxWidth: "100%" }}
                    >
                      {heardAboutUsOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedProgram?.canApplySiblingDiscount && (
              <FormField
                name="siblingNameForDiscount"
                control={camperForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sibling Discount</FormLabel>
                    <FormControl>
                      <ToggleField
                        id="siblingNameForDiscount"
                        fieldLabel="Please enter the sibling's name here. This will apply a $25 discount to your registration. You may apply this discount to each sibling's registration."
                        toggleLabel="I will be registering/have registered a sibling for camp."
                        noLabel="No"
                        offValue={NO_SIBLING}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={camperForm.control}
              name="parentSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Signature</FormLabel>
                  <FormDescription>
                    I hereby release Mulhurst Lutheran Church Camp Association,
                    it&apos;s agents, members and employees not holding them for
                    any  liability for any accident, injury, or any claim
                    arising out of above camper&apos;s us of Mulhurst Camp or
                    any of its facilities, or virtue of participation in any of
                    its programs. In case of emergency, I understand that every
                    effort will be made to contact me. In the event that I
                    cannot be reached, I hereby authorize the camp personnel to
                    secure medical advice and services as may be deemed
                    necessary for the safety of my child.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Next</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CamperForm;
