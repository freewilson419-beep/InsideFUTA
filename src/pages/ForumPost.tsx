import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '@/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Eye,
  CheckCircle,
  Send,
} from 'lucide-react'

export default function ForumPost() {
  const { id } = useParams<{ id: string }>()
  const { forumPosts, addForumReply, upvoteReply, markBestAnswer, user } = useStore()
  const [replyContent, setReplyContent] = useState('')

  const post = forumPosts.find((p) => p.id === id)

  if (!post) {
    return (
      <DashboardLayout title="Post Not Found">
        <div className="text-center py-16">
          <MessageCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Post Not Found</h2>
          <Link to="/forum">
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Forum
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const handleSubmitReply = () => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply')
      return
    }

    addForumReply(post.id, {
      content: replyContent,
      authorId: user?.id || '',
      authorName: user?.name || '',
      authorAvatar: user?.avatar,
    })

    setReplyContent('')
    toast.success('Reply posted!')
  }

  const sortedReplies = [...post.replies].sort((a, b) => {
    if (a.isBestAnswer) return -1
    if (b.isBestAnswer) return 1
    return b.upvotes - a.upvotes
  })

  return (
    <DashboardLayout title="Forum Post">
      <Link to="/forum">
        <Button variant="ghost" className="text-white/60 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Forum
        </Button>
      </Link>

      {/* Original Post */}
      <Card className="bg-[#1A1A1A] border-white/5 mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="p-2 bg-[#8B5CF6] text-white rounded-lg">
                <ThumbsUp className="w-4 h-4" />
              </div>
              <span className="text-white font-medium">{post.upvotes}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-3">{post.title}</h1>
              <p className="text-white/80 leading-relaxed mb-4">{post.content}</p>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={post.authorAvatar} />
                    <AvatarFallback className="bg-[#8B5CF6] text-white text-xs">
                      {post.authorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white font-medium">{post.authorName}</span>
                </div>
                <span className="text-white/40">•</span>
                <span className="text-white/60 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/60 text-sm flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {post.views} views
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} className="bg-white/5 text-white/70">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#8B5CF6]" />
          {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
        </h3>

        <div className="space-y-4">
          {sortedReplies.map((reply) => (
            <Card
              key={reply.id}
              className={`border-white/5 ${
                reply.isBestAnswer ? 'bg-green-500/10 border-green-500/30' : 'bg-[#1A1A1A]'
              }`}
            >
              <CardContent className="p-5">
                {reply.isBestAnswer && (
                  <div className="flex items-center gap-2 text-green-500 mb-3">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Best Answer</span>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => upvoteReply(post.id, reply.id)}
                      className="p-2 bg-white/5 text-white/60 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <span className="text-white font-medium">{reply.upvotes}</span>
                  </div>

                  <div className="flex-1">
                    <p className="text-white/80 leading-relaxed mb-3">{reply.content}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={reply.authorAvatar} />
                          <AvatarFallback className="bg-[#8B5CF6] text-white text-xs">
                            {reply.authorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white font-medium text-sm">{reply.authorName}</span>
                        <span className="text-white/40">•</span>
                        <span className="text-white/60 text-sm">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {!reply.isBestAnswer && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                          onClick={() => markBestAnswer(post.id, reply.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Mark as Best
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reply Form */}
      <Card className="bg-[#1A1A1A] border-white/5">
        <CardContent className="p-5">
          <h3 className="text-white font-semibold mb-4">Your Answer</h3>
          <textarea
            placeholder="Write your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white min-h-[120px] resize-none mb-4"
          />
          <Button
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
            onClick={handleSubmitReply}
          >
            <Send className="w-4 h-4 mr-2" /> Post Reply
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
