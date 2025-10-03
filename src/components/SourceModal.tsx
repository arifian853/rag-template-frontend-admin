import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { type ChatSource, type KnowledgeStats } from '@/types/knowledge';
import { X, Eye, FileText, Hash, Ruler, ExternalLink, File, Download } from 'lucide-react';

interface SourceModalProps {
  source: ChatSource | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SourceModal({ source, isOpen, onClose }: SourceModalProps) {
  const calculateStats = (content: string): KnowledgeStats => {
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const charCount = content.length;
    const sizeInBytes = new Blob([content]).size;
    
    let size: string;
    if (sizeInBytes < 1024) {
      size = `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      size = `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      size = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return { wordCount, charCount, size };
  };

  const handlePreviewFile = () => {
    if (source?.file_info?.file_id) {
      // Open PDF preview in new tab using our backend endpoint
      const previewUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/files/${source.file_info.file_id}/pdf`;
      window.open(previewUrl, '_blank');
    }
  };

  const handleDownloadFile = async () => {
    if (source?.file_info?.file_id) {
      try {
        if (isPDF) {
          // For PDF, use our backend endpoint that converts base64 to PDF
          const downloadUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/files/${source.file_info.file_id}/download`;
          
          // Create temporary link element for download
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = source.file_info.filename || 'file.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // For other files, get download URL from backend
          const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/files/${source.file_info.file_id}/download`);
          const data = await response.json();
          
          if (data.download_url) {
            const link = document.createElement('a');
            link.href = data.download_url;
            link.download = source.file_info.filename || 'file';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      } catch (error) {
        console.error('Download error:', error);
        // Fallback to cloudinary URL
        if (source.file_info?.cloudinary_url) {
          window.open(source.file_info.cloudinary_url, '_blank');
        }
      }
    }
  };

  const handleOpenCloudinaryFile = () => {
    if (source?.file_info?.cloudinary_url) {
      window.open(source.file_info.cloudinary_url, '_blank');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Tidak diketahui';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileTypeIcon = (fileType?: string) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'xlsx':
      case 'xls':
        return '📊';
      case 'csv':
        return '📋';
      default:
        return '📁';
    }
  };

  if (!isOpen || !source) return null;

  const stats = calculateStats(source.content);
  const hasFileInfo = source.file_info !== null && source.file_info !== undefined;
  const isPDF = source.file_info?.file_type?.toLowerCase() === 'pdf';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">Detail Sumber</h2>
            {hasFileInfo && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <span>{getFileTypeIcon(source.file_info?.file_type)}</span>
                <span>Dari File</span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <Tabs defaultValue="view" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="view">
                <Eye className="h-4 w-4 mr-2" />
                Lihat
              </TabsTrigger>
              <TabsTrigger value="stats">
                <FileText className="h-4 w-4 mr-2" />
                Statistik
              </TabsTrigger>
              <TabsTrigger value="metadata">
                <Hash className="h-4 w-4 mr-2" />
                Metadata
              </TabsTrigger>
              {hasFileInfo && (
                <TabsTrigger value="file">
                  <File className="h-4 w-4 mr-2" />
                  File Info
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="view" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {hasFileInfo && <span>{getFileTypeIcon(source.file_info?.file_type)}</span>}
                    {source.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span>Sumber: {source.source}</span>
                    {source.similarity_score && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {(source.similarity_score * 100).toFixed(1)}% cocok
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[50vh] overflow-y-auto">
                  <div className="whitespace-pre-wrap text-sm">
                    {source.content}
                  </div>
                </CardContent>
              </Card>

              {hasFileInfo && (
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <File className="h-5 w-5 text-blue-600" />
                      File Rujukan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getFileTypeIcon(source.file_info?.file_type)}</span>
                        <div>
                          <p className="font-medium">{source.file_info?.filename}</p>
                          <p className="text-sm text-muted-foreground">
                            {source.file_info?.file_type?.toUpperCase()} • {formatDate(source.file_info?.upload_date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isPDF ? (
                          <>
                            <Button onClick={handlePreviewFile} className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Preview PDF
                            </Button>
                            <Button variant="outline" onClick={handleDownloadFile} className="flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </>
                        ) : (
                          <Button onClick={handleOpenCloudinaryFile} className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Buka File
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Jumlah Kata</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.wordCount}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Jumlah Karakter</CardTitle>
                    <Hash className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.charCount}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ukuran</CardTitle>
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.size}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pratinjau Konten</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground line-clamp-6">
                    {source.content}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informasi Sumber</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">ID:</span>
                      <div className="text-muted-foreground font-mono text-xs break-all">
                        {source._id || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Sumber:</span>
                      <div className="text-muted-foreground">
                        {source.source || 'Tidak ada sumber yang ditentukan'}
                      </div>
                    </div>
                    {source.similarity_score && (
                      <div>
                        <span className="font-medium">Skor Kemiripan:</span>
                        <div className="text-muted-foreground">
                          {(source.similarity_score * 100).toFixed(2)}%
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Tipe Knowledge:</span>
                      <div className="text-muted-foreground">
                        {hasFileInfo ? 'Dari File Upload' : 'Manual Input'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {hasFileInfo && (
              <TabsContent value="file" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <File className="h-5 w-5" />
                      Informasi File Rujukan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Nama File:</span>
                        <div className="text-muted-foreground">
                          {source.file_info?.filename}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Tipe File:</span>
                        <div className="text-muted-foreground">
                          {source.file_info?.file_type?.toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">File ID:</span>
                        <div className="text-muted-foreground font-mono text-xs break-all">
                          {source.file_info?.file_id}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Tanggal Upload:</span>
                        <div className="text-muted-foreground">
                          {formatDate(source.file_info?.upload_date)}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-3 flex-wrap">
                        {isPDF ? (
                          <>
                            <Button onClick={handlePreviewFile} className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Preview PDF
                            </Button>
                            <Button variant="outline" onClick={handleDownloadFile} className="flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              Download PDF
                            </Button>
                            <Button variant="ghost" onClick={handleOpenCloudinaryFile} className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Lihat di Cloudinary
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={handleOpenCloudinaryFile} className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Buka File
                            </Button>
                            <Button variant="outline" onClick={handleDownloadFile} className="flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {isPDF 
                          ? "PDF akan dibuka/didownload dalam format asli yang sudah dikonversi dari base64"
                          : "File akan dibuka melalui Cloudinary"
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}