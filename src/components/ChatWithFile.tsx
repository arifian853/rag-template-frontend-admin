/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, FileText, Bot, User, Info, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface FileItem {
  _id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  upload_date: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  response: string;
  file_name: string;
  file_type: string;
  context_used: number;
  sources_found: number;
}

const API_BASE_URL = 'http://localhost:7860';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 p-3 bg-gray-100 rounded-2xl rounded-bl-md max-w-xs">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-xs text-gray-500 ml-2">AI sedang mengetik...</span>
    </div>
  );
};

export function ChatWithFile() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(true);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (selectedFileId) {
      const file = files.find(f => f._id === selectedFileId);
      setSelectedFile(file || null);
      setMessages([]); // Clear messages when switching files
    }
  }, [selectedFileId, files]);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/files`);
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      } else {
        throw new Error('Failed to fetch files');
      }
    } catch (error) {
      toast.error("Failed to fetch files");
    } finally {
      setFilesLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedFileId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat-with-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          file_id: selectedFileId,
          conversation_history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (response.ok) {
        const data: ChatResponse = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        if (data.context_used > 0) {
          toast.success(`Found ${data.sources_found} relevant sections from the file`);
        }
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error("Failed to send message");
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const openClearDialog = () => {
    setIsClearDialogOpen(true);
  };

  const confirmClearHistory = () => {
    setMessages([]);
    setIsClearDialogOpen(false);
  };

  const openInfoDialog = () => {
    setIsInfoDialogOpen(true);
  };

  if (filesLoading) {
    return <div>Loading files...</div>;
  }

  return (
    <div className="space-y-6">
      {/* File Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Select File to Chat With
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedFileId} onValueChange={setSelectedFileId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a file to chat with..." />
            </SelectTrigger>
            <SelectContent>
              {files.map((file) => (
                <SelectItem key={file._id} value={file._id}>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="uppercase text-xs">
                      {file.file_type}
                    </Badge>
                    <span>{file.original_filename}</span>
                    <span className="text-muted-foreground text-sm">
                      ({formatDate(file.upload_date)})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedFile && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm">
                <strong>Selected:</strong> {selectedFile.original_filename} 
                <Badge variant="secondary" className="ml-2 uppercase">
                  {selectedFile.file_type}
                </Badge>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You can now ask questions about the content of this file.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {selectedFile ? (
        <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-white rounded-t-lg">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Chat with: {selectedFile.original_filename}
              </h2>
              <p className="text-sm text-gray-500">
                Ask questions about this specific file
              </p>
              <p className="text-sm text-gray-500">
                Model: Google Gemini 2.5 Flash
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={openInfoDialog} className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Info
              </Button>
              {messages.length > 0 && (
                <Button variant="outline" size="sm" onClick={openClearDialog} className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear Chat
                </Button>
              )}
            </div>
          </div>

          {/* Chat Messages Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Start asking about this file</p>
                  <p className="text-sm">Try: "What is this document about?" or "Summarize the main points"</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                    msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                  }`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className="flex flex-col">
                      <div className={`px-4 py-2 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white text-gray-800 rounded-bl-md shadow-sm border'
                      }`}>
                        {msg.role === 'user' ? (
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        ) : (
                          <div className="text-sm prose prose-sm max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              components={{
                                code: ({ inline, className, children, ...props }: React.ComponentPropsWithRef<'code'> & { inline?: boolean }) => {
                                  return !inline ? (
                                    <pre className="bg-gray-100 rounded p-2 overflow-x-auto">
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    </pre>
                                  ) : (
                                    <code className="bg-gray-100 px-1 rounded text-xs" {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                                p: ({ children }) => (
                                  <p className="mb-2 last:mb-0">{children}</p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc list-inside mb-2">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal list-inside mb-2">{children}</ol>
                                ),
                                h1: ({ children }) => (
                                  <h1 className="text-lg font-bold mb-2">{children}</h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-base font-bold mb-2">{children}</h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-sm font-bold mb-1">{children}</h3>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-gray-300 pl-3 italic mb-2">
                                    {children}
                                  </blockquote>
                                ),
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                      <span className={`text-xs text-gray-400 mt-1 ${
                        msg.role === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about this file..."
                disabled={isLoading}
                className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !inputMessage.trim()}
                className="rounded-full w-10 h-10 p-0 bg-blue-500 hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        files.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No files available. Upload some files first to start chatting with them.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Please select a file above to start chatting.
              </p>
            </CardContent>
          </Card>
        )
      )}

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat with File Information</DialogTitle>
            <DialogDescription>
              This feature allows you to chat specifically with the content of a selected file. 
              The AI will focus on answering questions based on the knowledge extracted from that file only.
              Select a file from the dropdown above to start chatting.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsInfoDialogOpen(false)}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Chat Confirmation Dialog */}
      <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Chat History</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all chat messages for this file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClearDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmClearHistory}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}