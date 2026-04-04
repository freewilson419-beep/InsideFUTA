import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase' // Ensure this path is correct
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Building2, Sparkles, School } from 'lucide-react'

// 1. YOUR REAL FUTA DATA
const FUTA_SCHOOLS = {
  "School of Agriculture & Agricultural Tech (SAAT)": [
    "Agricultural Extension and Communication Technology", "Agricultural and Resource Economics", 
    "Animal Production and Health", "Crop, Soil and Pest Management", 
    "Fisheries and Aquaculture Technology", "Ecotourism and Wildlife Management", 
    "Forestry and Wood Technology", "Food Science and Technology"
  ],
  "School of Engineering & Engineering Tech (SEET)": [
    "Agricultural Engineering", "Civil Engineering", "Electrical and Electronics Engineering", 
    "Mechanical Engineering", "Metallurgical and Materials Engineering", "Mining Engineering", 
    "Computer Engineering", "Industrial and Production Engineering"
  ],
  "School of Environmental Technology (SET)": [
    "Architecture", "Urban and Regional Planning", "Estate Management", 
    "Quantity Surveying", "Industrial Design", "Surveying and Geoinformatics", "Building"
  ],
  "School of Earth and Mineral Sciences (SEMS)": [
    "Applied Geology", "Applied Geophysics", "Meteorology and Climate Science", 
    "Remote Sensing and GIS", "Marine Science and Technology"
  ],
  "School of Logistics and Innovation Tech (SLIT)": [
    "Project Management Technology", "Logistics and Transport Technology/Management", 
    "Entrepreneurship", "Business Information Technology", "Securities and Investments Management Technology"
  ],
  "School of Computing (SOC)": [
    "Computer Science", "Cyber Security", "Information Technology"
  ],
  "School of Life Sciences (SLS)": [
    "Biochemistry", "Biology", "Microbiology"
  ],
  "School of Physical Sciences (SPS)": [
    "Chemistry", "Mathematical Sciences", "Physics", "Statistics", 
    "Library and Information science", "Educational Technology"
  ],
  "School of Basic Medical Sciences (SBMS)": [
    "Human Anatomy", "Physiology", "Biomedical Technology"
  ]
};

const schoolNames = Object.keys(FUTA_SCHOOLS);
const levels = ['100', '200', '300', '400', '500', '600'];

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    matricNumber: '',
    department: '',
    level: '',
    password: '',
    confirmPassword: '',
  });

  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms');
      return;
    }

    setIsLoading(true);

    try {
      // STEP 1: Create the user in Supabase Authentication
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // STEP 2: If auth is successful, save the extra details in the 'profiles' table
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: formData.name,
              matric_number: formData.matricNumber,
              school: selectedSchool,
              department: formData.department,
              level: formData.level,
            },
          ]);

        if (profileError) throw profileError;

        toast.success('Account created! Welcome to InsideFUTA.');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 py-8 text-white">
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">InsideFUTA</span>
          </Link>
        </div>

        <Card className="bg-[#1A1A1A] border-white/5">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Create Account</CardTitle>
            <CardDescription className="text-white/60">Join the FUTA student community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    placeholder="Israel Adebisi"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="pl-10 bg-white/5 border-white/10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label>School Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    type="email"
                    placeholder="student@futa.edu.ng"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="pl-10 bg-white/5 border-white/10"
                    required
                  />
                </div>
              </div>

              {/* School Selection (Faculty) */}
              <div className="space-y-2">
                <Label>School (Faculty)</Label>
                <Select onValueChange={(v) => { setSelectedSchool(v); handleChange('department', ''); }}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <div className="flex items-center gap-2">
                      <School className="w-4 h-4 text-white/40" />
                      <SelectValue placeholder="Pick your School" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {schoolNames.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Dept & Level Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select 
                    disabled={!selectedSchool} 
                    value={formData.department}
                    onValueChange={(v) => handleChange('department', v)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder={selectedSchool ? "Select Dept" : "Pick School First"} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedSchool && FUTA_SCHOOLS[selectedSchool as keyof typeof FUTA_SCHOOLS].map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select onValueChange={(v) => handleChange('level', v)}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((l) => <SelectItem key={l} value={l}>{l}L</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Matric Number */}
              <div className="space-y-2">
                <Label>Matric Number</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    placeholder="FUT/23/0000"
                    value={formData.matricNumber}
                    onChange={(e) => handleChange('matricNumber', e.target.value)}
                    className="pl-10 bg-white/5 border-white/10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="pl-10 bg-white/5 border-white/10"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="pl-10 bg-white/5 border-white/10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 py-2">
                <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(c) => setAgreedToTerms(c as boolean)} />
                <Label htmlFor="terms" className="text-xs text-white/60">I agree to the Terms & Privacy Policy</Label>
              </div>

              <Button type="submit" className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
    }
