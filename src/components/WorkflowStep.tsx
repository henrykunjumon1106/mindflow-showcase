import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Clock, Loader2 } from "lucide-react";

export type StepStatus = "pending" | "active" | "complete" | "loading";

export interface WorkflowStepProps {
  title: string;
  description?: string;
  status: StepStatus;
  subSteps?: string[];
  className?: string;
}

export const WorkflowStep = ({ 
  title, 
  description, 
  status, 
  subSteps = [],
  className 
}: WorkflowStepProps) => {
  const getIcon = () => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-5 h-5 text-step-complete" />;
      case "active":
      case "loading":
        return status === "loading" ? 
          <Loader2 className="w-5 h-5 text-step-active animate-spin" /> :
          <Circle className="w-5 h-5 text-step-active animate-pulse-glow" />;
      default:
        return <Clock className="w-5 h-5 text-step-pending" />;
    }
  };

  const getStepStyles = () => {
    switch (status) {
      case "complete":
        return "border-step-complete bg-step-complete/10";
      case "active":
        return "border-step-active bg-step-active/10 shadow-glow";
      case "loading":
        return "border-step-active bg-step-active/10 animate-pulse-glow";
      default:
        return "border-step-pending bg-step-pending/10";
    }
  };

  return (
    <div className={cn(
      "relative p-4 rounded-lg border transition-all duration-300",
      getStepStyles(),
      className
    )}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-sm font-medium font-mono",
            status === "complete" ? "text-step-complete" :
            status === "active" || status === "loading" ? "text-step-active" :
            "text-step-pending"
          )}>
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
          {subSteps.length > 0 && status === "active" && (
            <div className="mt-2 space-y-1">
              {subSteps.map((subStep, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs">
                  <div className="w-1 h-1 rounded-full bg-step-active animate-pulse" />
                  <span className="text-muted-foreground">{subStep}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {(status === "active" || status === "loading") && (
        <div className="absolute inset-0 rounded-lg border border-step-active/50 animate-pulse-glow pointer-events-none" />
      )}
    </div>
  );
};