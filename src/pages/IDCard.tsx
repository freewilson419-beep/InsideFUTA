import { useRef } from 'react'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import { Download, Share2, Printer, School, User, GraduationCap, Building2, Calendar } from 'lucide-react'

export default function IDCard() {
  const { user } = useStore()
  const cardRef = useRef<HTMLDivElement>(null)

  const qrData = JSON.stringify({
    name: user?.name,
    matricNumber: user?.matricNumber,
    department: user?.department,
    level: user?.level,
    type: 'student',
  })

  const handleDownload = () => {
    toast.success('ID Card downloaded!')
  }

  const handleShare = () => {
    toast.success('Share link copied to clipboard!')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <DashboardLayout title="Student ID Card">
      <div className="max-w-2xl mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mb-8">
          <Button
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
          <Button
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
        </div>

        {/* ID Card */}
        <div ref={cardRef} className="print:shadow-none">
          <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#262626] border-white/10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <School className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">FUTA</h3>
                    <p className="text-white/80 text-xs">Federal University of Technology, Akure</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-xs">Student ID</p>
                  <p className="text-white font-mono text-sm">{user?.matricNumber}</p>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Photo */}
                <div className="flex flex-col items-center">
                  <Avatar className="w-32 h-32 border-4 border-[#8B5CF6]/30">
                    <AvatarImage src={user?.avatar} className="object-cover" />
                    <AvatarFallback className="bg-[#8B5CF6] text-white text-4xl">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-500 text-xs font-medium rounded-full">
                      Active Student
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Full Name</p>
                    <p className="text-white font-semibold text-lg">{user?.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/60 text-sm mb-1 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" /> Matric Number
                      </p>
                      <p className="text-white font-mono">{user?.matricNumber}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1 flex items-center gap-1">
                        <User className="w-3 h-3" /> Level
                      </p>
                      <p className="text-white">{user?.level} Level</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/60 text-sm mb-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> Department
                    </p>
                    <p className="text-white">{user?.department}</p>
                  </div>

                  <div>
                    <p className="text-white/60 text-sm mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Session
                    </p>
                    <p className="text-white">2023/2024 Academic Session</p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white p-3 rounded-xl">
                    <QRCodeSVG
                      value={qrData}
                      size={120}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <p className="text-white/40 text-xs mt-2 text-center">
                    Scan to verify
                  </p>
                </div>
              </div>
            </CardContent>

            {/* Footer */}
            <div className="bg-white/5 px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#8B5CF6]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#8B5CF6] font-bold text-xs">iF</span>
                </div>
                <span className="text-white/60 text-sm">insidefuta.com</span>
              </div>
              <p className="text-white/40 text-xs">
                Issued: {new Date().toLocaleDateString()}
              </p>
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="bg-[#1A1A1A] border-white/5 mt-6">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold mb-4">How to use your ID Card</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-[#8B5CF6]/20 rounded-lg flex items-center justify-center mb-3">
                  <Download className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <h4 className="text-white font-medium mb-1">Download</h4>
                <p className="text-white/60 text-sm">Save your ID card as a PDF for offline use</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-[#8B5CF6]/20 rounded-lg flex items-center justify-center mb-3">
                  <Share2 className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <h4 className="text-white font-medium mb-1">Share</h4>
                <p className="text-white/60 text-sm">Share your digital ID with lecturers and staff</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-[#8B5CF6]/20 rounded-lg flex items-center justify-center mb-3">
                  <Printer className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <h4 className="text-white font-medium mb-1">Print</h4>
                <p className="text-white/60 text-sm">Print a physical copy for campus use</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
