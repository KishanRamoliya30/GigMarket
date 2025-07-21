"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/gigs/gig-management/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/gigs/gig-management/Tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/gigs/gig-management/dialog";
import { useGigData } from "./hooks";
import { Gig, GigStatus } from "../../../../utils/constants";
import { BarChart3, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { GigCard } from "./GigCard";
import { GigStatusPipeline } from "./GigStatusPipeline";
import { GigStatusHistory } from "./GigStatusHistory";

export function GigDashboard() {
  const { gigs, getGigsByStatus } = useGigData();
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);

  const statusCounts = {
    open: getGigsByStatus("open").length,
    requested: getGigsByStatus("requested").length,
    "in-progress": getGigsByStatus("in-progress").length,
    completed: getGigsByStatus("completed").length,
    rejected: getGigsByStatus("rejected").length
  };

  const StatusCard = ({ 
    status, 
    icon: Icon, 
    title 
  }: { 
    status: GigStatus; 
    icon: React.ElementType; 
    title: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{statusCounts[status]}</div>
        <p className="text-xs text-muted-foreground">
          {statusCounts[status] === 1 ? "gig" : "gigs"}
        </p>
      </CardContent>
    </Card>
  );

  const GigList = ({ status }: { status: GigStatus }) => {
    const gigsForStatus = getGigsByStatus(status);
    
    if (gigsForStatus.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No gigs with {status} status
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {gigsForStatus.map(gig => (
          <GigCard 
            key={gig.id} 
            gig={gig} 
            onClick={() => setSelectedGig(gig)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatusCard status="open" icon={BarChart3} title="Open Gigs" />
        <StatusCard status="requested" icon={Clock} title="Requested" />
        <StatusCard status="in-progress" icon={AlertCircle} title="In Progress" />
        <StatusCard status="completed" icon={CheckCircle} title="Completed" />
        <StatusCard status="rejected" icon={XCircle} title="Rejected" />
      </div>

      {/* Gigs by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Gig Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="all">All ({gigs.length})</TabsTrigger>
              <TabsTrigger value="open">Open ({statusCounts.open})</TabsTrigger>
              <TabsTrigger value="requested">Requested ({statusCounts.requested})</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress ({statusCounts["in-progress"]})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({statusCounts.completed})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-4">
                {gigs.map(gig => (
                  <GigCard 
                    key={gig.id} 
                    gig={gig} 
                    onClick={() => setSelectedGig(gig)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="open" className="mt-6">
              <GigList status="open" />
            </TabsContent>
            
            <TabsContent value="requested" className="mt-6">
              <GigList status="requested" />
            </TabsContent>
            
            <TabsContent value="in-progress" className="mt-6">
              <GigList status="in-progress" />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              <GigList status="completed" />
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-6">
              <GigList status="rejected" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Gig Detail Modal */}
      <Dialog open={!!selectedGig} onOpenChange={(open) => !open && setSelectedGig(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedGig && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedGig.title}</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedGig.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Budget</h4>
                      <p className="text-lg font-semibold">${selectedGig.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Created</h4>
                      <p>{selectedGig.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <GigStatusPipeline gig={selectedGig} />
                </div>
                
                <div>
                  <GigStatusHistory history={selectedGig.statusHistory} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}