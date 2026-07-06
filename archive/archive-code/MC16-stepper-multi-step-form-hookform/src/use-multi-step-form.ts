import { useState } from "react";
import {
  personalInfoSchema,
  professionalInfoSchema,
  billingInfoSchema,
  type Step,
  type StepFormData,
} from "./types";
import { User, Briefcase, CreditCard } from "lucide-react";

/** --- Combine all step schemas into an array --- */
const stepSchemas = [personalInfoSchema, professionalInfoSchema, billingInfoSchema];

/** --- Define steps with consistent metadata --- */
export const steps: Step[] = [
  { id: "personal", name: "Personal Info", icon: User },
  { id: "professional", name: "Professional Info", icon: Briefcase },
  { id: "billing", name: "Billing Info", icon: CreditCard },
];

export function useMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<StepFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  /** --- Returns the schema for the current step --- */
  const getCurrentStepSchema = () => stepSchemas[currentStep];

  /** --- Go to next step --- */
  const goToNextStep = () => {
    if (!isLastStep) setCurrentStep((prev) => prev + 1);
  };

  /** --- Go to previous step --- */
  const goToPreviousStep = () => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1);
  };

  /** --- Merge and update form data --- */
  const updateFormData = (newData: Partial<StepFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  /** --- Handle final submission --- */
  const submitForm = (data: StepFormData) => {
    console.log("✅ Final submitted data:", data);
    setIsSubmitted(true);
  };

  /** --- Reset the form entirely --- */
  const resetForm = () => {
    setFormData({});
    setCurrentStep(0);
    setIsSubmitted(false);
  };

  return {
    currentStep, // Which step we're on (0, 1, or 2)
    formData, // Accumulated data from all steps
    isFirstStep, // Boolean - are we on step 0?
    isLastStep, // Boolean - are we on the final step?
    isSubmitted, // Boolean - has form been submitted?
    steps, // Array of step metadata (for progress indicator)
    goToNextStep, // Function to advance
    goToPreviousStep, // Function to go back
    updateFormData, // Function to save step data
    submitForm, // Function for final submission
    resetForm, // Function to start over
    getCurrentStepSchema, // Function returning current Zod schema
  };
}
