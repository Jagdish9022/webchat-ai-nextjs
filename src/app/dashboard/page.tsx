"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, Zap, Target } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import InputSection from "@/components/dashboard/input-section"
import ProgressSection from "@/components/dashboard/progress-section"
import ResultSection from "@/components/dashboard/result-section"
import ExistingChatbot from "@/components/dashboard/existing-chatbot"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [showProgress, setShowProgress] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const [existingChatbot, setExistingChatbot] = useState<any>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Check for existing chatbot
    if (user?.id) {
      const saved = localStorage.getItem(`chatbot_${user.id}`)
      if (saved) {
        setExistingChatbot(JSON.parse(saved))
      }
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 py-8"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium text-sm">AI-Powered Chatbot Builder</span>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Create Your AI Chatbot
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform any website into an intelligent chatbot that understands your content and provides instant,
            accurate responses to your visitors.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: Zap, text: "Lightning Fast", color: "from-yellow-400 to-orange-500" },
              { icon: Target, text: "Highly Accurate", color: "from-green-400 to-blue-500" },
              { icon: Sparkles, text: "AI-Powered", color: "from-purple-400 to-pink-500" },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`flex items-center space-x-2 bg-gradient-to-r ${feature.color} text-white px-4 py-2 rounded-full shadow-lg`}
              >
                <feature.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {existingChatbot && (
          <ExistingChatbot chatbot={existingChatbot} userId={user.id} onShowResult={() => setShowResult(true)} />
        )}

        <InputSection
          onStartProcessing={(taskId) => {
            setCurrentTaskId(taskId)
            setShowProgress(true)
            setShowResult(false)
          }}
          userId={user.id}
        />

        {showProgress && currentTaskId && (
          <ProgressSection
            taskId={currentTaskId}
            onComplete={(data) => {
              setShowProgress(false)
              setShowResult(true)
              // Save chatbot data
              const chatbotData = {
                userId: user.id,
                createdAt: new Date().toISOString(),
                ...data,
              }
              localStorage.setItem(`chatbot_${user.id}`, JSON.stringify(chatbotData))
              setExistingChatbot(chatbotData)
            }}
          />
        )}

        {showResult && (
          <ResultSection
            userId={user.id}
            onCreateAnother={() => {
              setShowResult(false)
              setShowProgress(false)
              setCurrentTaskId(null)
            }}
          />
        )}
      </main>
    </div>
  )
}
