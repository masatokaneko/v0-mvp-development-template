"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, File, X, Check, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface FileUploadProps {
  title: string
  description: string
  acceptedFileTypes: string
  maxFileSize: number // MB単位
  onFileUpload?: (file: File) => void
}

export function FileUpload({ title, description, acceptedFileTypes, maxFileSize, onFileUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    validateAndSetFile(selectedFile)
  }

  const validateAndSetFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return

    // ファイルタイプの検証
    const fileType = selectedFile.name.split(".").pop()?.toLowerCase()
    const acceptedTypes = acceptedFileTypes.split(",").map((type) => type.trim().replace(".", "").toLowerCase())

    if (!fileType || !acceptedTypes.includes(fileType)) {
      setErrorMessage(`サポートされていないファイル形式です。${acceptedFileTypes} のみ許可されています。`)
      setUploadStatus("error")
      return
    }

    // ファイルサイズの検証
    if (selectedFile.size > maxFileSize * 1024 * 1024) {
      setErrorMessage(`ファイルサイズが大きすぎます。最大 ${maxFileSize}MB までアップロードできます。`)
      setUploadStatus("error")
      return
    }

    setFile(selectedFile)
    setUploadStatus("idle")
    setErrorMessage("")

    if (onFileUpload) {
      onFileUpload(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    validateAndSetFile(droppedFile)
  }

  const handleUpload = () => {
    if (!file) return

    setUploadStatus("uploading")
    setUploadProgress(0)

    // アップロードの進行状況をシミュレート
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStatus("success")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setUploadStatus("idle")
    setUploadProgress(0)
    setErrorMessage("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300"
          } ${uploadStatus === "error" ? "border-red-500 bg-red-50" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={acceptedFileTypes}
            className="hidden"
          />

          {!file && uploadStatus !== "error" && (
            <>
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">クリックまたはドラッグ＆ドロップでファイルをアップロード</p>
              <p className="text-xs text-gray-500">
                {acceptedFileTypes} 形式、最大 {maxFileSize}MB
              </p>
            </>
          )}

          {uploadStatus === "error" && (
            <>
              <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
              <p className="text-sm text-red-600 mb-1">{errorMessage}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFile()
                }}
              >
                やり直す
              </Button>
            </>
          )}

          {file && uploadStatus !== "error" && (
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <File className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {uploadStatus === "uploading" && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-gray-500 text-right">{uploadProgress}%</p>
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  <span className="text-sm">アップロード完了</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleRemoveFile} disabled={!file || uploadStatus === "uploading"}>
          キャンセル
        </Button>
        <Button onClick={handleUpload} disabled={!file || uploadStatus !== "idle"}>
          アップロード
        </Button>
      </CardFooter>
    </Card>
  )
}
