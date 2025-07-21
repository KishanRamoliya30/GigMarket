import { GigDashboard } from "@/components/gigs/gig-management/GigDashboard";


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Freelancing Platform</h1>
          <p className="text-muted-foreground">Manage your gigs and track their progress</p>
        </div>
        <GigDashboard />
      </div>
    </div>
  );
};

export default Index;