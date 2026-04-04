import { useState } from 'react'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Bell,
  Moon,
  Shield,
  Lock,
  Mail,
  Smartphone,
  Globe,
  Trash2,
  LogOut,
} from 'lucide-react'

export default function Settings() {
  const { logout } = useStore()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    assignmentReminders: true,
    darkMode: true,
    twoFactor: false,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] })
    toast.success('Setting updated')
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    window.location.href = '/login'
  }

  const SettingItem = ({
    icon: Icon,
    title,
    description,
    checked,
    onChange,
  }: {
    icon: any
    title: string
    description: string
    checked: boolean
    onChange: () => void
  }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#8B5CF6]" />
        </div>
        <div>
          <p className="text-white font-medium">{title}</p>
          <p className="text-white/60 text-sm">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors relative ${
          checked ? 'bg-[#8B5CF6]' : 'bg-white/20'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Notifications */}
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#8B5CF6]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingItem
              icon={Mail}
              title="Email Notifications"
              description="Receive updates via email"
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
            <SettingItem
              icon={Smartphone}
              title="Push Notifications"
              description="Receive push notifications"
              checked={settings.pushNotifications}
              onChange={() => handleToggle('pushNotifications')}
            />
            <SettingItem
              icon={Bell}
              title="Assignment Reminders"
              description="Get reminded before deadlines"
              checked={settings.assignmentReminders}
              onChange={() => handleToggle('assignmentReminders')}
            />
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Moon className="w-5 h-5 text-[#8B5CF6]" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SettingItem
              icon={Moon}
              title="Dark Mode"
              description="Use dark theme"
              checked={settings.darkMode}
              onChange={() => handleToggle('darkMode')}
            />
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#8B5CF6]" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingItem
              icon={Lock}
              title="Two-Factor Authentication"
              description="Add extra security to your account"
              checked={settings.twoFactor}
              onChange={() => handleToggle('twoFactor')}
            />
            <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#8B5CF6]" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete Account
            </Button>
            <Button
              variant="outline"
              className="w-full border-white/10 text-white hover:bg-white/5"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
