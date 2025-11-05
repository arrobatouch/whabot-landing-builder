'use client'

import { X, Eye, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BlockType } from '@/types'
import { BlockRenderer } from '@/components/BlockRenderer'
import { useState } from 'react'

// Dynamic imports for PDF generation
const loadPdfLibraries = async () => {
  const jsPDF = (await import('jspdf')).jsPDF
  const html2canvas = (await import('html2canvas')).default
  return { jsPDF, html2canvas }
}

interface LandingPreviewProps {
  blocks: BlockType[]
  isOpen: boolean
  onClose: () => void
}

export function LandingPreview({ blocks, isOpen, onClose }: LandingPreviewProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  if (!isOpen) return null

  // Function to export as JSON
  const exportAsJSON = () => {
    const landingData = {
      blocks: blocks,
      exportDate: new Date().toISOString(),
      version: '4.4.0',
      totalBlocks: blocks.length
    }
    const blob = new Blob([JSON.stringify(landingData, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `landing-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Function to export as PDF
  const exportAsPDF = async () => {
    setIsExporting(true)
    setExportProgress(10)

    try {
      console.log('🔄 Starting PDF export...')
      
      // Load PDF libraries dynamically with error handling
      let jsPDF, html2canvas
      try {
        const libs = await loadPdfLibraries()
        jsPDF = libs.jsPDF
        html2canvas = libs.html2canvas
        console.log('✅ PDF libraries loaded successfully')
      } catch (error) {
        console.error('❌ Error loading PDF libraries:', error)
        throw new Error('No se pudieron cargar las librerías PDF. Por favor, recarga la página e intenta nuevamente.')
      }
      setExportProgress(30)

      // Find the content element
      const element = document.getElementById('pdf-content')
      if (!element) {
        console.error('❌ PDF content container not found')
        throw new Error('No se encontró el contenido para exportar. Por favor, intenta nuevamente.')
      }
      console.log('✅ Content container found:', element)

      setExportProgress(50)

      // Wait a bit for any pending renders
      await new Promise(resolve => setTimeout(resolve, 500))

      // Generate canvas from the content with better error handling
      console.log('🎨 Generating canvas from content...')
      let canvas
      try {
        canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
          onclone: (clonedDoc) => {
            // Ensure all images are loaded before capturing
            const images = clonedDoc.querySelectorAll('img')
            const imagePromises = Array.from(images).map(img => {
              if (img.complete) return Promise.resolve()
              return new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
                setTimeout(reject, 5000) // Timeout after 5 seconds
              })
            })
            return Promise.all(imagePromises)
          }
        })
        console.log('✅ Canvas generated successfully:', canvas.width, 'x', canvas.height)
      } catch (error) {
        console.error('❌ Error generating canvas:', error)
        throw new Error('Error al generar la imagen del PDF. Por favor, intenta nuevamente.')
      }

      if (!canvas) {
        throw new Error('No se pudo generar el canvas. Por favor, intenta nuevamente.')
      }

      setExportProgress(70)

      // Create PDF with better error handling
      console.log('📄 Creating PDF document...')
      let pdf
      try {
        pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        })
        console.log('✅ PDF document created successfully')
      } catch (error) {
        console.error('❌ Error creating PDF document:', error)
        throw new Error('Error al crear el documento PDF. Por favor, intenta nuevamente.')
      }

      setExportProgress(80)

      // Calculate dimensions and add image to PDF
      try {
        const imgData = canvas.toDataURL('image/png', 1.0)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = canvas.width
        const imgHeight = canvas.height
        
        // Calculate scaling to fit the page
        const maxWidth = pdfWidth - 20 // 10mm margin on each side
        const maxHeight = pdfHeight - 20 // 10mm margin on each side
        const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight)
        
        const scaledWidth = imgWidth * ratio
        const scaledHeight = imgHeight * ratio
        const x = (pdfWidth - scaledWidth) / 2
        const y = 10

        console.log('📐 Adding image to PDF:', { scaledWidth, scaledHeight, x, y })
        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight)
        console.log('✅ Image added to PDF successfully')
      } catch (error) {
        console.error('❌ Error adding image to PDF:', error)
        throw new Error('Error al agregar la imagen al PDF. Por favor, intenta nuevamente.')
      }

      setExportProgress(90)

      // Add metadata
      try {
        pdf.setProperties({
          title: 'Landing Page Preview',
          subject: 'Generated by Whabot Landing Builder',
          author: 'Whabot Landing Builder',
          keywords: 'landing, page, preview, whabot',
          creator: 'Whabot Landing Builder v4.4.0'
        })
        console.log('✅ PDF metadata added')
      } catch (error) {
        console.error('❌ Error adding PDF metadata:', error)
        // Continue without metadata
      }

      // Save the PDF
      try {
        const filename = `landing-preview-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.pdf`
        pdf.save(filename)
        console.log('✅ PDF saved successfully:', filename)
        setExportProgress(100)
      } catch (error) {
        console.error('❌ Error saving PDF:', error)
        throw new Error('Error al guardar el archivo PDF. Por favor, intenta nuevamente.')
      }

    } catch (error) {
      console.error('❌ PDF Export Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al generar PDF'
      alert(`Error al generar el PDF: ${errorMessage}\n\nPor favor, intenta nuevamente o recarga la página.`)
    } finally {
      setIsExporting(false)
      setExportProgress(0)
      console.log('🔄 PDF export process completed')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="h-full w-full bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Vista Previa de la Landing
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({blocks.length} bloques)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {/* JSON Export Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={exportAsJSON}
                disabled={isExporting}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>JSON</span>
              </Button>

              {/* PDF Export Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={exportAsPDF}
                disabled={isExporting}
                className="flex items-center space-x-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                <FileText className="h-4 w-4" />
                <span>{isExporting ? 'Exportando...' : 'PDF'}</span>
              </Button>

              {/* Fallback Print Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Fallback to browser print
                  const element = document.getElementById('pdf-content')
                  if (element) {
                    window.print()
                  } else {
                    alert('No se encontró el contenido para imprimir. Por favor, intenta nuevamente.')
                  }
                }}
                disabled={isExporting}
                className="flex items-center space-x-1 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              >
                <Download className="h-4 w-4" />
                <span>Imprimir</span>
              </Button>

              {/* Close Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isExporting}
              >
                <X className="h-4 w-4" />
                Cerrar
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {isExporting && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Generando PDF... {exportProgress}%
              </p>
            </div>
          )}
        </div>

        {/* Preview Content - Full Landing Page */}
        <div className="h-[calc(100vh-140px)] overflow-y-auto">
          {blocks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No hay bloques para previsualizar
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Agrega bloques para ver la vista previa de tu landing page
                </p>
              </div>
            </div>
          ) : (
            <div className="min-h-full bg-white" id="pdf-content">
              <style jsx>{`
                @media print {
                  body * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                  }
                  .no-print {
                    display: none !important;
                  }
                  .print-break {
                    page-break-after: always;
                  }
                  @page {
                    margin: 10mm;
                    size: A4;
                  }
                }
              `}</style>
              {blocks.map((block, index) => (
                <div key={block.id || index} className="relative">
                  <BlockRenderer 
                    block={block} 
                    onContentChange={() => {}} // Read-only in preview
                    isPreview={true}
                  />
                  {/* Block separator for visual clarity */}
                  {index < blocks.length - 1 && (
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-700 print:hidden"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}