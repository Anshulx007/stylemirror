import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, RefreshCw, AlertCircle } from 'lucide-react';

const ImageUploader = ({ onUpload, loading }) => {
  const [error, setError] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'
  
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Stop camera tracks helper
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Clean up camera when component unmounts or active tab changes
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Switch tabs
  const handleTabChange = (tab) => {
    if (loading) return;
    setError(null);
    setCameraError(null);
    stopCamera();
    
    // If switching back to upload but we had a captured image, we keep it, or let user upload fresh.
    setActiveTab(tab);
  };

  // Start webcam stream
  const startCamera = async () => {
    setCameraError(null);
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Permission denied or camera not available.');
    }
  };

  // Trigger camera startup when camera tab is active and no stream/preview exists
  useEffect(() => {
    if (activeTab === 'camera' && !stream && !localPreview) {
      startCamera();
    }
    // Stop camera when leaving the camera tab
    if (activeTab !== 'camera') {
      stopCamera();
    }
  }, [activeTab, stream, localPreview]);

  // Capture frame
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Match dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw mirrored if using front-facing camera stream representation
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.setTransform(1, 0, 0, 1, 0, 0); // reset scale
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        setLocalPreview(url);
        onUpload(file, url);
        stopCamera();
      }
    }, 'image/jpeg', 0.95);
  };

  // Clear preview and retake camera
  const handleRetake = () => {
    if (loading) return;
    setLocalPreview(null);
    onUpload(null, null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  // Drag and drop setup
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setError('Only JPEG and PNG images up to 5MB are supported.');
      return;
    }
    
    const file = acceptedFiles[0];
    if (file) {
      setError(null);
      const url = URL.createObjectURL(file);
      setLocalPreview(url);
      onUpload(file, url);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/jpg': [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: loading || activeTab !== 'upload',
  });

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Selector Tabs */}
      {!localPreview && (
        <div className="flex gap-2 p-1 bg-[#141414] border border-[#2A2A2A] rounded-xl mb-4">
          <button
            type="button"
            onClick={() => handleTabChange('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'upload'
                ? 'bg-[#8B5CF6] text-white'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
            disabled={loading}
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('camera')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'camera'
                ? 'bg-[#8B5CF6] text-white'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
            disabled={loading}
          >
            <Camera className="w-4 h-4" />
            Use Camera
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-[#141414]/50 border border-[#2A2A2A] rounded-2xl overflow-hidden p-6 shadow-xl relative min-h-[340px] flex flex-col justify-center">
        
        {/* Preview State (Shared between Upload and Camera capture) */}
        {localPreview ? (
          <div className="flex flex-col items-center gap-4 py-2">
            <img 
              src={localPreview} 
              alt="Preview" 
              className="max-h-72 rounded-xl object-contain shadow-lg border border-[#2A2A2A]"
            />
            <button
              onClick={handleRetake}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] hover:bg-[#3A3A3A] disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Choose / Capture Another</span>
            </button>
          </div>
        ) : (
          <>
            {/* Upload Tab Panel */}
            {activeTab === 'upload' && (
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive 
                    ? 'border-[#8B5CF6] bg-[#8B5CF6]/5' 
                    : 'border-[#2A2A2A] hover:border-[#8B5CF6]/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
                    <Upload className="w-6 h-6 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <p className="text-md font-semibold text-white">Drag & drop your photo</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">Supports JPG, JPEG, or PNG up to 5MB</p>
                  </div>
                  <button type="button" className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-semibold transition-all">
                    Browse Files
                  </button>
                </div>
              </div>
            )}

            {/* Webcam Tab Panel */}
            {activeTab === 'camera' && (
              <div className="flex flex-col items-center">
                {cameraError ? (
                  <div className="flex flex-col items-center gap-3 text-center p-6">
                    <AlertCircle className="w-10 h-10 text-[#EF4444]" />
                    <p className="text-[#9CA3AF] text-sm">{cameraError}</p>
                    <button 
                      onClick={startCamera}
                      className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white rounded-xl text-xs font-semibold transition-all"
                    >
                      Retry Camera
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-[#2A2A2A] bg-[#0A0A0A] aspect-video flex items-center justify-center">
                    {!stream && (
                      <div className="text-xs text-[#9CA3AF] animate-pulse">Initializing webcam stream...</div>
                    )}
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover scale-x-[-1]"
                      playsInline
                      muted
                    />
                    
                    {/* Pulsing Recording Indicator */}
                    {stream && (
                      <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-black/60 rounded-full border border-red-500/20">
                        <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></span>
                        <span className="text-[10px] text-white font-semibold uppercase tracking-wider">Live Camera</span>
                      </div>
                    )}

                    {/* Camera Control Overlay */}
                    {stream && (
                      <div className="absolute bottom-3 inset-x-0 flex justify-center">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="w-12 h-12 rounded-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                        >
                          <div className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-white flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-[#8B5CF6]"></div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-4 text-[#EF4444] text-sm justify-center bg-[#EF4444]/10 border border-[#EF4444]/20 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
