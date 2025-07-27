"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Shield, Mail, Database, Globe } from "lucide-react"

export function SystemSettings() {
  const [settings, setSettings] = useState({
    systemName: "Clinic Management System",
    systemNameAr: "نظام إدارة العيادات",
    maintenanceMode: false,
    allowRegistration: false,
    emailNotifications: true,
    smsNotifications: true,
    backupEnabled: true,
    autoBackupInterval: "daily",
  })

  const handleSaveSettings = () => {
    console.log("Saving settings:", settings)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-gray-600">Configure global system settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription>Basic system configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name (English)</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemNameAr">System Name (Arabic)</Label>
                  <Input
                    id="systemNameAr"
                    value={settings.systemNameAr}
                    onChange={(e) => setSettings({ ...settings, systemNameAr: e.target.value })}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-600">Enable to restrict system access</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowRegistration">Allow New Registration</Label>
                  <p className="text-sm text-gray-600">Currently disabled for security</p>
                </div>
                <Switch
                  id="allowRegistration"
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>System security and access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Session Timeout</h3>
                    <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                  </div>
                  <Badge variant="default">7 days</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Password Policy</h3>
                    <p className="text-sm text-gray-600">Minimum password requirements</p>
                  </div>
                  <Badge variant="default">Standard</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Send email notifications to users</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-gray-600">Send SMS notifications to users</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Backup Settings
              </CardTitle>
              <CardDescription>Configure system backup and recovery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="backupEnabled">Automatic Backup</Label>
                  <p className="text-sm text-gray-600">Enable automatic system backups</p>
                </div>
                <Switch
                  id="backupEnabled"
                  checked={settings.backupEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, backupEnabled: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <div className="flex space-x-2">
                  {["daily", "weekly", "monthly"].map((interval) => (
                    <Button
                      key={interval}
                      variant={settings.autoBackupInterval === interval ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, autoBackupInterval: interval })}
                    >
                      {interval.charAt(0).toUpperCase() + interval.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">Last backup: January 15, 2024 at 2:00 AM</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Localization Settings
              </CardTitle>
              <CardDescription>Configure language and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Default Language</h3>
                    <p className="text-sm text-gray-600">System default language</p>
                  </div>
                  <Badge variant="default">Arabic</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Supported Languages</h3>
                    <p className="text-sm text-gray-600">Available system languages</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="default">Arabic</Badge>
                    <Badge variant="default">English</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Currency</h3>
                    <p className="text-sm text-gray-600">Default system currency</p>
                  </div>
                  <Badge variant="default">SAR</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  )
}
