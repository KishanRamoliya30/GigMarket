"use client"
import { useState } from "react";
import { Gig, GigStatus } from "../../../../utils/constants";


// Mock data for demonstration
const mockGigs: Gig[] = [
  {
    id: "1",
    title: "React Developer for E-commerce Website",
    description: "Need an experienced React developer to build a modern e-commerce platform with payment integration and user authentication.",
    budget: 5000,
    currentStatus: "in-progress",
    client: { id: "c1", name: "John Smith" },
    provider: { id: "p1", name: "Sarah Wilson" },
    createdAt: new Date("2024-01-15"),
    statusHistory: [
      {
        id: "h1",
        status: "open",
        timestamp: new Date("2024-01-15T10:00:00"),
        changedBy: { id: "c1", name: "John Smith", role: "client" },
        notes: "Initial gig posting"
      },
      {
        id: "h2",
        status: "requested",
        timestamp: new Date("2024-01-16T14:30:00"),
        changedBy: { id: "p1", name: "Sarah Wilson", role: "provider" },
        previousStatus: "open",
        notes: "Submitted proposal with detailed timeline and portfolio"
      },
      {
        id: "h3",
        status: "in-progress",
        timestamp: new Date("2024-01-17T09:15:00"),
        changedBy: { id: "c1", name: "John Smith", role: "client" },
        previousStatus: "requested",
        notes: "Proposal accepted. Looking forward to working together!"
      }
    ]
  },
  {
    id: "2",
    title: "Logo Design for Tech Startup",
    description: "Creating a modern, minimalist logo for a tech startup. Need multiple concepts and revisions included.",
    budget: 800,
    currentStatus: "completed",
    client: { id: "c2", name: "Tech Innovations Inc" },
    provider: { id: "p2", name: "Mike Chen" },
    createdAt: new Date("2024-01-10"),
    statusHistory: [
      {
        id: "h4",
        status: "open",
        timestamp: new Date("2024-01-10T08:00:00"),
        changedBy: { id: "c2", name: "Tech Innovations Inc", role: "client" },
        notes: "Posted logo design requirements"
      },
      {
        id: "h5",
        status: "requested",
        timestamp: new Date("2024-01-11T11:20:00"),
        changedBy: { id: "p2", name: "Mike Chen", role: "provider" },
        previousStatus: "open",
        notes: "Submitted portfolio and initial concepts"
      },
      {
        id: "h6",
        status: "in-progress",
        timestamp: new Date("2024-01-12T16:45:00"),
        changedBy: { id: "c2", name: "Tech Innovations Inc", role: "client" },
        previousStatus: "requested",
        notes: "Accepted proposal, excited to see the designs!"
      },
      {
        id: "h7",
        status: "completed",
        timestamp: new Date("2024-01-20T13:30:00"),
        changedBy: { id: "p2", name: "Mike Chen", role: "provider" },
        previousStatus: "in-progress",
        notes: "Final logo delivered with all file formats and brand guidelines"
      }
    ]
  },
  {
    id: "3",
    title: "Mobile App UI/UX Design",
    description: "Design a complete UI/UX for a fitness tracking mobile application. Need wireframes, mockups, and prototypes.",
    budget: 2500,
    currentStatus: "rejected",
    client: { id: "c3", name: "FitLife App" },
    createdAt: new Date("2024-01-18"),
    statusHistory: [
      {
        id: "h8",
        status: "open",
        timestamp: new Date("2024-01-18T12:00:00"),
        changedBy: { id: "c3", name: "FitLife App", role: "client" },
        notes: "Posted mobile app design requirements"
      },
      {
        id: "h9",
        status: "requested",
        timestamp: new Date("2024-01-19T15:30:00"),
        changedBy: { id: "p3", name: "Alex Rodriguez", role: "provider" },
        previousStatus: "open",
        notes: "Submitted proposal with timeline and cost breakdown"
      },
      {
        id: "h10",
        status: "rejected",
        timestamp: new Date("2024-01-20T10:15:00"),
        changedBy: { id: "c3", name: "FitLife App", role: "client" },
        previousStatus: "requested",
        notes: "Thanks for the proposal, but we've decided to go with another designer who has more experience with fitness apps."
      }
    ]
  }
];

export function useGigData() {
  const [gigs] = useState<Gig[]>(mockGigs);

  const getGigById = (id: string) => gigs.find(gig => gig.id === id);

  const getGigsByStatus = (status: GigStatus) => 
    gigs.filter(gig => gig.currentStatus === status);

  const updateGigStatus = (
    gigId: string, 
    newStatus: GigStatus, 
    changedBy: { id: string; name: string; role: "client" | "provider" },
    notes?: string
  ) => {
    // This would typically make an API call
    console.log("Updating gig status:", { gigId, newStatus, changedBy, notes });
    // Implementation would update the gig and add to status history
  };

  return {
    gigs,
    getGigById,
    getGigsByStatus,
    updateGigStatus
  };
}