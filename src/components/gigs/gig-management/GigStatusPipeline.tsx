"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/gigs/gig-management/Card";
import { GigStatusBadge } from "./GigStatusBadge";
import { Gig, GIG_STATUS_CONFIG, GigStatus } from "../../../../utils/constants";
import { Progress } from "./Progress";

interface GigStatusPipelineProps {
  gig: Gig;
}

const STATUS_ORDER: GigStatus[] = ["open", "requested", "in-progress", "completed"];

export function GigStatusPipeline({ gig }: GigStatusPipelineProps) {
  const currentStatusIndex = STATUS_ORDER.indexOf(gig.currentStatus);
  const progressPercentage = gig.currentStatus === "rejected" ? 0 : 
    ((currentStatusIndex + 1) / STATUS_ORDER.length) * 100;

  const getStepStatus = (status: GigStatus, index: number) => {
    if (gig.currentStatus === "rejected") {
      return "rejected";
    }
    if (index <= currentStatusIndex) {
      return "completed";
    }
    if (index === currentStatusIndex + 1) {
      return "current";
    }
    return "pending";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gig Progress</span>
          <GigStatusBadge status={gig.currentStatus} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress
            value={progressPercentage} 
            className={gig.currentStatus === "rejected" ? "opacity-50" : ""}
          />
        </div>

        {/* Status Steps */}
        <div className="space-y-4">
          {STATUS_ORDER.map((status, index) => {
            const stepStatus = getStepStatus(status, index);
            const config = GIG_STATUS_CONFIG[status];
            const hasVisited = gig.statusHistory.some(h => h.status === status);
            
            return (
              <div 
                key={status}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  stepStatus === "completed" 
                    ? "bg-muted/50 border-muted" 
                    : stepStatus === "current"
                    ? "bg-primary/5 border-primary/20"
                    : "bg-background border-border"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  stepStatus === "completed" 
                    ? "bg-primary text-primary-foreground" 
                    : stepStatus === "current"
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {stepStatus === "completed" ? "✓" : index + 1}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium">{config.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {config.description}
                  </div>
                  {hasVisited && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Last updated: {gig.statusHistory
                        .filter(h => h.status === status)
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
                        ?.timestamp.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Rejected Status (if applicable) */}
          {gig.currentStatus === "rejected" && (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-destructive text-destructive-foreground">
                ✕
              </div>
              <div className="flex-1">
                <div className="font-medium text-destructive">Rejected</div>
                <div className="text-sm text-muted-foreground">
                  {GIG_STATUS_CONFIG.rejected.description}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}