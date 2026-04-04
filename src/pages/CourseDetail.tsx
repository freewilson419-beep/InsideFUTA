import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Video,
  Link as LinkIcon,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  User,
  Calendar,
  Clock,
} from 'lucide-react'

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const { courses, addMaterial, deleteMaterial } = useStore()
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    type: 'pdf' as const,
    url: '',
  })

  const course = courses.find((c) => c.id === id)

  if (!course) {
    return (
      <DashboardLayout title="Course Not Found">
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
          <p className="text-white/60 mb-6">The course you're looking for doesn't exist.</p>
          <Link to="/courses">
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const handleAddMaterial = () => {
    if (!newMaterial.title || !newMaterial.url) {
      toast.error('Please fill in all fields')
      return
    }
    addMaterial(course.id, {
      ...newMaterial,
      uploadedBy: 'You',
      size: '2.5MB',
    })
    setNewMaterial({ title: '', type: 'pdf', url: '' })
    toast.success('Material added successfully!')
  }

  const handleDeleteMaterial = (materialId: string) => {
    deleteMaterial(course.id, materialId)
    toast.success('Material deleted!')
  }

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />
      case 'link':
        return <LinkIcon className="w-5 h-5 text-green-500" />
      default:
        return <FileText className="w-5 h-5 text-white/60" />
    }
  }

  const pdfMaterials = course.materials.filter((m) => m.type === 'pdf')
  const videoMaterials = course.materials.filter((m) => m.type === 'video')
  const linkMaterials = course.materials.filter((m) => m.type === 'link')

  return (
    <DashboardLayout title={course.code}>
      {/* Back Button */}
      <Link to="/courses">
        <Button variant="ghost" className="text-white/60 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
        </Button>
      </Link>

      {/* Course Header */}
      <Card className="bg-[#1A1A1A] border-white/5 mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-[#8B5CF6]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{course.code}</h1>
                <p className="text-white/60 text-lg mb-3">{course.title}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/10 text-white/70">
                    <User className="w-3 h-3 mr-1" /> {course.lecturer}
                  </Badge>
                  <Badge className="bg-white/10 text-white/70">
                    <Calendar className="w-3 h-3 mr-1" /> {course.level} Level
                  </Badge>
                  <Badge className="bg-white/10 text-white/70">
                    {course.department}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="md:w-64">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Course Progress</span>
                <span className="text-white font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-3 bg-white/10" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <TabsList className="bg-[#1A1A1A] border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              All ({course.materials.length})
            </TabsTrigger>
            <TabsTrigger value="pdf" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              PDFs ({pdfMaterials.length})
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              Videos ({videoMaterials.length})
            </TabsTrigger>
            <TabsTrigger value="links" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              Links ({linkMaterials.length})
            </TabsTrigger>
          </TabsList>

          {/* Add Material Dialog */}
          <div className="flex gap-2">
            <Input
              placeholder="Material title..."
              value={newMaterial.title}
              onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
              className="w-48 bg-white/5 border-white/10 text-white"
            />
            <select
              value={newMaterial.type}
              onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value as any })}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
            </select>
            <Input
              placeholder="URL..."
              value={newMaterial.url}
              onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
              className="w-48 bg-white/5 border-white/10 text-white"
            />
            <Button onClick={handleAddMaterial} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <MaterialsList materials={course.materials} onDelete={handleDeleteMaterial} getIcon={getMaterialIcon} />
        </TabsContent>

        <TabsContent value="pdf" className="mt-0">
          <MaterialsList materials={pdfMaterials} onDelete={handleDeleteMaterial} getIcon={getMaterialIcon} />
        </TabsContent>

        <TabsContent value="video" className="mt-0">
          <MaterialsList materials={videoMaterials} onDelete={handleDeleteMaterial} getIcon={getMaterialIcon} />
        </TabsContent>

        <TabsContent value="links" className="mt-0">
          <MaterialsList materials={linkMaterials} onDelete={handleDeleteMaterial} getIcon={getMaterialIcon} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

function MaterialsList({
  materials,
  onDelete,
  getIcon,
}: {
  materials: any[]
  onDelete: (id: string) => void
  getIcon: (type: string) => React.ReactNode
}) {
  if (materials.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-white font-medium mb-2">No materials yet</h3>
        <p className="text-white/60">Add your first material to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {materials.map((material) => (
        <Card key={material.id} className="bg-[#1A1A1A] border-white/5 card-hover">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                {getIcon(material.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{material.title}</h4>
                <div className="flex items-center gap-2 text-white/50 text-sm mt-1">
                  <span>{material.size}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(material.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-white/40 text-xs mt-1">by {material.uploadedBy}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-white/10 text-white hover:bg-white/5"
                onClick={() => window.open(material.url, '_blank')}
              >
                {material.type === 'link' ? (
                  <><ExternalLink className="w-4 h-4 mr-1" /> Open</>
                ) : (
                  <><Download className="w-4 h-4 mr-1" /> Download</>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                onClick={() => onDelete(material.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
