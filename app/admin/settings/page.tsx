'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import BreadcrumbNav from '@/components/admin/BreadcrumbNav';
import { Settings, Mail, Save } from 'lucide-react';

interface AdminSettings {
  siteName: string;
  siteUrl: string;
  emailFrom: string;
  emailHost: string;
  emailPort: number;
  taxRate: number;
  shippingCost: number;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
}

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AdminSettings>({
    siteName: 'My Shop',
    siteUrl: 'http://localhost:3000',
    emailFrom: 'noreply@myshop.com',
    emailHost: 'localhost',
    emailPort: 587,
    taxRate: 8,
    shippingCost: 10,
  });
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [settingsRes, templatesRes] = await Promise.all([
          fetch('/api/admin/settings'),
          fetch('/api/admin/email-templates'),
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings(data);
        }

        if (templatesRes.ok) {
          const data = await templatesRes.json();
          setTemplates(data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchSettings();
    }
  }, [session]);

  const handleSettingsSave = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleTemplateSave = async () => {
    if (!selectedTemplate) return;

    try {
      const response = await fetch(`/api/admin/email-templates/${selectedTemplate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedTemplate.subject,
          htmlContent: selectedTemplate.htmlContent,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-10 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="h-96 animate-pulse rounded bg-gray-200"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <BreadcrumbNav items={[{ name: 'Settings' }]} />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="mt-2 text-gray-600">Configure site settings and email templates</p>
        </div>

        {saveSuccess && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            Settings saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Settings size={24} />
                Site Settings
              </h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site URL
                  </label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, siteUrl: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.taxRate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        taxRate: parseFloat(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shippingCost}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        shippingCost: parseFloat(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleSettingsSave}
                  className="w-full rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 flex items-center justify-center gap-2 transition-colors"
                >
                  <Save size={18} />
                  Save Settings
                </button>
              </form>
            </div>

            {/* Email Configuration */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Mail size={24} />
                Email Configuration
              </h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email
                  </label>
                  <input
                    type="email"
                    value={settings.emailFrom}
                    onChange={(e) =>
                      setSettings({ ...settings, emailFrom: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.emailHost}
                    onChange={(e) =>
                      setSettings({ ...settings, emailHost: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={settings.emailPort}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailPort: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <p className="text-sm text-gray-500">
                  Note: Email credentials should be set via environment variables for security
                </p>

                <button
                  onClick={handleSettingsSave}
                  className="w-full rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 flex items-center justify-center gap-2 transition-colors"
                >
                  <Save size={18} />
                  Save Settings
                </button>
              </form>
            </div>
          </div>

          {/* Email Templates */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 h-fit">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Email Templates</h2>
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full rounded-lg px-4 py-2 text-left font-medium transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>

            {selectedTemplate && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="mb-3 font-semibold text-gray-900">
                  {selectedTemplate.name}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={selectedTemplate.subject}
                      onChange={(e) =>
                        setSelectedTemplate({
                          ...selectedTemplate,
                          subject: e.target.value,
                        })
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      HTML Content
                    </label>
                    <textarea
                      value={selectedTemplate.htmlContent}
                      onChange={(e) =>
                        setSelectedTemplate({
                          ...selectedTemplate,
                          htmlContent: e.target.value,
                        })
                      }
                      rows={6}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm font-mono focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleTemplateSave}
                    className="w-full rounded-lg bg-orange-500 px-3 py-2 text-sm text-white font-medium hover:bg-orange-600 transition-colors"
                  >
                    Save Template
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
