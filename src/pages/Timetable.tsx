import { useState } from 'react'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function Timetable() {
  const { timetable, addTimetableEntry, deleteTimetableEntry, courses } = useStore()
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [newEntry, setNewEntry] = useState({
    courseId: '',
    day: 'Monday' as const,
    startTime: '',
    endTime: '',
    venue: '',
  })

  const dayEntries = timetable
    .filter((entry) => entry.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const handleAddEntry = () => {
    if (!newEntry.courseId || !newEntry.startTime || !newEntry.endTime || !newEntry.venue) {
      toast.error('Please fill in all fields')
      return
    }

    const course = courses.find((c) => c.id === newEntry.courseId)
    if (!course) return

    addTimetableEntry({
      ...newEntry,
      courseCode: course.code,
      courseTitle: course.title,
    })

    setNewEntry({
      courseId: '',
      day: 'Monday',
      startTime: '',
      endTime: '',
      venue: '',
    })
    toast.success('Class added to timetable!')
  }

  const handleDelete = (id: string) => {
    deleteTimetableEntry(id)
    toast.success('Class removed from timetable')
  }

  const getDayClasses = (day: string) => {
    return timetable.filter((entry) => entry.day === day).length
  }

  return (
    <DashboardLayout title="Timetable">
      {/* Day Selector */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedDay === day
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {day}
              <span className={`ml-2 text-xs ${selectedDay === day ? 'text-white/70' : 'text-white/40'}`}>
                ({getDayClasses(day)})
              </span>
            </button>
          ))}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Add Class to Timetable</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-white">Course</Label>
                <select
                  value={newEntry.courseId}
                  onChange={(e) => setNewEntry({ ...newEntry, courseId: e.target.value })}
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
                <Label className="text-white">Day</Label>
                <select
                  value={newEntry.day}
                  onChange={(e) => setNewEntry({ ...newEntry, day: e.target.value as any })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Start Time</Label>
                  <Input
                    type="time"
                    value={newEntry.startTime}
                    onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">End Time</Label>
                  <Input
                    type="time"
                    value={newEntry.endTime}
                    onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Venue</Label>
                <Input
                  placeholder="e.g., LT 1, Computer Lab"
                  value={newEntry.venue}
                  onChange={(e) => setNewEntry({ ...newEntry, venue: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <Button onClick={handleAddEntry} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
                Add to Timetable
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timetable for Selected Day */}
      <Card className="bg-[#1A1A1A] border-white/5">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#8B5CF6]" />
            {selectedDay}'s Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dayEntries.length > 0 ? (
            <div className="space-y-4">
              {dayEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 p-5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[#8B5CF6] font-bold text-lg">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-lg">{entry.courseCode}</h4>
                    <p className="text-white/60">{entry.courseTitle}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-white/50 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {entry.startTime} - {entry.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {entry.venue}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">No classes scheduled</h3>
              <p className="text-white/60 mb-6">Add your first class to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card className="bg-[#1A1A1A] border-white/5 mt-6">
        <CardHeader>
          <CardTitle className="text-white">Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {days.map((day) => {
              const count = getDayClasses(day)
              const isToday = day === selectedDay
              return (
                <div
                  key={day}
                  className={`p-4 rounded-xl text-center cursor-pointer transition-all ${
                    isToday
                      ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedDay(day)}
                >
                  <p className={`text-sm mb-2 ${isToday ? 'text-[#8B5CF6]' : 'text-white/60'}`}>
                    {day.slice(0, 3)}
                  </p>
                  <p className={`text-2xl font-bold ${isToday ? 'text-white' : 'text-white/80'}`}>
                    {count}
                  </p>
                  <p className="text-white/40 text-xs">classes</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
