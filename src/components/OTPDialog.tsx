import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OTPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (otp: string) => void;
  title?: string;
  description?: string;
}

export const OTPDialog = ({
  open,
  onOpenChange,
  onSubmit,
  title = "Security Verification Required",
  description = "Please enter the OTP sent to your device to continue the workflow."
}: OTPDialogProps) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (otp.length !== 6) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate verification
    onSubmit(otp);
    setIsSubmitting(false);
    setOtp("");
  };

  const handleOtpChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(numericValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="font-mono text-lg">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              className={cn(
                "text-center text-lg font-mono tracking-widest",
                "bg-secondary border-border focus:border-primary",
                "transition-all duration-200"
              )}
              maxLength={6}
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="flex justify-center items-center h-full">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-8 h-8 mx-1 border-b-2 flex items-center justify-center",
                      i < otp.length 
                        ? "border-primary text-primary" 
                        : "border-muted text-muted-foreground",
                      i === otp.length && "animate-pulse border-primary"
                    )}
                  >
                    {otp[i] && (
                      <span className="text-lg font-mono">{otp[i]}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={otp.length !== 6 || isSubmitting}
            className={cn(
              "w-full font-mono transition-all duration-200",
              "bg-primary hover:bg-primary/90",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Submit OTP</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
        
        <div className="text-center">
          <button 
            className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
            onClick={() => {/* TODO: Implement resend */}}
          >
            Didn't receive code? Resend OTP
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};