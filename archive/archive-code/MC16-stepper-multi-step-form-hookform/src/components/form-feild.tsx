import type { AllFormFields, StepFormData } from "@/types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { useForm } from "react-hook-form";
import type { HTMLInputTypeAttribute } from "react";

function FormField({
  id,
  label,
  register,
  errors,
  type = "text",
  maxLength,
}: {
  id: keyof AllFormFields;
  label: string;
  register: ReturnType<typeof useForm<StepFormData>>["register"];
  errors: Record<string, { message?: string }>;
  type?: HTMLInputTypeAttribute | undefined;
  maxLength?: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <Input id={id} type={type} maxLength={maxLength} {...register(id)} />

      {errors[id] && <p className="text-sm text-destructive">{errors[id]?.message}</p>}
    </div>
  );
}

export default FormField;
