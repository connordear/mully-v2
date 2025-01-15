"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CamperInfo,
  NO_SIBLING,
  camperFormSchema,
  camperInfoAtom,
  defaultCamperInfo,
} from "@/lib/camper";
import {
  EmergencyContact,
  contactInfoAtom,
  defaultEmergencyContactInfo,
  emergencyContactsSchema,
} from "@/lib/emergencyContacts";
import {
  MedicalInfo,
  defaultMedicalInfo,
  medicalFormSchema,
  medicalInfoAtom,
} from "@/lib/medical";
import { useSelectedPrice, useSelectedProgram } from "@/lib/programState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";

import { Program } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { FormState, useForm, useFormState } from "react-hook-form";
import CamperForm from "./CamperForm";
import EmergencyContactForm from "./EmergencyContactForm";
import LoadingCard from "./LoadingCard";
import MedicalForm from "./MedicalForm";
import PaymentForm from "./PaymentForm";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const CAMPER_INFO = "camperInfo";
const MEDICAL_INFO = "medicalInfo";
const EMERGENCY_CONTACTS = "emergencyContacts";
const PAYMENT_INFO = "paymentInfo";

function getTabStyle(
  formState: FormState<CamperInfo | MedicalInfo | EmergencyContact>
) {
  if (formState.isDirty && formState.isValid && formState.isSubmitted) {
    return "text-green-500";
  }
  if (formState.isDirty && !formState.isValid) {
    return "text-red-500";
  }

  return "text-gray-500";
}

type MullyFormProps = {
  programs: Program[];
};

export default function MullyForm({ programs }: MullyFormProps) {
  const [camperData, setCamperData] = useAtom(camperInfoAtom);
  const camperForm = useForm<CamperInfo>({
    values: camperData,
    resolver: zodResolver(camperFormSchema),
    reValidateMode: "onChange",
  });

  const selectedDaysOfWeek = camperForm.watch("daysOfWeek");
  const siblingNameForDiscount = camperForm.watch("siblingNameForDiscount");
  const selectedProgram = useSelectedProgram(programs, camperForm);
  const selectedPrice = useSelectedPrice(programs, camperForm);

  useEffect(() => {
    if (
      camperData.program &&
      programs &&
      !programs.find((p) => p.id === camperData.program)
    ) {
      camperForm.setValue("program", programs[0].id);
      camperForm.setValue("priceId", programs[0].defaultPriceId ?? "0");
      camperForm.trigger();
    }
  }, [camperData, camperForm, programs]);

  const purchaseInfo = useMemo(() => {
    const priceId = selectedPrice?.id ?? selectedProgram?.defaultPriceId ?? "0";
    let quantity = 1;
    if (selectedPrice?.isDayPrice) {
      quantity = selectedDaysOfWeek?.length ?? 1;
    }
    // if (selectedProgram && selectedProgram.dayPrices && selectedDaysOfWeek) {
    //   const possibleDaysOfWeek = getDaysOfWeek(
    //     selectedProgram?.startDate,
    //     selectedProgram?.endDate
    //   );
    //   if (possibleDaysOfWeek.length !== selectedDaysOfWeek.length) {
    //     quantity = selectedDaysOfWeek.length;
    //   }
    // }
    return { quantity, priceId };
  }, [selectedProgram, selectedDaysOfWeek, selectedPrice]);

  const [medicalData, setMedicalData] = useAtom(medicalInfoAtom);
  const medicalForm = useForm<MedicalInfo>({
    values: medicalData,
    resolver: zodResolver(medicalFormSchema),
    reValidateMode: "onChange",
  });

  const [contactInfo, setContactInfo] = useAtom(contactInfoAtom);
  const contactForm = useForm<EmergencyContact>({
    values: contactInfo,
    resolver: zodResolver(emergencyContactsSchema),
    reValidateMode: "onChange",
  });

  function clearForms() {
    setCamperData(defaultCamperInfo);
    setMedicalData(defaultMedicalInfo);
    setContactInfo(defaultEmergencyContactInfo);
    camperForm.reset({
      ...defaultCamperInfo,
      program: programs ? programs[0].id : "0",
      priceId: programs ? programs[0].defaultPriceId : "0",
    });
    medicalForm.reset();
    contactForm.reset();
  }

  const [activeTab, setActiveTab] = useState(CAMPER_INFO);

  const {
    isSubmitSuccessful: isCamperFormSubmitSuccessful,
    isSubmitted: isCamperFormSubmitted,
  } = useFormState(camperForm);
  const {
    isSubmitSuccessful: isMedicalFormSubmitSuccessful,
    isSubmitted: isMedicalFormSubmitted,
  } = useFormState(medicalForm);
  const {
    isSubmitSuccessful: isEmergencyContactInfoSubmitSuccessful,
    isSubmitted: isEmergencyContactInfoSubmitted,
  } = useFormState(contactForm);

  const invalidForms = useMemo(() => {
    const forms = [];
    if (!isCamperFormSubmitSuccessful) forms.push("Camper Info");
    if (!isMedicalFormSubmitSuccessful) forms.push("Medical Info");
    if (!isEmergencyContactInfoSubmitSuccessful)
      forms.push("Emergency Contacts");
    return forms;
  }, [
    isCamperFormSubmitSuccessful,
    isMedicalFormSubmitSuccessful,
    isEmergencyContactInfoSubmitSuccessful,
  ]);

  useEffect(() => {
    if (activeTab === PAYMENT_INFO) {
      camperForm.trigger();
      medicalForm.trigger();
      contactForm.trigger();

      if (!isCamperFormSubmitted) camperForm.handleSubmit(setCamperData)();
      if (!isMedicalFormSubmitted) medicalForm.handleSubmit(setMedicalData)();
      if (!isEmergencyContactInfoSubmitted)
        contactForm.handleSubmit(setContactInfo)();
    }
  }, [
    activeTab,
    camperForm,
    medicalForm,
    contactForm,
    setCamperData,
    setMedicalData,
    setContactInfo,
    isCamperFormSubmitted,
    isMedicalFormSubmitted,
    isEmergencyContactInfoSubmitted,
  ]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(newTab) => {
        setActiveTab((prev) => {
          if (prev === CAMPER_INFO) camperForm.handleSubmit(setCamperData)();
          if (prev === MEDICAL_INFO) medicalForm.handleSubmit(setMedicalData)();
          if (prev === EMERGENCY_CONTACTS)
            contactForm.handleSubmit(setContactInfo)();
          return newTab;
        });
      }}
      defaultValue={CAMPER_INFO}
      style={{
        maxWidth: "700px",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <ScrollArea className="rounded-md">
        <TabsList className="w-full">
          <TabsTrigger
            value="camperInfo"
            className={getTabStyle(camperForm.formState)}
          >
            Camper Info
          </TabsTrigger>
          <TabsTrigger
            value="medicalInfo"
            className={getTabStyle(medicalForm.formState)}
          >
            Medical Info
          </TabsTrigger>
          <TabsTrigger
            value="emergencyContacts"
            className={getTabStyle(contactForm.formState)}
          >
            Emergency Contacts
          </TabsTrigger>
          <TabsTrigger value="paymentInfo">Payment Info</TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="camperInfo" className="form-width">
        {programs ? (
          <CamperForm
            programs={programs}
            form={camperForm}
            onSubmit={(values) => {
              setCamperData(values);
              setActiveTab(MEDICAL_INFO);
            }}
          />
        ) : (
          <LoadingCard />
        )}
      </TabsContent>
      <TabsContent value="medicalInfo" className="form-width">
        <MedicalForm
          form={medicalForm}
          onSubmit={(values) => {
            setMedicalData(values);
            setActiveTab(EMERGENCY_CONTACTS);
          }}
        />
      </TabsContent>
      <TabsContent value="emergencyContacts" className="form-width">
        <EmergencyContactForm
          form={contactForm}
          onSubmit={(values) => {
            setContactInfo(values);
            setActiveTab(PAYMENT_INFO);
          }}
        />
      </TabsContent>
      <TabsContent value="paymentInfo" className="form-width">
        {selectedProgram && purchaseInfo && (
          <PaymentForm
            priceId={purchaseInfo.priceId}
            quantity={purchaseInfo.quantity}
            invalidForms={invalidForms}
            couponCode={
              selectedProgram?.canApplySiblingDiscount &&
              siblingNameForDiscount !== NO_SIBLING
                ? process.env.NEXT_PUBLIC_SIBLING_COUPON_CODE
                : undefined
            }
          />
        )}
      </TabsContent>
      <Popover>
        <PopoverTrigger
          asChild
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
          }}
        >
          <Button variant={"secondary"}>Clear Form</Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          style={{
            width: 350,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          Are you sure you want to clear your forms? This action cannot be
          reversed.
          <Button onClick={clearForms} variant="destructive">
            Reset Forms
          </Button>
        </PopoverContent>
      </Popover>
    </Tabs>
  );
}
