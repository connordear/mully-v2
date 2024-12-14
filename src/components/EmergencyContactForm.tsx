"use client";
import {
  Contact,
  defaultContactFields,
  EmergencyContact,
  relationshipOptions,
} from "@/lib/emergencyContacts";
import { UseFormReturn } from "react-hook-form";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type EmergencyContactFormPropsType = {
  form: UseFormReturn<EmergencyContact>;
  onSubmit: (values: EmergencyContact) => void;
};

const EmergencyContactForm = ({
  form,
  onSubmit,
}: EmergencyContactFormPropsType) => {
  function onSubmitEmergencyContactInfo(values: EmergencyContact) {
    onSubmit(values);
  }

  const contacts = form.watch("contacts", [] as Contact[]);

  function onAddAdditionalContact() {
    form.setValue("contacts", [...contacts, defaultContactFields]);
  }

  function onRemoveContact(index: number) {
    const newContacts = [...contacts];
    newContacts.splice(index, 1);
    form.setValue("contacts", newContacts);
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription
          style={{
            maxWidth: "400px",
          }}
        >
          This information will be used by the camp in case of emergency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitEmergencyContactInfo)}
            className="space-y-8"
          >
            {contacts.map((contact, index) => {
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardDescription
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Emergency Contact {index + 1}
                      {index > 1 && (
                        <Button
                          onClick={() => onRemoveContact(index)}
                          variant="secondary"
                        >
                          Remove Contact
                        </Button>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.firstName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.lastName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.phone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.email`}
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
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.relationship`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {relationshipOptions.map((option) => {
                                return (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              );
            })}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button type="submit">Next</Button>
              {contacts.length < 5 && (
                <Button onClick={onAddAdditionalContact} variant="secondary">
                  Add Additional Contact
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactForm;
