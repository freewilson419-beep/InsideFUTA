import { useState } from 'react'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  Book,
  Download,
  Plus,
  Search,
  FileText,
  Calendar,
  GraduationCap,
  Eye,
} from 'lucide-react'

const years = ['2024', '2023', '2022', '2021', '2020', '2019']
const semesters = ['First', 'Second']
const examTypes = [
  { value: 'midterm', label: 'Midterm' },
  { value: 'final', label: 'Final Exam' },
  { value: 'quiz', label: 'Quiz' },
]

export default function PastQuestions() {
  const { pastQuestions, courses, addPastQuestion, incrementDownloads } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [newPQ, setNewPQ] = useState({
    courseId: '',
    year: '',
    semester: '',
    examType: '',
    fileUrl: '',
  })

  const filteredPQs = pastQuestions.filter((pq) => {
    const matchesSearch =
      pq.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pq.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesYear = !selectedYear || pq.year === selectedYear
    const matchesType = !selectedType || pq.examType === selectedType
    return matchesSearch && matchesYear && matchesType
  })

  const handleAddPQ = () => {
    if (!newPQ.courseId || !newPQ.year || !newPQ.semester || !newPQ.examType) {
      toast.error('Please fill in all fields')
      return
    }

    const course = courses.find((c) => c.id === newPQ.courseId)
    if (!course) return

    addPastQuestion({
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      year: newPQ.year,
      semester: newPQ.semester,
      examType: newPQ.examType as any,
      fileUrl: newPQ.fileUrl || '#',
      fileSize: '2.5MB',
      uploadedBy: 'You',
    })

    setNewPQ({ courseId: '', year: '', semester: '', examType: '', fileUrl: '' })
    toast.success('Past question added!')
  }

  const handleDownload = (id: string) => {
    incrementDownloads(id)
    toast.success('Download started!')
  }

  const groupedByCourse = filteredPQs.reduce((acc, pq) => {
    if (!acc[pq.courseCode]) {
      acc[pq.courseCode] = []
    }
    acc[pq.courseCode].push(pq)
    return acc
  }, {} as Record<string, typeof pastQuestions>)

  return (
    <DashboardLayout title="Past Questions Bank">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <p className="text-white/60 text-sm">Total Papers</p>
            <p className="text-2xl font-bold text-white">{pastQuestions.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <p className="text-white/60 text-sm">Courses</p>
            <p className="text-2xl font-bold text-white">{Object.keys(groupedByCourse).length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <p className="text-white/60 text-sm">Total Downloads</p>
            <p className="text-2xl font-bold text-white">
              {pastQuestions.reduce((acc, pq) => acc + pq.downloads, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <p className="text-white/60 text-sm">This Year</p>
            <p className="text-2xl font-bold text-white">
              {pastQuestions.filter((pq) => pq.year === '2024').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-48 bg-white/5 border-white/10 text-white"
            />
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="">All Types</option>
            {examTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
              <Plus className="w-4 h-4 mr-2" /> Upload Past Question
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Upload Past Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-white">Course</Label>
                <select
                  value={newPQ.courseId}
                  onChange={(e) => setNewPQ({ ...newPQ, courseId: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="">Select course...</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Year</Label>
                  <select
                    value={newPQ.year}
                    onChange={(e) => setNewPQ({ ...newPQ, year: e.target.value })}
                    className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="">Select year...</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Semester</Label>
                  <select
                    value={newPQ.semester}
                    onChange={(e) => setNewPQ({ ...newPQ, semester: e.target.value })}
                    className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="">Select...</option>
                    {semesters.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Exam Type</Label>
                <select
                  value={newPQ.examType}
                  onChange={(e) => setNewPQ({ ...newPQ, examType: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="">Select type...</option>
                  {examTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">File URL (optional)</Label>
                <Input
                  placeholder="https://..."
                  value={newPQ.fileUrl}
                  onChange={(e) => setNewPQ({ ...newPQ, fileUrl: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <Button onClick={handleAddPQ} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
                Upload Past Question
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Past Questions by Course */}
      <div className="space-y-6">
        {Object.entries(groupedByCourse).length > 0 ? (
          Object.entries(groupedByCourse).map(([courseCode, questions]) => (
            <Card key={courseCode} className="bg-[#1A1A1A] border-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Book className="w-5 h-5 text-[#8B5CF6]" />
                  {courseCode} - {questions[0].courseTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {questions.map((pq) => (
                    <div
                      key={pq.id}
                      className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-white/10 text-white/70 text-xs">
                              {pq.year}
                            </Badge>
                            <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs">
                              {pq.examType}
                            </Badge>
                          </div>
                          <p className="text-white text-sm">{pq.semester} Semester</p>
                          <p className="text-white/50 text-xs mt-1">{pq.fileSize}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-white/10 text-white hover:bg-white/5"
                          onClick={() => handleDownload(pq.id)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {pq.downloads}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white/60 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-16">
            <Book className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No past questions found</h3>
            <p className="text-white/60">Upload past questions to help other students.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
