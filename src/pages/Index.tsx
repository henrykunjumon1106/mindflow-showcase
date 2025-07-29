import { AgentWorkflow } from "@/components/AgentWorkflow";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Main Content */}
      <div className="relative z-10">
        <AgentWorkflow />
      </div>
    </div>
  );
};

export default Index;