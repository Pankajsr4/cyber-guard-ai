'use client';

import { useState, useRef } from 'react';
import { moderationAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FiUpload, FiType, FiLayers, FiMic, FiStopCircle } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

function AnalyzePage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'text' | 'file' | 'batch' | 'audio'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast.error('Please enter content to analyze');
      return;
    }

    setLoading(true);
    try {
      const result = await moderationAPI.analyze({
        content,
        language: language === 'auto' ? undefined : language
      });
      
      // Store result and navigate to report page
      localStorage.setItem('lastAnalysis', JSON.stringify(result));
      toast.success('Analysis complete!');
      router.push('/report/latest');
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.detail || error.message || 'Analysis failed. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (file.type.startsWith('audio/')) {
        setAudioBlob(file);
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
        toast.success(`Audio file "${file.name}" loaded. Click "Analyze Audio" to process.`);
        return;
      }
      
      if (file.type === 'application/pdf') {
        toast.error('PDF parsing requires backend support. Please copy and paste the text for now.');
        return;
      }
      
      // Read text files
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
        toast.success(`File "${file.name}" loaded successfully`);
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
      };
      reader.readAsText(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Start Web Speech API for real-time transcription
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'auto' ? 'en-US' : language;
        
        let finalTranscript = '';
        
        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }
          
          setTranscribedText(finalTranscript + interimTranscript);
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };
        
        recognition.start();
        recognitionRef.current = recognition;
        setIsTranscribing(true);
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
        
        // Stop speech recognition
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          setIsTranscribing(false);
        }
        
        toast.success('Recording saved! Click "Analyze Audio" to process.');
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started... Speak now!');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsTranscribing(false);
      }
    }
  };

  const togglePlayPause = () => {
    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
      } else {
        audioPlayerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const analyzeAudio = async () => {
    if (!transcribedText.trim()) {
      toast.error('No transcription available. Please record again and speak clearly.');
      return;
    }

    setLoading(true);
    toast('Analyzing transcribed content...', {
      icon: '🎤',
      duration: 2000,
    });

    try {
      const transcription = transcribedText.trim();
      
      setContent(transcription);
      toast.success('Transcription received! Now analyzing...');
      
      // Automatically analyze the transcribed content
      setTimeout(async () => {
        try {
          const result = await moderationAPI.analyze({
            content: transcription,
            language: language === 'auto' ? undefined : language
          });
          
          console.log('Analysis result:', result);
          localStorage.setItem('lastAnalysis', JSON.stringify(result));
          toast.success('Analysis complete!');
          
          setTimeout(() => {
            router.push('/report/latest');
          }, 500);
        } catch (error: any) {
          console.error('Analysis error:', error);
          toast.error('Analysis failed.');
          setMode('text');
        }
      }, 500);
      
    } catch (error: any) {
      console.error('Audio analysis error:', error);
      toast.error('Audio analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Content Analysis</h1>

        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap space-x-4 mb-6">
            <button
              onClick={() => setMode('text')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                mode === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <FiType />
              <span>Text Input</span>
            </button>
            <button
              onClick={() => setMode('file')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                mode === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <FiUpload />
              <span>File Upload</span>
            </button>
            <button
              onClick={() => setMode('audio')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                mode === 'audio' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <FiMic />
              <span>Audio</span>
            </button>
            <button
              onClick={() => setMode('batch')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                mode === 'batch' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <FiLayers />
              <span>Batch Process</span>
            </button>
          </div>

          {/* Language Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="auto">Auto-detect</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ar">Arabic</option>
              <option value="zh">Chinese</option>
              <option value="hi">Hindi</option>
            </select>
          </div>

          {/* Text Input Mode */}
          {mode === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content to Analyze
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter text to analyze for toxicity, risk, and behavioral patterns..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                {content.length} characters
              </p>
            </div>
          )}

          {/* File Upload Mode */}
          {mode === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Drag and drop a file here, or click to select
                </p>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Select File
                </label>
                <p className="text-sm text-gray-500 mt-4">
                  Supported: TXT, PDF, DOCX (Max 10MB)
                </p>
              </div>
              {content && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700 font-medium mb-2">Preview:</p>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-600">{content.substring(0, 500)}...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Batch Mode */}
          {mode === 'batch' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Processing
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  Upload a CSV or JSON file with multiple content items for batch analysis.
                  Maximum 1,000 items per batch.
                </p>
              </div>
              <input
                type="file"
                accept=".csv,.json"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
              />
            </div>
          )}

          {/* Audio Mode */}
          {mode === 'audio' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio Analysis
              </label>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
                <p className="text-sm text-purple-800 mb-4">
                  Upload an audio file or record directly. The system will transcribe and analyze the content.
                </p>
                <div className="space-y-4">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Audio File
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Supported: MP3, WAV, M4A, OGG, WEBM (Max 10MB)
                    </p>
                  </div>

                  {/* Recording Controls */}
                  <div className="border-t border-purple-200 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Or Record Audio</p>
                    <div className="flex items-center space-x-3">
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          disabled={loading}
                          className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          <FiMic className="text-xl" />
                          <span>Start Recording</span>
                        </button>
                      ) : (
                        <button
                          onClick={stopRecording}
                          className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 animate-pulse"
                        >
                          <FiStopCircle className="text-xl" />
                          <span>Stop Recording</span>
                        </button>
                      )}
                      
                      {audioBlob && !isRecording && (
                        <>
                          <button
                            onClick={analyzeAudio}
                            disabled={loading}
                            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {loading ? (
                              <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Transcribing...</span>
                              </>
                            ) : (
                              <>
                                <span>🎤</span>
                                <span>Analyze Audio</span>
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                    {isRecording && (
                      <p className="text-sm text-red-600 mt-2 animate-pulse">
                        🔴 Recording in progress...
                      </p>
                    )}
                    
                    {/* Real-time Transcription Display */}
                    {isTranscribing && transcribedText && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700 font-medium mb-1">Live Transcription:</p>
                        <p className="text-sm text-gray-900">{transcribedText}</p>
                      </div>
                    )}
                    
                    {audioBlob && !isRecording && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-green-600">
                            ✓ Audio ready for analysis
                          </p>
                          {transcribedText && (
                            <span className="text-xs text-gray-500">
                              {transcribedText.split(' ').length} words transcribed
                            </span>
                          )}
                        </div>
                        
                        {/* Show transcribed text */}
                        {transcribedText && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-xs text-green-700 font-medium mb-1">Transcription:</p>
                            <p className="text-sm text-gray-900">{transcribedText}</p>
                          </div>
                        )}
                        
                        {/* Audio Player */}
                        <div className="bg-white border border-gray-300 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-700 mb-3">Preview Recording</p>
                          
                          {/* Hidden audio element */}
                          {audioUrl && (
                            <audio
                              ref={audioPlayerRef}
                              src={audioUrl}
                              onEnded={() => setIsPlaying(false)}
                              className="hidden"
                            />
                          )}
                          
                          {/* Custom Controls */}
                          <div className="space-y-3">
                            {/* Play/Pause Button */}
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={togglePlayPause}
                                className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                              >
                                {isPlaying ? (
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                              
                              {/* Mute Button */}
                              <button
                                onClick={toggleMute}
                                className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                              >
                                {isMuted ? (
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                              
                              {/* Volume Slider */}
                              <div className="flex-1 flex items-center space-x-2">
                                <span className="text-xs text-gray-600">Volume:</span>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={volume}
                                  onChange={handleVolumeChange}
                                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                  style={{
                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
                                  }}
                                />
                                <span className="text-xs text-gray-600 w-8">{Math.round(volume * 100)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Production Note */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> For automatic transcription, integrate with speech-to-text services like OpenAI Whisper, Google Speech-to-Text, or Azure Speech Services.
                </p>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || !content.trim()}
            className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze Content'
            )}
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <h3 className="font-semibold text-blue-400 mb-1">⚡ Fast Analysis</h3>
            <p className="text-sm text-gray-400">Results in under 1 minute</p>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-purple-400 mb-1">🌐 Multi-Language</h3>
            <p className="text-sm text-gray-400">Automatic language detection</p>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-cyan-400 mb-1">🛡️ Multi-Category</h3>
            <p className="text-sm text-gray-400">Comprehensive harm detection</p>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

// Wrap with ProtectedRoute
function ProtectedAnalyzePage() {
  return (
    <ProtectedRoute>
      <AnalyzePage />
    </ProtectedRoute>
  );
}

export default ProtectedAnalyzePage;
