import { useState } from 'react'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Calculator,
  Plus,
  Trash2,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react'

const gradePoints: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
}

const gradeColors: Record<string, string> = {
  A: 'bg-green-500/20 text-green-500',
  B: 'bg-blue-500/20 text-blue-500',
  C: 'bg-yellow-500/20 text-yellow-500',
  D: 'bg-orange-500/20 text-orange-500',
  E: 'bg-red-500/20 text-red-500',
  F: 'bg-red-600/20 text-red-600',
}

interface CourseInput {
  id: string
  code: string
  title: string
  units: number
  grade: string
}

export default function CGPACalculator() {
  const { semesterResults, addSemesterResult, calculateCGPA } = useStore()
  const [courses, setCourses] = useState<CourseInput[]>([
    { id: '1', code: '', title: '', units: 3, grade: 'A' },
  ])
  const [semester, setSemester] = useState('First')
  const [session, setSession] = useState('2023/2024')

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), code: '', title: '', units: 3, grade: 'A' }])
  }

  const updateCourse = (id: string, field: keyof CourseInput, value: string | number) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id))
    }
  }

  const calculateGPA = () => {
    let totalPoints = 0
    let totalUnits = 0
    courses.forEach((course) => {
      if (course.code) {
        totalPoints += gradePoints[course.grade] * course.units
        totalUnits += course.units
      }
    })
    return totalUnits > 0 ? totalPoints / totalUnits : 0
  }

  const handleSave = () => {
    const validCourses = courses.filter((c) => c.code)
    if (validCourses.length === 0) {
      toast.error('Please add at least one course')
      return
    }

    addSemesterResult({
      id: Date.now().toString(),
      semester,
      session,
      courses: validCourses.map((c) => ({
        courseId: c.id,
        courseCode: c.code,
        units: c.units,
        grade: c.grade as any,
      })),
    })

    toast.success('Semester result saved!')
    setCourses([{ id: Date.now().toString(), code: '', title: '', units: 3, grade: 'A' }])
  }

  const gpa = calculateGPA()
  const cgpa = calculateCGPA()

  const getGradeClass = (gpa: number) => {
    if (gpa >= 4.5) return 'First Class'
    if (gpa >= 3.5) return 'Second Class Upper'
    if (gpa >= 2.5) return 'Second Class Lower'
    if (gpa >= 1.5) return 'Third Class'
    return 'Pass'
  }

  return (
    <DashboardLayout title="CGPA Calculator">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#8B5CF6]" />
                Calculate GPA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="text-white mb-2 block">Semester</Label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="First">First Semester</option>
                    <option value="Second">Second Semester</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white mb-2 block">Session</Label>
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="2023/2024">2023/2024</option>
                    <option value="2022/2023">2022/2023</option>
                    <option value="2021/2022">2021/2022</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-3">
                      <Input
                        placeholder="Course Code"
                        value={course.code}
                        onChange={(e) => updateCourse(course.id, 'code', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        placeholder="Course Title"
                        value={course.title}
                        onChange={(e) => updateCourse(course.id, 'title', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        value={course.units}
                        onChange={(e) => updateCourse(course.id, 'units', parseInt(e.target.value))}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      >
                        {[1, 2, 3, 4, 5, 6].map((u) => (
                          <option key={u} value={u}>{u} Units</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                        className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      >
                        {['A', 'B', 'C', 'D', 'E', 'F'].map((g) => (
                          <option key={g} value={g}>Grade {g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => removeCourse(course.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5"
                  onClick={addCourse}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Course
                </Button>
                <Button
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                  onClick={handleSave}
                >
                  Save Result
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Semester History */}
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader>
              <CardTitle className="text-white">Semester History</CardTitle>
            </CardHeader>
            <CardContent>
              {semesterResults.length > 0 ? (
                <div className="space-y-3">
                  {semesterResults.map((result) => {
                    const semesterGPA =
                      result.courses.reduce(
                        (acc, c) => acc + gradePoints[c.grade] * c.units,
                        0
                      ) /
                      result.courses.reduce((acc, c) => acc + c.units, 0)

                    return (
                      <div
                        key={result.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {result.session} - {result.semester} Semester
                          </p>
                          <p className="text-white/60 text-sm">
                            {result.courses.length} courses
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#8B5CF6]">
                            {semesterGPA.toFixed(2)}
                          </p>
                          <p className="text-white/60 text-sm">GPA</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60">No semester results saved yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] border-none">
            <CardContent className="p-6 text-center">
              <p className="text-white/80 mb-2">Current GPA</p>
              <p className="text-5xl font-bold text-white mb-2">{gpa.toFixed(2)}</p>
              <Badge className="bg-white/20 text-white">
                {getGradeClass(gpa)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-white/5">
            <CardContent className="p-6 text-center">
              <p className="text-white/60 mb-2">Cumulative GPA</p>
              <p className="text-4xl font-bold text-white mb-2">{cgpa.toFixed(2)}</p>
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Across {semesterResults.length} semesters</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-sm">Grade Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(gradePoints).map(([grade, points]) => (
                  <div key={grade} className="flex items-center justify-between">
                    <Badge className={gradeColors[grade]}>Grade {grade}</Badge>
                    <span className="text-white/60">{points} points</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-[#8B5CF6]" />
                <div>
                  <p className="text-white font-medium">Classification</p>
                  <p className="text-white/60 text-sm">Based on CGPA</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className={`flex justify-between p-2 rounded ${cgpa >= 4.5 ? 'bg-green-500/20' : ''}`}>
                  <span className={cgpa >= 4.5 ? 'text-green-500' : 'text-white/60'}>First Class</span>
                  <span className="text-white/60">4.50 - 5.00</span>
                </div>
                <div className={`flex justify-between p-2 rounded ${cgpa >= 3.5 && cgpa < 4.5 ? 'bg-blue-500/20' : ''}`}>
                  <span className={cgpa >= 3.5 && cgpa < 4.5 ? 'text-blue-500' : 'text-white/60'}>Second Class Upper</span>
                  <span className="text-white/60">3.50 - 4.49</span>
                </div>
                <div className={`flex justify-between p-2 rounded ${cgpa >= 2.5 && cgpa < 3.5 ? 'bg-yellow-500/20' : ''}`}>
                  <span className={cgpa >= 2.5 && cgpa < 3.5 ? 'text-yellow-500' : 'text-white/60'}>Second Class Lower</span>
                  <span className="text-white/60">2.50 - 3.49</span>
                </div>
                <div className={`flex justify-between p-2 rounded ${cgpa >= 1.5 && cgpa < 2.5 ? 'bg-orange-500/20' : ''}`}>
                  <span className={cgpa >= 1.5 && cgpa < 2.5 ? 'text-orange-500' : 'text-white/60'}>Third Class</span>
                  <span className="text-white/60">1.50 - 2.49</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
