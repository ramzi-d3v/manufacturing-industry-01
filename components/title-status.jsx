import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';
import { BookUser, Check, CreditCard, ListTodo, LoaderCircleIcon, LockKeyhole } from 'lucide-react';

const steps = [
  { title: 'User Details', icon: BookUser },
  { title: 'Payment Info', icon: CreditCard },
  { title: 'Documents', icon: LockKeyhole },
  { title: 'Preview Form', icon: ListTodo },
];

export default function Component() {
  const [currentStep, setCurrentStep] = useState(2);

  return (
    <Stepper
      value={currentStep}
      onValueChange={setCurrentStep}
      indicators={{
        completed: <Check className="size-4" />,
        loading: <LoaderCircleIcon className="size-4 animate-spin" />,
      }}
      className="space-y-8">
      <StepperNav className="gap-6 mb-6 flex justify-center items-center">
        {steps.map((step, index) => {
          return (
            <StepperItem key={index} step={index + 1} className="relative flex-none items-center w-56">
              <StepperTrigger className="flex flex-col items-center justify-center gap-2.5 grow transition-all duration-300 ease-out" asChild>
                <StepperIndicator
                  className="size-8 border-2 transition-all duration-300 ease-out transform data-[state=active]:scale-105 data-[state=completed]:scale-100 data-[state=completed]:text-white data-[state=completed]:bg-green-500 data-[state=inactive]:bg-transparent data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground">
                  <step.icon className="size-4" />
                </StepperIndicator>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-[10px] font-semibold uppercase text-muted-foreground">Step {index + 1}</div>
                  <StepperTitle
                    className="text-center text-base font-semibold group-data-[state=inactive]/step:text-muted-foreground">
                    {step.title}
                  </StepperTitle>
                  <div>
                    <Badge
                      variant="primary"
                      size="sm"
                      appearance="light"
                      className="hidden group-data-[state=active]/step:inline-flex">
                      In Progress
                    </Badge>

                    <Badge
                      variant="success"
                      size="sm"
                      appearance="light"
                      className="hidden group-data-[state=completed]/step:inline-flex">
                      Completed
                    </Badge>

                    <Badge
                      variant="secondary"
                      size="sm"
                      className="hidden group-data-[state=inactive]/step:inline-flex text-muted-foreground">
                      Pending
                    </Badge>
                  </div>
                </div>
              </StepperTrigger>
              {steps.length > index + 1 && (
                <StepperSeparator
                  className="absolute top-3 left-[calc(100%-30px)] h-0.5 w-20 bg-white/10 rounded transition-all duration-400 ease-out group-data-[state=completed]/step:bg-green-500"
                />
              )}
            </StepperItem>
          );
        })}
      </StepperNav>
      <StepperPanel className="text-sm">
        {steps.map((step, index) => (
          <StepperContent
            key={index}
            value={index + 1}
            className="flex items-center justify-center">
            Step {step.title} content
          </StepperContent>
        ))}
      </StepperPanel>
      <div className="flex items-center justify-between gap-2.5">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}>
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev + 1)}
          disabled={currentStep === steps.length}>
          Next
        </Button>
      </div>
    </Stepper>
  );
}
