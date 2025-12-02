'use client';

import { KeywordManager } from '../KeywordManager';
import { SubscriptionManager } from '../SubscriptionManager';
import { ReferralDashboard } from '../ReferralDashboard';
import { NotificationSettings } from '../ui/NotificationSettings';
import { Button, Card, CardHeader, CardBody, Divider } from '@heroui/react';

interface Demo4SettingsProps {
  onBack: () => void;
}

export function Demo4Settings({ onBack }: Demo4SettingsProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-divider">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button color="default" variant="flat" onPress={onBack} startContent={<span>←</span>}>
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold">Settings</h1>
            <p className="text-sm text-default-500">Manage your preferences</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardBody className="text-center">
              <p className="text-4xl font-bold mb-1">342</p>
              <p className="text-sm text-default-500">Papers Read</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-4xl font-bold mb-1">47</p>
              <p className="text-sm text-default-500">Bookmarks</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-4xl font-bold mb-1">12</p>
              <p className="text-sm text-default-500">Reading Streak</p>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">Notifications</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <NotificationSettings />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">Subscription</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <SubscriptionManager />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">Keywords & Interests</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <KeywordManager />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">Referrals</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <ReferralDashboard />
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
