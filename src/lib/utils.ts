import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { MatchStatus, PredictionResult } from "@/types";

// Combine class names with Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatMatchDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "EEE, MMM d, yyyy 'at' h:mm a");
}

// Format match time only
export function formatMatchTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "h:mm a");
}

// Get color based on prediction result
export function getPredictionColor(prediction: PredictionResult): string {
  switch (prediction) {
    case "HOME_WIN":
      return "bg-bet-win text-white";
    case "DRAW":
      return "bg-bet-draw text-white";
    case "AWAY_WIN":
      return "bg-bet-loss text-white";
    default:
      return "bg-gray-200 text-gray-800";
  }
}

// Get label for prediction result
export function getPredictionLabel(prediction: PredictionResult, homeTeam: string, awayTeam: string): string {
  switch (prediction) {
    case "HOME_WIN":
      return homeTeam;
    case "DRAW":
      return "Draw";
    case "AWAY_WIN":
      return awayTeam;
    default:
      return "Unknown";
  }
}

// Format match status for display
export function formatMatchStatus(status: MatchStatus): string {
  switch (status) {
    case "LIVE":
      return "Live";
    case "FINISHED":
      return "Finished";
    case "POSTPONED":
      return "Postponed";
    case "CANCELLED":
      return "Cancelled";
    case "NOT_STARTED":
    default:
      return "Upcoming";
  }
}

// Format odds to display (e.g., "2.10" -> "2.1")
export function formatOdds(odds: number): string {
  return odds.toFixed(2).replace(/\.?0+$/, "");
}

// Calculate confidence percentage for display
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

// Generate avatar placeholder for teams without logos
export function getTeamInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}
