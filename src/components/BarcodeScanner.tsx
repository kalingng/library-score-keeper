import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, Result, BarcodeFormat } from '@zxing/library';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, X, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (isbn: string) => void;
}

export function BarcodeScanner({ isOpen, onClose, onScan }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const { toast } = useToast();

  // Get available cameras
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);
        
        // Select the back camera by default if available
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        setSelectedDeviceId(backCamera?.deviceId || videoDevices[0]?.deviceId);
      } catch (err) {
        console.error('Error getting cameras:', err);
        setError('Failed to access camera list. Please check your camera permissions.');
      }
    };

    if (isOpen) {
      getCameras();
    }
  }, [isOpen]);

  useEffect(() => {
    let reader: BrowserMultiFormatReader | null = null;

    const startScanning = async () => {
      try {
        if (!videoRef.current || !selectedDeviceId) return;

        // Check if we're on iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        
        // For iOS, we need to ensure we're using HTTPS
        if (isIOS && window.location.protocol !== 'https:') {
          setError('Camera access requires HTTPS on iOS devices. Please use a secure connection.');
          return;
        }

        reader = new BrowserMultiFormatReader();
        setIsScanning(true);
        setError(null);

        // Configure the reader to only look for ISBN barcodes
        const hints = new Map();
        hints.set(BarcodeFormat.EAN_13, true);
        hints.set(BarcodeFormat.EAN_8, true);
        hints.set(BarcodeFormat.UPC_A, true);
        hints.set(BarcodeFormat.UPC_E, true);
        reader.hints = hints;

        const result = await reader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result: Result | null) => {
            if (result) {
              const isbn = result.getText();
              // Validate if the scanned code is a valid ISBN
              if (isValidISBN(isbn)) {
                onScan(isbn);
                onClose();
              } else {
                setError('Invalid ISBN format. Please try again.');
              }
            }
          }
        );
      } catch (err) {
        console.error('Error starting barcode scanner:', err);
        if (err instanceof DOMException && err.name === 'NotAllowedError') {
          setError('Camera access was denied. Please allow camera access and try again.');
        } else if (err instanceof DOMException && err.name === 'NotFoundError') {
          setError('No camera found. Please connect a camera and try again.');
        } else {
          setError('Failed to start camera. Please try again.');
        }
      }
    };

    if (isOpen && selectedDeviceId) {
      startScanning();
    }

    return () => {
      if (reader) {
        reader.reset();
      }
      setIsScanning(false);
    };
  }, [isOpen, onClose, onScan, selectedDeviceId]);

  const isValidISBN = (isbn: string): boolean => {
    // Remove any non-digit characters
    const cleaned = isbn.replace(/[^0-9X]/g, '');
    
    // Check if it's a valid ISBN-10 or ISBN-13
    if (cleaned.length === 10) {
      return true; // ISBN-10
    } else if (cleaned.length === 13) {
      return true; // ISBN-13
    }
    
    return false;
  };

  const handleCameraChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Book Barcode</DialogTitle>
        </DialogHeader>
        
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
            autoPlay
            muted
          />
          
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 border-2 border-white/50 rounded-lg" />
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <Button onClick={onClose}>Close</Button>
              </div>
            </div>
          )}
        </div>

        {availableCameras.length > 1 && (
          <div className="flex items-center gap-2 mt-2">
            <Camera className="h-4 w-4 text-gray-500" />
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedDeviceId}
              onChange={(e) => handleCameraChange(e.target.value)}
            >
              {availableCameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${camera.deviceId.slice(0, 5)}`}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 