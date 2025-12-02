'use client';

import { useState } from 'react';
import { Button, Input, Textarea, Card, CardBody } from '@heroui/react';

interface EnterpriseContactFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EnterpriseContactForm({ onSuccess, onCancel }: EnterpriseContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enterprise/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit contact form');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', company: '', message: '' });

      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-bold mb-2">Thank you for your interest!</h3>
          <p className="text-default-500 mb-4">
            We&apos;ll get back to you within 24 hours to discuss your custom Enterprise needs.
          </p>
          {onCancel && (
            <Button color="primary" onPress={onCancel}>
              Close
            </Button>
          )}
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="p-6">
        <h3 className="text-2xl font-bold mb-2">Contact Zentrex Team</h3>
        <p className="text-default-500 mb-6">
          Get personalized consulting to implement business plans from research papers.
          Fill out the form below and we&apos;ll be in touch!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            isDisabled={isSubmitting}
          />

          <Input
            label="Email"
            type="email"
            placeholder="john@company.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            isDisabled={isSubmitting}
          />

          <Input
            label="Company Name"
            placeholder="Acme Inc."
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            required
            isDisabled={isSubmitting}
          />

          <Textarea
            label="Tell us about your project"
            placeholder="I&apos;m interested in implementing a business plan based on..."
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            required
            minRows={4}
            isDisabled={isSubmitting}
          />

          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            {onCancel && (
              <Button
                color="default"
                variant="flat"
                onPress={onCancel}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              color="primary"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
