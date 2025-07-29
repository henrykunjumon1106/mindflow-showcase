import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { WorkflowStep, StepStatus } from "@/components/WorkflowStep";
import { OTPDialog } from "@/components/OTPDialog";
import { AgentResponse } from "@/components/AgentResponse";
import { Card } from "@/components/ui/card";
import { Play, Zap, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface WorkflowStepData {
  id: string;
  title: string;
  description?: string;
  subSteps?: string[];
  status: StepStatus;
}

export const AgentWorkflow = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [agentResponse, setAgentResponse] = useState("");
  const [isTypingResponse, setIsTypingResponse] = useState(false);
  
  const [steps, setSteps] = useState<WorkflowStepData[]>([
    {
      id: "auth",
      title: "Authentication Check",
      description: "Verifying user credentials and permissions",
      status: "pending"
    },
    {
      id: "data",
      title: "Data Processing",
      description: "Analyzing and processing requested information",
      subSteps: ["Fetching user data", "Validating permissions", "Processing request"],
      status: "pending"
    },
    {
      id: "security",
      title: "Security Verification",
      description: "Multi-factor authentication required",
      status: "pending"
    },
    {
      id: "execution",
      title: "Task Execution",
      description: "Performing the requested operation",
      subSteps: ["Initializing systems", "Executing commands", "Validating results"],
      status: "pending"
    },
    {
      id: "completion",
      title: "Workflow Complete",
      description: "Finalizing and preparing response",
      status: "pending"
    }
  ]);

  const updateStepStatus = useCallback((stepIndex: number, status: StepStatus) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  }, []);

  const simulateWorkflow = useCallback(async () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setAgentResponse("");
    
    // Reset all steps to pending
    setSteps(prev => prev.map(step => ({ ...step, status: "pending" })));

    // Step 1: Authentication
    updateStepStatus(0, "active");
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateStepStatus(0, "complete");

    // Step 2: Data Processing
    setCurrentStepIndex(1);
    updateStepStatus(1, "active");
    await new Promise(resolve => setTimeout(resolve, 3000));
    updateStepStatus(1, "complete");

    // Step 3: Security Verification (OTP)
    setCurrentStepIndex(2);
    updateStepStatus(2, "loading");
    setShowOTP(true);
  }, [updateStepStatus]);

  const handleOTPSubmit = useCallback(async (otp: string) => {
    setShowOTP(false);
    updateStepStatus(2, "complete");

    toast({
      title: "OTP Verified",
      description: "Security verification successful",
    });

    // Step 4: Task Execution
    setCurrentStepIndex(3);
    updateStepStatus(3, "active");
    await new Promise(resolve => setTimeout(resolve, 3000));
    updateStepStatus(3, "complete");

    // Step 5: Completion
    setCurrentStepIndex(4);
    updateStepStatus(4, "active");
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateStepStatus(4, "complete");

    // Generate response
    setIsTypingResponse(true);
    const response = "Workflow executed successfully! All security protocols have been followed, and the requested operation has been completed. Your data has been processed and is ready for review. System integrity verified.";
    setAgentResponse(response);
    
    // Simulate typing delay
    setTimeout(() => {
      setIsTypingResponse(false);
      setIsRunning(false);
      setCurrentStepIndex(-1);
    }, 3000);
  }, [updateStepStatus, toast]);

  const resetWorkflow = useCallback(() => {
    setIsRunning(false);
    setCurrentStepIndex(-1);
    setAgentResponse("");
    setIsTypingResponse(false);
    setSteps(prev => prev.map(step => ({ ...step, status: "pending" })));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="w-8 h-8 text-primary animate-pulse-glow" />
          <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Agentic Workflow System
          </h1>
        </div>
        <p className="text-muted-foreground">
          Experience a futuristic AI agent workflow with real-time status updates, security verification, and intelligent responses.
        </p>
      </div>

      {/* Trigger Button */}
      <div className="flex justify-center">
        <Button
          variant="agent"
          size="lg"
          onClick={simulateWorkflow}
          disabled={isRunning}
          className={cn(
            "relative overflow-hidden",
            isRunning && "animate-pulse-glow"
          )}
        >
          {isRunning ? (
            <>
              <Zap className="w-5 h-5 animate-pulse" />
              Workflow Active
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Initiate Workflow
            </>
          )}
        </Button>
      </div>

      {/* Workflow Steps */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold font-mono text-primary">
            Workflow Progress
          </h2>
          {isRunning && (
            <Button variant="workflow" size="sm" onClick={resetWorkflow}>
              Reset
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <WorkflowStep
              key={step.id}
              title={step.title}
              description={step.description}
              status={step.status}
              subSteps={currentStepIndex === index ? step.subSteps : []}
              className={cn(
                "transition-all duration-500",
                currentStepIndex === index && "transform scale-[1.02]"
              )}
            />
          ))}
        </div>
      </Card>

      {/* Agent Response */}
      {agentResponse && (
        <Card className="p-0 bg-card border-border overflow-hidden">
          <AgentResponse
            response={agentResponse}
            isTyping={isTypingResponse}
            className="border-0"
          />
        </Card>
      )}

      {/* OTP Dialog */}
      <OTPDialog
        open={showOTP}
        onOpenChange={setShowOTP}
        onSubmit={handleOTPSubmit}
        title="Security Verification Required"
        description="Please enter the 6-digit OTP to continue the workflow execution."
      />
    </div>
  );
};