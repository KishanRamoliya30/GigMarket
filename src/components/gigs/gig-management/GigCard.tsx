

import { DollarSign, User, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Gig } from "../../../../utils/constants";
import { GigStatusBadge } from "./GigStatusBadge";

interface GigCardProps {
  gig: Gig;
  onClick?: () => void;
}

export function GigCard({ gig, onClick }: GigCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${onClick ? "hover:border-primary/20" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg line-clamp-2">{gig.title}</CardTitle>
          <GigStatusBadge status={gig.currentStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-2">{gig.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">${gig.budget.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{gig.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>Client: {gig.client.name}</span>
          </div>
          
          {gig.provider && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Provider: {gig.provider.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}