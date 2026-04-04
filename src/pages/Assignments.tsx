import { useState } from 'react'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
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
import { format, parseISO, isBefore, addDays } from 'date-fns'
import {
  FileText,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Trash2,
  BookOpen,
} from 'lucide-react'

export default function Assignments() {
  const { assignments, courses, addAssignment, deleteAssignment, submitAssignment } = useStore()
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted'>('all')
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    courseId: '',
    deadline: '',
    maxScore: 100,
  })

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'all') return true
    return a.status === filter
  })

  const pendingCount = assignments.filter((a) => a.status === 'pending').length
  const submittedCount = assignments.filter((a) => a.status === 'submitted').length
  const overdueCount = assignments.filter(
    (a) => a.status === 'pending' && isBefore(parseISO(a.deadline), new Date())
  ).length

  const handleAddAssignment = () => {
    if (!newAssignment.title || !newAssignment.courseId || !newAssignment.deadline) {
      toast.error('Please fill in all required fields')
      return
    }

    const course = courses.find((c) => c.id === newAssignment.courseId)
    if (!course) return

    addAssignment({
      title: newAssignment.title,
      description: newAssignment.description,
      courseId: course.id,
      courseCode: course.code,
      deadline: newAssignment.deadline,
      status: 'pending',
      maxScore: newAssignment.maxScore,
    })

    setNewAssignment({
      title: '',
      description: '',
      courseId: '',
      deadline: '',
      maxScore: 100,
    })
    toast.success('Assignment added!')
  }

  const handleSubmit = (id: string) => {
    submitAssignment(id)
    toast.success('Assignment submitted successfully!')
  }

  const getStatusBadge = (assignment: typeof assignments[0]) => {
    if (assignment.status === 'submitted') {
      return (
        <Badge className="bg-green-500/20 text-green-500">
          <CheckCircle className="w-3 h-3 mr-1" /> Submitted
        </Badge>
      )
    }
    if (isBefore(parseISO(assignment.deadline), new Date())) {
      return (
        <Badge className="bg-red-500/20 text-red-500">
          <AlertCircle className="w-3 h-3 mr-1" /> Overdue
        </Badge>
      )
    }
    if (isBefore(parseISO(assignment.deadline), addDays(new Date(), 2))) {
      return (
        <Badge className="bg-orange-500/20 text-orange-500">
          <Clock className="w-3 h-3 mr-1" /> Due Soon
        </Badge>
      )
    }
    return (
      <Badge className="bg-blue-500/20 text-blue-500">
        <Clock className="w-3 h-3 mr-1" /> Pending
      </Badge>
    )
  }

  return (
    <DashboardLayout title="Assignments">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{pendingCount}</p>
              </div>
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Submitted</p>
                <p className="text-2xl font-bold text-white">{submittedCount}</p>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Overdue</p>
                <p className="text-2xl font-bold text-white">{overdueCount}</p>
              </div>
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Add */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {(['all', 'pending', 'submitted'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg capitalize transition-all ${
                filter === f
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Assignment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-white">Title</Label>
                <Input
                  placeholder="Assignment title..."
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Input
                  placeholder="Brief description..."
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Course</Label>
                <select
                  value={newAssignment.courseId}
                  onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}
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
              <div className="space-y-2">
                <Label className="text-white">Deadline</Label>
                <Input
                  type="datetime-local"
                  value={newAssignment.deadline}
                  onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Max Score</Label>
                <Input
                  type="number"
                  value={newAssignment.maxScore}
                  onChange={(e) => setNewAssignment({ ...newAssignment, maxScore: parseInt(e.target.value) })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <Button onClick={handleAddAssignment} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
                Add Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="bg-[#1A1A1A] border-white/5">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      assignment.status === 'submitted'
                        ? 'bg-green-500/20'
                        : isBefore(parseISO(assignment.deadline), new Date())
                        ? 'bg-red-500/20'
                        : 'bg-orange-500/20'
                    }`}>
                      <FileText className={`w-6 h-6 ${
                        assignment.status === 'submitted'
                          ? 'text-green-500'
                          : isBefore(parseISO(assignment.deadline), new Date())
                          ? 'text-red-500'
                          : 'text-orange-500'
                      }`} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{assignment.title}</h4>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="text-white/60 text-sm flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {assignment.courseCode}
                        </span>
                        <span className="text-white/60 text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due {format(parseISO(assignment.deadline), 'MMM d, yyyy h:mm a')}
                        </span>
                        {assignment.score !== undefined && (
                          <span className="text-green-500 text-sm font-medium">
                            Score: {assignment.score}/{assignment.maxScore}
                          </span>
                        )}
                      </div>
                      {assignment.description && (
                        <p className="text-white/50 text-sm mt-2">{assignment.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(assignment)}
                    {assignment.status === 'pending' && (
                      <Button
                        size="sm"
                        className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                        onClick={() => handleSubmit(assignment.id)}
                      >
                        Submit
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => deleteAssignment(assignment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No assignments found</h3>
            <p className="text-white/60">Add your first assignment to get started.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
