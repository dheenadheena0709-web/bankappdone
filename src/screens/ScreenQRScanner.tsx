import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import {
  X,
  Zap,
  ZapOff,
  Image as ImageIcon,
  Camera,
  AlertCircle,
  CheckCircle2,
  Copy,
  ArrowRight,
  RefreshCw,
  Send,
  ExternalLink
} from 'lucide-react';

export const ScreenQRScanner: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [torchAvailable, setTorchAvailable] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);

  // Sound effect for successful scan using Web Audio API
  const playBeepSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Crisp 900Hz beep frequency
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {
      // Audio playback may fail if user hasn't interacted, silently ignore
    }
  };

  // Vibration feedback
  const triggerHaptics = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch {
      // Ignore vibration error
    }
  };

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setVideoReady(false);
    setCameraActive(false);
  }, []);

  // Request & Start Camera
  const startCamera = useCallback(async () => {
    stopCamera();
    setPermissionDenied(false);
    setErrorMessage(null);
    setScannedResult(null);
    setVideoReady(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('Camera access is not supported by this browser.');
      return;
    }

    try {
      // Try back camera first
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (err: any) {
        // Fallback to any camera if environment camera is not available
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;

      // Check torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities?.() || {}) as any;
        setTorchAvailable(!!capabilities.torch);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        videoRef.current.setAttribute('muted', 'true');
        videoRef.current.onloadeddata = () => {
          setVideoReady(true);
        };
        videoRef.current.play().catch(() => {});
        setCameraActive(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError' ||
        err.name === 'SecurityError'
      ) {
        setPermissionDenied(true);
        setErrorMessage('Camera permission needed - Please allow camera in settings');
      } else {
        setErrorMessage(err.message || 'Unable to access camera feed.');
      }
    }
  }, [stopCamera]);

  // Frame scanning loop with jsQR
  const handleScanLoop = useCallback(() => {
    if (scannedResult) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      video &&
      video.readyState === video.HAVE_ENOUGH_DATA &&
      video.videoWidth > 0 &&
      canvas
    ) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data && code.data.trim().length > 0) {
          playBeepSound();
          triggerHaptics();
          setScannedResult(code.data);
          stopCamera();
          return;
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(handleScanLoop);
  }, [scannedResult, stopCamera]);

  // Start scan loop once camera is active
  useEffect(() => {
    if (cameraActive && !scannedResult) {
      animFrameIdRef.current = requestAnimationFrame(handleScanLoop);
    }
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [cameraActive, scannedResult, handleScanLoop]);

  // Mount/unmount camera management
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Flashlight toggle
  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) {
      try {
        const nextState = !torchOn;
        await track.applyConstraints({
          advanced: [{ torch: nextState } as any],
        });
        setTorchOn(nextState);
      } catch (e) {
        console.warn('Torch constraint failed:', e);
      }
    }
  };

  // Gallery image processing
  const handleGalleryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          setIsProcessingImage(false);
          if (code && code.data) {
            playBeepSound();
            triggerHaptics();
            setScannedResult(code.data);
            stopCamera();
          } else {
            alert('No valid QR code found in this image. Please select a clearer photo.');
          }
        } else {
          setIsProcessingImage(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset file input
    e.target.value = '';
  };

  // Parse UPI URI parameters (e.g. upi://pay?pa=merchant@upi&pn=MerchantName&am=500)
  const parseUpiData = (data: string) => {
    if (!data.startsWith('upi://')) return null;
    try {
      const url = new URL(data);
      const params = url.searchParams;
      return {
        upiId: params.get('pa') || '',
        name: params.get('pn') || '',
        amount: params.get('am') || '',
        note: params.get('tn') || '',
      };
    } catch {
      // Fallback manual regex parser if URL parsing fails on custom upi schemes
      const paMatch = data.match(/pa=([^&]+)/);
      const pnMatch = data.match(/pn=([^&]+)/);
      const amMatch = data.match(/am=([^&]+)/);
      if (paMatch) {
        return {
          upiId: decodeURIComponent(paMatch[1]),
          name: pnMatch ? decodeURIComponent(pnMatch[1]) : '',
          amount: amMatch ? decodeURIComponent(amMatch[1]) : '',
          note: '',
        };
      }
      return null;
    }
  };

  const upiInfo = scannedResult ? parseUpiData(scannedResult) : null;

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceedToPay = () => {
    if (upiInfo) {
      navigate('/transfer', {
        state: {
          payeeName: upiInfo.name || upiInfo.upiId,
          accNo: upiInfo.upiId,
          amount: upiInfo.amount || '',
        },
      });
    } else if (scannedResult) {
      navigate('/transfer', {
        state: {
          payeeName: 'QR Payee',
          accNo: scannedResult,
        },
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[740px] flex-1 flex flex-col justify-between bg-black text-white overflow-hidden select-none">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file picker for Gallery */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleGalleryImage}
        className="hidden"
      />

      {/* Camera Live Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedData={() => setVideoReady(true)}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Camera starting indicator */}
      {!videoReady && !permissionDenied && !errorMessage && (
        <div className="absolute inset-0 z-5 bg-black flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs font-semibold text-white/90">Starting Camera...</span>
          <span className="text-[10px] text-white/60">Align QR code within the frame</span>
        </div>
      )}

      {/* Dark Vignette Overlay outside Viewfinder Box */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-between">
        {/* Top Dark Bar */}
        <div className="w-full flex-1 bg-black/70" />

        {/* Center Cutout Row */}
        <div className="w-full flex items-center justify-center">
          <div className="flex-1 h-64 sm:h-72 bg-black/70" />

          {/* VIEW FINDER BOX (Google Pay / PhonePe style) */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 shrink-0">
            {/* Corner Borders: White 4px brackets */}
            {/* Top-Left Corner */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl pointer-events-none" />
            {/* Top-Right Corner */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl pointer-events-none" />
            {/* Bottom-Left Corner */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl pointer-events-none" />
            {/* Bottom-Right Corner */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl pointer-events-none" />

            {/* Glowing Scan Line Animation */}
            {cameraActive && !scannedResult && (
              <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-[#DB0011] to-transparent shadow-[0_0_12px_#DB0011] animate-qr-scan" />
            )}
          </div>

          <div className="flex-1 h-64 sm:h-72 bg-black/70" />
        </div>

        {/* Bottom Dark Bar */}
        <div className="w-full flex-1 bg-black/70" />
      </div>

      {/* TOP BAR: Controls & Header */}
      <header className="relative z-20 px-4 pt-4 pb-3 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 active:scale-95 text-white flex items-center justify-center transition backdrop-blur-md cursor-pointer border border-white/20"
          aria-label="Close Scanner"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-sm font-bold tracking-tight text-white">Scan QR Code</h1>
          <p className="text-[10px] text-white/70 font-medium">Point camera at QR code</p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 active:scale-95 text-white flex items-center justify-center transition backdrop-blur-md cursor-pointer border border-white/20"
          title="Upload from Gallery"
          aria-label="Upload from Gallery"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </header>

      {/* PERMISSION DENIED OR ERROR OVERLAY */}
      {(permissionDenied || (errorMessage && !cameraActive)) && (
        <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#DB0011] mb-4">
            <Camera className="w-8 h-8" />
          </div>

          <h2 className="text-base font-bold text-white mb-1">
            {permissionDenied ? 'Camera Permission Needed' : 'Camera Unavailable'}
          </h2>

          <p className="text-xs text-white/70 max-w-xs mb-6 leading-relaxed">
            {errorMessage || 'Please allow camera permission in your browser settings to scan QR codes.'}
          </p>

          <div className="flex flex-col gap-2.5 w-full max-w-xs">
            <button
              onClick={startCamera}
              className="w-full h-11 bg-[#DB0011] hover:bg-[#b5000e] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Allow Camera / Try Again</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-11 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Upload from Gallery</span>
            </button>

            <button
              onClick={() => {
                playBeepSound();
                triggerHaptics();
                setScannedResult('upi://pay?pa=greenleaf.trade@hsbc&pn=Green%20Leaf%20Merchant&am=1500.00');
                stopCamera();
              }}
              className="w-full h-10 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white font-semibold text-xs rounded-xl border border-white/10 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] mt-1"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Test with Sample UPI QR</span>
            </button>
          </div>
        </div>
      )}

      {/* Processing Gallery Image Spinner */}
      {isProcessingImage && (
        <div className="absolute inset-0 z-30 bg-black/70 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs font-semibold text-white">Scanning image...</span>
        </div>
      )}

      {/* BOTTOM CONTROLS BAR: Flashlight & Instructions */}
      <footer className="relative z-20 px-6 pb-6 pt-3 flex flex-col items-center gap-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent">
        {/* Helper Chip */}
        <div className="px-3.5 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-[11px] font-medium text-white/90 shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Supports all UPI, BharatQR & Bank QRs</span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center justify-center gap-6">
          {/* Torch Toggle */}
          <button
            onClick={toggleTorch}
            disabled={!torchAvailable}
            className={`flex flex-col items-center gap-1 transition cursor-pointer ${
              torchAvailable ? 'opacity-100 hover:scale-105' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition border ${
                torchOn
                  ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.5)]'
                  : 'bg-black/50 text-white border-white/20'
              }`}
            >
              {torchOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-semibold text-white/80">
              {torchOn ? 'Torch On' : 'Flashlight'}
            </span>
          </button>

          {/* Gallery Picker */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-1 transition cursor-pointer hover:scale-105"
          >
            <div className="w-12 h-12 rounded-full bg-black/50 text-white border border-white/20 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-white/80">Gallery</span>
          </button>
        </div>
      </footer>

      {/* SUCCESS MODAL / SHEET: When QR is Detected */}
      {scannedResult && (
        <div className="absolute inset-x-0 bottom-0 z-40 bg-[#FFFFFF] text-black rounded-t-3xl shadow-2xl p-5 border-t border-slate-200 animate-slide-up">
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {upiInfo ? 'UPI QR Detected' : 'QR Code Scanned'}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1 truncate max-w-[200px]">
                  {upiInfo?.name || 'Scanned Payee'}
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                setScannedResult(null);
                startCamera();
              }}
              className="text-slate-400 hover:text-black p-1 transition cursor-pointer"
              title="Rescan"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Result Content Card */}
          <div className="mt-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            {upiInfo ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">UPI ID</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900">{upiInfo.upiId}</span>
                    <button
                      onClick={() => handleCopy(upiInfo.upiId)}
                      className="text-slate-400 hover:text-black p-0.5 cursor-pointer"
                      title="Copy UPI ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {upiInfo.amount && (
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 font-medium">Requested Amount</span>
                    <strong className="text-sm font-black text-[#DB0011]">
                      ₹{parseFloat(upiInfo.amount).toLocaleString('en-IN')}
                    </strong>
                  </div>
                )}
              </>
            ) : (
              <div>
                <span className="text-slate-500 font-medium block mb-1">Decoded Payload</span>
                <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] break-all max-h-20 overflow-y-auto text-slate-800">
                  {scannedResult}
                </div>
              </div>
            )}
          </div>

          {copied && (
            <p className="text-center text-[11px] text-emerald-600 font-semibold mt-1.5">
              Copied to clipboard!
            </p>
          )}

          {/* Buttons: Pay Now & Scan Again */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setScannedResult(null);
                startCamera();
              }}
              className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer active:scale-[0.98]"
            >
              Scan Again
            </button>

            <button
              onClick={handleProceedToPay}
              className="flex-1 h-11 rounded-xl bg-[#DB0011] hover:bg-[#b5000e] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-[0.98]"
            >
              <span>Proceed to Pay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ScreenQRScanner;
