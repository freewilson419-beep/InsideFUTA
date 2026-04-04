import { useState } from 'react'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle,
  Send,
  Users,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
} from 'lucide-react'

export default function Chat() {
  const { chatGroups, sendMessage, user } = useStore()
  const [selectedGroup, setSelectedGroup] = useState(chatGroups[0]?.id || '')
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const group = chatGroups.find((g) => g.id === selectedGroup)

  const filteredGroups = chatGroups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedGroup) return

    sendMessage(selectedGroup, {
      content: messageInput,
      senderId: user?.id || '',
      senderName: user?.name || '',
      senderAvatar: user?.avatar,
      type: 'text',
    })

    setMessageInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <DashboardLayout title="Chat">
      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar - Chat List */}
        <Card className="bg-[#1A1A1A] border-white/5 lg:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#8B5CF6]" />
              Messages
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 text-white"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {filteredGroups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroup(g.id)}
                  className={`w-full flex items-center gap-3 p-4 transition-colors ${
                    selectedGroup === g.id
                      ? 'bg-[#8B5CF6]/20 border-l-4 border-[#8B5CF6]'
                      : 'hover:bg-white/5 border-l-4 border-transparent'
                  }`}
                >
                  <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
                    <span className="text-[#8B5CF6] font-bold">
                      {g.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{g.name}</p>
                    <p className="text-white/50 text-sm truncate">
                      {g.courseCode || `${g.members.length} members`}
                    </p>
                  </div>
                  {g.messages.length > 0 && (
                    <Badge className="bg-[#8B5CF6] text-white">
                      {g.messages.length}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="bg-[#1A1A1A] border-white/5 lg:col-span-2 flex flex-col">
          {group ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
                      <span className="text-[#8B5CF6] font-bold">
                        {group.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{group.name}</p>
                      <p className="text-white/50 text-sm flex items-center gap-1">
                        <Users className="w-3 h-3" /> {group.members.length} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {group.messages.length > 0 ? (
                  group.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderId === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          msg.senderId === user?.id
                            ? 'bg-[#8B5CF6] text-white'
                            : 'bg-white/10 text-white'
                        } rounded-2xl px-4 py-3`}
                      >
                        {msg.senderId !== user?.id && (
                          <p className="text-xs text-white/70 mb-1">{msg.senderName}</p>
                        )}
                        <p>{msg.content}</p>
                        <p className="text-xs text-white/50 mt-1 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/60">No messages yet</p>
                    <p className="text-white/40 text-sm">Start the conversation!</p>
                  </div>
                )}
              </CardContent>

              {/* Input Area */}
              <CardContent className="border-t border-white/5 p-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-white/5 border-white/10 text-white"
                  />
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">Select a chat to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
