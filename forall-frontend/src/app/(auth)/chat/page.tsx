'use client'
// src/app/(auth)/chat/page.tsx
import { useEffect, useState, useRef, Suspense } from 'react'
import { useAuth } from '@/context/AuthContext'
import { chatApi } from '@/lib/api'
import { io, Socket } from 'socket.io-client'
import { Send, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'
import { Navbar } from '@/components/layout/Navbar'
import { useSearchParams } from 'next/navigation'

interface Conversation {
  id: string
  listing: { id: string; title: string; images: string[] }
  client: { id: string; name: string }
  assignedSales?: { id: string; name: string } | null
  messages: Message[]
}

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
}

export default function ChatPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const fetchConversations = () => {
        chatApi.getConversations().then(setConversations).catch(() => toast.error('Failed to load chats'))
      }

      fetchConversations()

      const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000')

      newSocket.on('connect', () => {
        newSocket.emit('setup_user', { userId: user.id, role: user.role })
      })

      newSocket.on('conversation_updated', () => {
        fetchConversations()
      })

      setSocket(newSocket)
      return () => { newSocket.disconnect() }
    }
  }, [isLoading, isAuthenticated, user])

  useEffect(() => {
    if (activeConv && socket) {
      chatApi.getMessages(activeConv.id).then(setMessages)
      socket.emit('join_conversation', activeConv.id)

      const handleReceive = (msg: Message) => {
        setMessages((prev) => [...prev, msg])
      }
      socket.on('receive_message', handleReceive)

      return () => {
        socket.emit('leave_conversation', activeConv.id)
        socket.off('receive_message', handleReceive)
      }
    }
  }, [activeConv, socket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !activeConv) return
    try {
      const newMsg = await chatApi.sendMessage(activeConv.id, input)
      setInput('')
      // Message is appended via socket event, but we can optimistically append it
      // setMessages(prev => [...prev, newMsg])
    } catch {
      toast.error('Failed to send message')
    }
  }

  if (isLoading || !isAuthenticated) return null

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0A]">
      <Navbar />
      <div className="flex-1 overflow-hidden flex max-w-7xl w-full mx-auto p-4 gap-4">

        {/* Sidebar */}
        <div className="w-1/3 border border-[#C9A84C]/20 rounded-xl bg-[#1A1A1A] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#C9A84C]/15 font-['Playfair_Display'] text-lg text-[#F5F0E8]">
            Conversations
          </div>
          <div className="overflow-y-auto flex-1 p-2 flex flex-col gap-2">
            {conversations.length === 0 && (
              <div className="text-center text-xs text-[#8A8070] mt-10">No conversations yet</div>
            )}
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveConv(c)}
                className={`p-3 rounded-lg text-left transition-colors flex items-center gap-3 ${activeConv?.id === c.id ? 'bg-[#C9A84C]/15 border border-[#C9A84C]/30' : 'hover:bg-[#111] border border-transparent'
                  }`}
              >
                <img src={c.listing.images[0] || '/placeholder.png'} className="w-10 h-10 rounded object-cover" />
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium text-[#F5F0E8] truncate">{c.listing.title}</div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-xs text-[#8A8070] truncate">
                      {user?.role === 'client'
                        ? (c.assignedSales ? `Agent: ${c.assignedSales.name}` : 'Broker (Assigned to all sales)')
                        : `Client: ${c.client.name}`}
                    </span>
                    {!c.assignedSales && user?.role === 'sales' && (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        New Inq
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 border border-[#C9A84C]/20 rounded-xl bg-[#1A1A1A] flex flex-col overflow-hidden">
          {activeConv ? (
            <>
              <div className="p-4 border-b border-[#C9A84C]/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={activeConv.listing.images[0] || '/placeholder.png'} className="w-10 h-10 rounded object-cover" />
                  <div>
                    <div className="text-sm font-medium text-[#F5F0E8]">{activeConv.listing.title}</div>
                    <div className="text-xs text-[#8A8070]">
                      {user?.role === 'client'
                        ? (activeConv.assignedSales ? `Assigned Agent: ${activeConv.assignedSales.name}` : 'Awaiting Sales Representative response...')
                        : `Chatting with client: ${activeConv.client.name}`}
                    </div>
                  </div>
                </div>
                {!activeConv.assignedSales && user?.role === 'sales' && (
                  <span className="text-xs px-2.5 py-1 rounded bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30 animate-pulse font-medium">
                    Reply to Claim Conversation
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.map((msg) => {
                  const isMine = msg.senderId === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-xl text-sm ${isMine ? 'bg-[#C9A84C] text-[#0A0A0A] rounded-tr-none' : 'bg-[#111] text-[#C8C0B0] border border-[#C9A84C]/20 rounded-tl-none'
                        }`}>
                        {msg.content}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-[#C9A84C]/15 flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#8A8070]">
              <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
