'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addComment, updateComment, deleteComment, getMoreComments } from '@/actions/comments'
import { MessageSquare, Send, MoreHorizontal, Edit2, Trash2, Loader2, ChevronDown } from 'lucide-react'
import { TransitionLink } from '@/components/animations/route-transition'
import { UserAvatar } from '@/components/sparktrail/user-avatar'

interface Comment {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  userId: string
  user: {
    name: string
    username: string
    avatarUrl?: string | null
  }
}

interface CommentSectionProps {
  trailId: string
  initialComments: Comment[]
  totalComments: number
  currentUserId?: string
}

function CommentItem({ comment, isOwner }: { comment: Comment; isOwner: boolean }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [displayContent, setDisplayContent] = useState(comment.content)
  const [editContent, setEditContent] = useState(comment.content)
  const initialEdited = Boolean(
    comment.updatedAt &&
    new Date(comment.updatedAt).getTime() - new Date(comment.createdAt).getTime() > 1000
  )
  const [isEdited, setIsEdited] = useState(initialEdited)

  const handleUpdate = async () => {
    if (!editContent.trim()) return
    setIsUpdating(true)
    const result = await updateComment(comment.id, editContent)
    if (result.success) {
      setDisplayContent(editContent)
      setIsEdited(true)
      setIsEditing(false)
      router.refresh()
    } else {
      alert(result.error || 'Failed to update comment.')
    }
    setIsUpdating(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteComment(comment.id)
    if (result.success) {
      // Handled via revalidatePath
    } else {
      alert(result.error)
      setIsDeleting(false)
      setDeleteConfirm(false)
    }
  }

  return (
    <div className="flex gap-4 group/comment relative">
      <TransitionLink href={`/profile/${comment.user.username}`} className="shrink-0">
        <UserAvatar avatarUrl={comment.user.avatarUrl} name={comment.user.name} username={comment.user.username} size="sm" className="hover:opacity-85 transition-opacity" />
      </TransitionLink>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px]">
            <TransitionLink href={`/profile/${comment.user.username}`} className="font-semibold text-[#111111] dark:text-[#FFFFFF] hover:underline">
              {comment.user.name}
            </TransitionLink>
            <span className="text-[#737373] dark:text-[#A1A1AA]">
              {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(comment.createdAt))}
            </span>
            {isEdited && (
              <span className="text-[11px] text-[#737373]/70 dark:text-[#A1A1AA]/70 font-normal">
                • Edited
              </span>
            )}
          </div>

          {isOwner && !isEditing && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-1 rounded-full text-[#737373] hover:bg-[#111111]/5 dark:hover:bg-white/10 transition-colors focus:opacity-100 ${showMenu ? 'opacity-100' : 'opacity-100 sm:opacity-0 sm:group-hover/comment:opacity-100'}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => { setShowMenu(false); setDeleteConfirm(false); }} />
                  <div className="absolute right-0 top-full mt-1 w-32 rounded-xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-1 shadow-lg z-50 overflow-hidden">
                    {!deleteConfirm ? (
                      <>
                        <button
                          onClick={() => { setIsEditing(true); setShowMenu(false); }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-[#111111] dark:text-[#FFFFFF] hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(true)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </>
                    ) : (
                      <div className="p-2 flex flex-col gap-2">
                        <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 text-center uppercase tracking-wider">Confirm</span>
                        <div className="flex gap-1">
                          <button onClick={handleDelete} disabled={isDeleting} className="flex-1 rounded bg-red-600 py-1.5 text-[11px] font-semibold text-white hover:bg-red-700 transition-colors flex items-center justify-center">
                            {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Yes'}
                          </button>
                          <button onClick={() => setDeleteConfirm(false)} disabled={isDeleting} className="flex-1 rounded border border-[#111111]/10 dark:border-white/10 py-1.5 text-[11px] font-semibold hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-colors">
                            No
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {!isEditing ? (
          <p className="text-[13.5px] leading-relaxed text-[#111111] dark:text-[#F6F5EF] whitespace-pre-wrap">
            {displayContent}
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[60px] resize-y rounded-xl border border-[#111111]/10 dark:border-white/10 bg-white dark:bg-[#16171A] p-3 text-[13.5px] text-[#111111] dark:text-[#FFFFFF] focus:border-[#7857FF]/50 focus:outline-none focus:ring-1 focus:ring-[#7857FF]/50 transition-all"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setIsEditing(false); setEditContent(displayContent); }}
                className="rounded-full px-3 py-1.5 text-[12px] font-medium text-[#737373] hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating || !editContent.trim()}
                className="flex items-center justify-center min-w-[60px] rounded-full bg-[#111111] dark:bg-[#FFFFFF] px-3 py-1.5 text-[12px] font-medium text-[#F6F5EF] dark:text-[#111111] hover:opacity-85 transition-opacity disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function CommentSection({ trailId, initialComments, totalComments, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [content, setContent] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialComments.length < totalComments)

  // Sync state with server revalidations (e.g. after adding a comment or another user's comment)
  useEffect(() => {
    setComments((prev) => {
      const merged = [...initialComments]
      for (const p of prev) {
        if (!merged.some((m) => m.id === p.id)) {
          merged.push(p)
        }
      }
      return merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    })
    
    if (initialComments.length < totalComments) {
      setHasMore(true)
    }
  }, [initialComments, totalComments])

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore || comments.length === 0) return

    setIsLoadingMore(true)
    const lastCommentId = comments[comments.length - 1].id
    
    const result = await getMoreComments(trailId, lastCommentId, 20)
    
    if (result.success && result.comments) {
      setComments((prev) => {
        const merged = [...prev]
        for (const newComment of (result.comments as Comment[]) || []) {
          if (!merged.some((m) => m.id === newComment.id)) {
            merged.push(newComment)
          }
        }
        return merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      })
      if (comments.length + result.comments.length >= totalComments || result.comments.length < 20) {
        setHasMore(false)
      }
    } else {
      console.error(result.error)
    }
    
    setIsLoadingMore(false)
  }

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
          Comments ({totalComments})
        </h3>
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-[13.5px] text-[#737373] dark:text-[#A1A1AA]">
            No comments yet. Start the conversation.
          </p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} isOwner={comment.userId === currentUserId} />
            ))}
            
            {hasMore && (
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="flex items-center gap-2 rounded-full border border-[#111111]/10 dark:border-white/10 bg-white/80 dark:bg-[#16171A]/80 px-5 py-2 text-[12px] font-semibold text-[#111111] dark:text-[#FFFFFF] shadow-sm hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-all disabled:opacity-50"
                >
                  {isLoadingMore ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#7857FF]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#737373]" />}
                  <span>{isLoadingMore ? 'Loading...' : 'Load more comments'}</span>
                </button>
              </div>
            )}
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
