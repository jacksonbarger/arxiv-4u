'use client';

import { useState, useEffect } from 'react';
import { TopicCategory } from '@/types/arxiv';

const TOPIC_CATEGORIES: { value: TopicCategory; label: string }[] = [
  { value: 'agentic-coding', label: 'Agentic Coding' },
  { value: 'image-generation', label: 'Image Generation' },
  { value: 'video-generation', label: 'Video Generation' },
  { value: 'ai-content-creators', label: 'AI Content Creators' },
  { value: 'comfyui', label: 'ComfyUI' },
  { value: 'runpod', label: 'RunPod' },
  { value: 'market-opportunity', label: 'Market Opportunity' },
  { value: 'other', label: 'Other' },
];

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSettings({ isOpen, onClose }: NotificationSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState<'daily' | 'weekly'>('weekly');
  const [notificationCategories, setNotificationCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchPreferences();
    }
  }, [isOpen]);

  const fetchPreferences = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const data = await response.json();
        setEmailNotifications(data.emailNotifications);
        setNotificationFrequency(data.notificationFrequency);
        setNotificationCategories(data.notificationCategories || []);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailNotifications,
          notificationFrequency,
          notificationCategories,
        }),
      });

      if (response.ok) {
        setMessage('Preferences saved successfully!');
        setTimeout(() => {
          setMessage('');
          onClose();
        }, 1500);
      } else {
        setMessage('Failed to save preferences');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setMessage('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCategory = (category: string) => {
    setNotificationCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
          style={{ backgroundColor: '#FFFFFF' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-xl font-bold" style={{ color: '#4A5568' }}>
              Notification Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-colors"
              style={{ color: '#718096' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F3EF'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto flex-1">
            {isLoading ? (
              <div className="text-center py-8" style={{ color: '#718096' }}>
                Loading preferences...
              </div>
            ) : (
              <div className="space-y-6">
                {/* Email Notifications Toggle */}
                <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-medium mb-1" style={{ color: '#4A5568' }}>
                        Email Notifications
                      </div>
                      <p className="text-sm" style={{ color: '#718096' }}>
                        Receive email digests of new papers
                      </p>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                      style={{ backgroundColor: emailNotifications ? '#9EDCE1' : '#CBD5E0' }}
                    >
                      <span
                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        style={{ transform: emailNotifications ? 'translateX(24px)' : 'translateX(4px)' }}
                      />
                    </button>
                  </label>
                </div>

                {/* Frequency Selection */}
                {emailNotifications && (
                  <div>
                    <div className="font-medium mb-3" style={{ color: '#4A5568' }}>
                      Frequency
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer p-3 rounded-xl transition-colors" style={{ backgroundColor: notificationFrequency === 'daily' ? '#F5F3EF' : 'transparent' }}>
                        <input
                          type="radio"
                          checked={notificationFrequency === 'daily'}
                          onChange={() => setNotificationFrequency('daily')}
                          className="mr-3"
                          style={{ accentColor: '#9EDCE1' }}
                        />
                        <div>
                          <div className="font-medium" style={{ color: '#4A5568' }}>Daily</div>
                          <p className="text-xs" style={{ color: '#718096' }}>Get a daily summary of new papers</p>
                        </div>
                      </label>
                      <label className="flex items-center cursor-pointer p-3 rounded-xl transition-colors" style={{ backgroundColor: notificationFrequency === 'weekly' ? '#F5F3EF' : 'transparent' }}>
                        <input
                          type="radio"
                          checked={notificationFrequency === 'weekly'}
                          onChange={() => setNotificationFrequency('weekly')}
                          className="mr-3"
                          style={{ accentColor: '#9EDCE1' }}
                        />
                        <div>
                          <div className="font-medium" style={{ color: '#4A5568' }}>Weekly</div>
                          <p className="text-xs" style={{ color: '#718096' }}>Get a weekly summary every Wednesday</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Category Selection */}
                {emailNotifications && (
                  <div>
                    <div className="font-medium mb-3" style={{ color: '#4A5568' }}>
                      Topics
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#718096' }}>
                      Select topics you&apos;re interested in
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TOPIC_CATEGORIES.map((category) => (
                        <button
                          key={category.value}
                          onClick={() => toggleCategory(category.value)}
                          className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                          style={{
                            backgroundColor: notificationCategories.includes(category.value) ? '#9EDCE1' : '#F5F3EF',
                            color: notificationCategories.includes(category.value) ? '#FFFFFF' : '#718096',
                          }}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success/Error Message */}
                {message && (
                  <div
                    className="p-4 rounded-xl text-sm text-center"
                    style={{
                      backgroundColor: message.includes('success') ? '#D1FAE5' : '#FEE2E2',
                      color: message.includes('success') ? '#065F46' : '#991B1B',
                    }}
                  >
                    {message}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex gap-3" style={{ borderColor: '#E2E8F0' }}>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-full font-medium transition-colors"
              style={{ backgroundColor: '#F5F3EF', color: '#4A5568' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F5F3EF'}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-4 py-3 rounded-full font-medium transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#9EDCE1', color: '#FFFFFF' }}
              onMouseEnter={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#7DC5CA')}
              onMouseLeave={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#9EDCE1')}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
