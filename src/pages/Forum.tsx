import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  MessageSquare,
  Plus,
  Search,
  TrendingUp,
  MessageCircle,
  ThumbsUp,
  Eye,
  Tag,
  ChevronRight,
} from 'lucide-react'

const popularTags = ['CSC 211', 'MTS 201', 'PHY 112', 'Help', 'Past Questions', 'Study Group']

export default function Forum() {
  const { forumPosts, addForumPost, upvotePost, user } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: '',
  })

  const filteredPosts = forumPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const handleAddPost = () => {
    if (!newPost.title || !newPost.content) {
      toast.error('Please fill in all fields')
      return
    }

    addForumPost({
      title: newPost.title,
      content: newPost.content,
      authorId: user?.id || '',
      authorName: user?.name || '',
      authorAvatar: user?.avatar,
      tags: newPost.tags.split(',').map((t) => t.trim()).filter(Boolean),
    })

    setNewPost({ title: '', content: '', tags: '' })
    toast.success('Question posted!')
  }

  const handleUpvote = (postId: string) => {
    upvotePost(postId)
  }

  return (
    <DashboardLayout title="Q&A Forum">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
                  <Plus className="w-4 h-4 mr-2" /> Ask Question
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1A1A1A] border-white/10 max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-white">Ask a Question</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-white">Title</Label>
                    <Input
                      placeholder="What's your question?"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Details</Label>
                    <textarea
                      placeholder="Provide more context..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white min-h-[120px] resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Tags (comma separated)</Label>
                    <Input
                      placeholder="e.g., CSC 211, Programming, Help"
                      value={newPost.tags}
                      onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <Button onClick={handleAddPost} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
                    Post Question
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card key={post.id} className="bg-[#1A1A1A] border-white/5 card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Vote */}
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => handleUpvote(post.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            post.userUpvoted
                              ? 'bg-[#8B5CF6] text-white'
                              : 'bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <span className="text-white font-medium">{post.upvotes}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/forum/${post.id}`}>
                          <h3 className="text-white font-semibold text-lg hover:text-[#8B5CF6] transition-colors">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-white/60 text-sm mt-1 line-clamp-2">{post.content}</p>

                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={post.authorAvatar} />
                              <AvatarFallback className="bg-[#8B5CF6] text-white text-xs">
                                {post.authorName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-white/60 text-sm">{post.authorName}</span>
                          </div>
                          <span className="text-white/40">•</span>
                          <span className="text-white/60 text-sm flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.replies.length} replies
                          </span>
                          <span className="text-white/40">•</span>
                          <span className="text-white/60 text-sm flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views} views
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              className="bg-white/5 text-white/70 hover:bg-white/10 cursor-pointer"
                              onClick={() => setSelectedTag(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-16">
                <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">No questions found</h3>
                <p className="text-white/60">Be the first to ask a question!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardContent className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{forumPosts.length}</p>
                  <p className="text-white/60 text-sm">Questions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {forumPosts.reduce((acc, p) => acc + p.replies.length, 0)}
                  </p>
                  <p className="text-white/60 text-sm">Answers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Tags */}
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#8B5CF6]" />
                Popular Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTag === tag
                        ? 'bg-[#8B5CF6] text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Jane Smith', posts: 24 },
                  { name: 'Mike Johnson', posts: 18 },
                  { name: 'Sarah Williams', posts: 15 },
                ].map((contributor, index) => (
                  <div key={contributor.name} className="flex items-center gap-3">
                    <span className="text-white/40 w-4">{index + 1}</span>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-[#8B5CF6] text-white text-xs">
                        {contributor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm flex-1">{contributor.name}</span>
                    <span className="text-white/60 text-sm">{contributor.posts}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
