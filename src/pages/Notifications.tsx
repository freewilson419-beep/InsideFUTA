import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Bell,
  FileText,
  Megaphone,
  MessageSquare,
  ShoppingBag,
  CheckCircle,
  Trash2,
  CheckCheck,
} from 'lucide-react'

const typeIcons: Record<string, React.ReactNode> = {
  assignment: <FileText className="w-5 h-5" />,
  announcement: <Megaphone className="w-5 h-5" />,
  message: <MessageSquare className="w-5 h-5" />,
  marketplace: <ShoppingBag className="w-5 h-5" />,
  general: <Bell className="w-5 h-5" />,
}

const typeColors: Record<string, string> = {
  assignment: 'bg-orange-500/20 text-orange-500',
  announcement: 'bg-blue-500/20 text-blue-500',
  message: 'bg-green-500/20 text-green-500',
  marketplace: 'bg-purple-500/20 text-purple-500',
  general: 'bg-white/10 text-white/70',
}

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useStore()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllRead = () => {
    markAllNotificationsRead()
    toast.success('All notifications marked as read')
  }

  const handleClear = () => {
    clearNotifications()
    toast.success('Notifications cleared')
  }

  return (
    <DashboardLayout title="Notifications">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-white text-xl font-semibold">
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-3 bg-[#8B5CF6] text-white">{unreadCount} new</Badge>
            )}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5"
            onClick={handleMarkAllRead}
          >
            <CheckCheck className="w-4 h-4 mr-2" /> Mark All Read
          </Button>
          <Button
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5"
            onClick={handleClear}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear All
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <Card className="bg-[#1A1A1A] border-white/5">
        <CardContent className="p-0">
          {notifications.length > 0 ? (
            <div className="divide-y divide-white/5">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-5 hover:bg-white/5 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-[#8B5CF6]/5' : ''
                  }`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[notification.type]}`}>
                    {typeIcons[notification.type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-white font-medium">{notification.title}</h4>
                        <p className="text-white/60 text-sm mt-1">{notification.message}</p>
                        <p className="text-white/40 text-xs mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#8B5CF6] rounded-full flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Bell className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">No notifications</h3>
              <p className="text-white/60">You're all caught up!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
