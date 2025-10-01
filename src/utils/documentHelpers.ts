import { DocumentRequest, DocumentType } from '@/types/documents';

export const documentTypeLabels: Record<DocumentType, string> = {
  offer_letter: 'Offer Letter',
  experience_letter: 'Experience Letter',
  salary_slip: 'Salary Slip',
  employment_verification: 'Employment Verification',
  relieving_letter: 'Relieving Letter',
  custom: 'Custom Document',
};

export const statusColors: Record<DocumentRequest['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  auto_generating: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  awaiting_approval: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  changes_requested: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  sla_breached: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export const statusLabels: Record<DocumentRequest['status'], string> = {
  pending: 'Pending',
  auto_generating: 'Auto-Generating',
  awaiting_approval: 'Awaiting Approval',
  approved: 'Approved',
  in_progress: 'In Progress',
  completed: 'Completed',
  rejected: 'Rejected',
  changes_requested: 'Changes Requested',
  sla_breached: 'SLA Breached',
};

export function calculateSLAProgress(request: DocumentRequest): {
  percentage: number;
  hoursRemaining: number;
  isBreached: boolean;
} {
  if (!request.due_by) {
    return { percentage: 0, hoursRemaining: 0, isBreached: false };
  }

  const now = new Date();
  const created = new Date(request.created_at);
  const due = new Date(request.due_by);
  
  const totalTime = due.getTime() - created.getTime();
  const elapsed = now.getTime() - created.getTime();
  const remaining = due.getTime() - now.getTime();
  
  const percentage = Math.min(100, (elapsed / totalTime) * 100);
  const hoursRemaining = Math.max(0, remaining / (1000 * 60 * 60));
  const isBreached = now > due;
  
  return { percentage, hoursRemaining, isBreached };
}

export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} minutes`;
  }
  if (hours < 24) {
    return `${Math.round(hours)} hours`;
  }
  return `${Math.round(hours / 24)} days`;
}

export function getSLAColorClass(percentage: number, isBreached: boolean): string {
  if (isBreached) return 'bg-red-500';
  if (percentage > 80) return 'bg-orange-500';
  if (percentage > 50) return 'bg-yellow-500';
  return 'bg-green-500';
}
