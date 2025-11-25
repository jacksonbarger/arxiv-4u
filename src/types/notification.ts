export interface Notification {
  id: string;
  userId: string;
  paperId: string;
  paperTitle: string;
  type: 'new_paper' | 'matching_paper';
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  notificationFrequency: 'daily' | 'weekly';
  notificationCategories: string[]; // TopicCategory array
}
