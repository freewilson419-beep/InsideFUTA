import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  ShoppingBag,
  Users,
  FolderOpen,
  Calendar,
  MessageCircle,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
} from 'lucide-react'

const features = [
  { icon: BookOpen, title: 'Study Hub', description: 'Access course materials, past questions, and study resources' },
  { icon: ShoppingBag, title: 'Marketplace', description: 'Buy, sell, and exchange items with fellow students' },
  { icon: Users, title: 'Community', description: 'Connect with coursemates and join study groups' },
  { icon: FolderOpen, title: 'Resources', description: 'Organized library of all academic materials' },
  { icon: Calendar, title: 'Timetable', description: 'Manage your class schedule with ease' },
  { icon: MessageCircle, title: 'Forum', description: 'Ask questions and get help from peers' },
]

const testimonials = [
  {
    name: 'Chidera Nwosu',
    role: 'Computer Science, 300L',
    content: 'InsideFUTA has transformed my academic life. Access to past questions and study materials is seamless!',
    avatar: '/images/student-chidera.jpg',
  },
  {
    name: 'Emmanuel Adeyemi',
    role: 'Electrical Engineering, 400L',
    content: 'The marketplace feature helped me sell my old textbooks and gadgets quickly. Great platform!',
    avatar: '/images/student-emmanuel.jpg',
  },
  {
    name: 'Olumide Ojo',
    role: 'Mechanical Engineering, 200L',
    content: 'I love the CGPA calculator and assignment tracker. Keeps me organized throughout the semester.',
    avatar: '/images/student-olumide.jpg',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">insidefuta</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-white/70 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-none">
                The Ultimate Student Platform
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Connect, Learn,{' '}
                <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">
                  Thrive
                </span>
              </h1>
              <p className="text-lg text-white/60 max-w-lg">
                InsideFUTA is your all-in-one platform for academic success. Access study materials, 
                connect with coursemates, buy and sell items, and stay organized throughout your journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-6 text-lg rounded-xl">
                    Join the Community
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
                    Sign In
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-sm text-white/50">Students</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-white/50">Courses</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-sm text-white/50">Materials</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/30 to-[#7C3AED]/30 rounded-3xl blur-2xl" />
              <img
                src="/images/hero-student.png"
                alt="Student"
                className="relative z-10 w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              InsideFUTA brings together all the tools and resources you need to excel in your academic journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-[#1A1A1A] border-white/5 card-hover">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-[#8B5CF6]/20 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Students Say</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Hear from students who have transformed their academic experience with InsideFUTA
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="bg-[#1A1A1A] border-white/5">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-[#8B5CF6]/30"
                    />
                  </div>
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-6 italic">"{testimonial.content}"</p>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-white/50">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Academic Journey?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of FUTA students already using InsideFUTA to excel in their studies, 
              connect with peers, and access unlimited resources.
            </p>
            <Link to="/signup">
              <Button className="bg-white text-[#8B5CF6] hover:bg-white/90 px-8 py-6 text-lg rounded-xl">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">insidefuta</span>
            </div>
            <p className="text-white/40 text-sm">
              © 2024 InsideFUTA. All rights reserved. Built for FUTA students.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
