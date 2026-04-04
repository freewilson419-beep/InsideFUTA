import { useState } from 'react'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  MapPin,
  Edit2,
  Camera,
  QrCode,
  Link as LinkIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user, updateProfile } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  })

  const handleSave = () => {
    updateProfile(formData)
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="bg-[#1A1A1A] border-white/5 mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={user?.avatar} className="object-cover" />
                  <AvatarFallback className="bg-[#8B5CF6] text-white text-4xl">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#8B5CF6] rounded-full flex items-center justify-center hover:bg-[#7C3AED] transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                <p className="text-white/60 mb-3">{user?.matricNumber}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6]">{user?.department}</Badge>
                  <Badge className="bg-white/10 text-white/70">{user?.level} Level</Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/id-card">
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                    <QrCode className="w-4 h-4 mr-2" /> ID Card
                  </Button>
                </Link>
                <Button
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="bg-[#1A1A1A] border border-white/10 p-1 mb-6">
            <TabsTrigger value="info" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="academic" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              Academic
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-0">
            <Card className="bg-[#1A1A1A] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
                <CardDescription className="text-white/60">
                  Manage your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-white/40" /> Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    ) : (
                      <div className="p-3 bg-white/5 rounded-lg text-white">{user?.name}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-white/40" /> Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    ) : (
                      <div className="p-3 bg-white/5 rounded-lg text-white">{user?.email}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <Phone className="w-4 h-4 text-white/40" /> Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Add phone number"
                      />
                    ) : (
                      <div className="p-3 bg-white/5 rounded-lg text-white">
                        {user?.phone || <span className="text-white/40">Not set</span>}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-white/40" /> Location
                    </Label>
                    <div className="p-3 bg-white/5 rounded-lg text-white">Akure, Ondo State</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      className="bg-white/5 border-white/10 text-white min-h-[100px]"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="p-3 bg-white/5 rounded-lg text-white min-h-[100px]">
                      {user?.bio || <span className="text-white/40">No bio added yet</span>}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/5"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="mt-0">
            <Card className="bg-[#1A1A1A] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Academic Information</CardTitle>
                <CardDescription className="text-white/60">
                  Your academic details and enrollment information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-white/40" /> Matric Number
                    </Label>
                    <div className="p-3 bg-white/5 rounded-lg text-white">{user?.matricNumber}</div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-white/40" /> Department
                    </Label>
                    <div className="p-3 bg-white/5 rounded-lg text-white">{user?.department}</div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-white/40" /> Current Level
                    </Label>
                    <div className="p-3 bg-white/5 rounded-lg text-white">{user?.level} Level</div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-white/40" /> Academic Session
                    </Label>
                    <div className="p-3 bg-white/5 rounded-lg text-white">2023/2024</div>
                  </div>
                </div>

                <div className="p-4 bg-[#8B5CF6]/10 rounded-xl border border-[#8B5CF6]/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Student ID Card</p>
                      <p className="text-white/60 text-sm">Download your digital ID card with QR code</p>
                    </div>
                    <Link to="/id-card">
                      <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
                        <QrCode className="w-4 h-4 mr-2" /> View ID Card
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <Card className="bg-[#1A1A1A] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-white/60">
                  Your recent actions and contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Downloaded past question', target: 'CSC 211 - 2023 Final', time: '2 hours ago' },
                    { action: 'Posted in forum', target: 'Help with MTS 201', time: '1 day ago' },
                    { action: 'Submitted assignment', target: 'PHY 112 Lab Report', time: '2 days ago' },
                    { action: 'Joined study group', target: 'CSC 211 Study Group', time: '3 days ago' },
                    { action: 'Listed item for sale', target: 'MacBook Pro 2020', time: '1 week ago' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 bg-[#8B5CF6]/20 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-[#8B5CF6]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-white/60 text-sm">{activity.target}</p>
                      </div>
                      <span className="text-white/40 text-sm">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
