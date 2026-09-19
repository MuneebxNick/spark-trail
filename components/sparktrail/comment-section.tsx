'use client'

import { useState } from 'react'
import { addComment } from '@/actions/comments'
import { MessageSquare, Send } from 'lucide-react'
import { TransitionLink } from '@/components/animations/route-transition'

interface Comment {
  id: string
  content: string
  createdAt: Date
  user: {
    name: string
    username: string
  }
}

interface CommentSectionProps {
  trailId: string
  comments: Comment[]
}

export function CommentSection({ trailId, comments }: CommentSectionProps) {
  const [content, setContent] = useState('')
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isPending) return

    setIsPending(true)
    const res = await addComment(trailId, content)
    
    if (res.success) {
      setContent('')
    } else {
      alert(res.error)
    }
    
    setIsPending(false)
  }

  return (
    <div className="space-y-8 pt-10 mt-10 border-t border-[#111111]/[0.08] dark:border-white/10">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-[#7857FF]" />
        <h3 className="font-heading text-[15px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
          Comments ({comments.length})
        </h3>
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-[13.5px] text-[#737373] dark:text-[#A1A1AA]">
            No comments yet. Start the conversation.
          </p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => {
              const initials = comment.user.name
                ? comment.user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                : comment.user.username.slice(0, 2).toUpperCase()

              return (
                <div key={comment.id} className="flex gap-4">
                  <TransitionLink href={`/profile/${comment.user.username}`} className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7857FF] to-[#5D3FD3] text-[10px] font-bold text-white uppercase hover:opacity-85 transition-opacity">
                    {initials}
                  </TransitionLink>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-[12px]">
                      <TransitionLink href={`/profile/${comment.user.username}`} className="font-semibold text-[#111111] dark:text-[#FFFFFF] hover:underline">
                        {comment.user.name}
                      </TransitionLink>
                      <span className="text-[#737373] dark:text-[#A1A1AA]">
                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(comment.createdAt))}
                      </span>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-[#111111] dark:text-[#F6F5EF] whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative mt-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Leave a comment..."
          className="w-full min-h-[100px] resize-y rounded-2xl border border-[#111111]/10 dark:border-white/10 bg-white dark:bg-[#16171A] p-4 text-[13.5px] text-[#111111] dark:text-[#FFFFFF] placeholder:text-[#111111]/40 dark:placeholder:text-[#FFFFFF]/40 focus:border-[#7857FF]/50 focus:outline-none focus:ring-1 focus:ring-[#7857FF]/50 transition-all"
          disabled={isPending}
        />
        <div className="absolute bottom-4 right-4">
          <button
            type="submit"
            disabled={isPending || !content.trim()}
            className="flex items-center gap-2 rounded-full bg-[#7857FF] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#7857FF]/90 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Posting...' : 'Post'}
            {!isPending && <Send className="h-3 w-3" />}
          </button>
        </div>
      </form>
    </div>
  )
}
