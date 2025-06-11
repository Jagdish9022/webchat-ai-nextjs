"use client"

import type React from "react"

import { useState } from "react"
import { Globe, Upload, Play, X } from "lucide-react"
import { motion } from "framer-motion"

interface InputSectionProps {
  onStartProcessing: (taskId: string) => void
  userId: string
}

export default function InputSection({ onStartProcessing, userId }: InputSectionProps) {
  const [url, setUrl] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!url.trim()) {
      alert("Please enter a website URL")
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("http://127.0.0.1:8000/api/scrape-and-ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (response.ok) {
        onStartProcessing(data.task_id)
      } else {
        alert(data.detail || "Failed to start processing")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
    >
      <div className="space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-gray-700 font-medium">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>Website URL</span>
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-gray-700 font-medium">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Upload Additional Files (Optional)</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf,.txt,.doc,.docx,.svg"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Click to upload or drag files here</p>
              <p className="text-sm text-gray-400 mt-1">Supported: PDF, TXT, DOC, DOCX, SVG</p>
            </label>
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !url.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start Processing</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
