"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/gigs/gig-management/Card";

import { GigStatusHistory as GigStatusHistoryType, GIG_STATUS_CONFIG } from "../../../../utils/constants";
import { Clock, User, MessageSquare } from "lucide-react";
import { GigStatusBadge } from "./GigStatusBadge";
import { Badge } from "./Badge";

interface GigStatusHistoryProps {
  history: GigStatusHistoryType[];
}

export function GigStatusHistory({ history }: GigStatusHistoryProps) {
  // Sort history by timestamp (newest first)
  const sortedHistory = [...history].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Status History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedHistory.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No status changes yet</p>
        ) : (
          <div className="space-y-4">
            {sortedHistory.map((entry, index) => (
              <div key={entry.id} className="relative">
                {/* Timeline line */}
                {index < sortedHistory.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-12 bg-border" />
                )}
                
                <div className="flex gap-3">
                  {/* Timeline dot */}
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      backgroundColor: GIG_STATUS_CONFIG[entry.status].bgColor,
                      border: `2px solid ${GIG_STATUS_CONFIG[entry.status].color}`
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: GIG_STATUS_CONFIG[entry.status].color }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <GigStatusBadge status={entry.status} size="sm" />
                      {entry.previousStatus && (
                        <span className="text-sm text-muted-foreground">
                          from {GIG_STATUS_CONFIG[entry.previousStatus].label}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{entry.changedBy.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {entry.changedBy.role}
                      </Badge>
                      <span>•</span>
                      <span>{formatTimestamp(entry.timestamp)}</span>
                    </div>
                    
                    {entry.notes && (
                      <div className="flex gap-2 p-3 bg-muted/50 rounded-md">
                        <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}