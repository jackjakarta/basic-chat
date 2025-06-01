'use client';

import React, { useState } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

export default function SpeechToTextButton({
  onTranscription,
  apiEndpoint = '/api/stt',
}: {
  onTranscription?: (text: string) => void;
  apiEndpoint?: string;
}) {
  const [transcribedText, setTranscribedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const recorderControls = useAudioRecorder();

  const sendAudioToAPI = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const text = result.text || result.transcription || result.transcript || '';

      if (!text) {
        throw new Error('No transcription text received from API');
      }

      setTranscribedText(text);
      if (onTranscription) {
        onTranscription(text);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      const errorMessage = 'Failed to transcribe audio';
      setError(errorMessage);
      setTranscribedText('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecordingComplete = (blob: Blob) => {
    console.log('Recording completed, blob size:', blob.size);
    sendAudioToAPI(blob);
  };

  const clearTranscription = () => {
    setTranscribedText('');
    setError('');
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Speech to Text</h3>

        <div className="flex flex-col items-center space-y-3">
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            recorderControls={recorderControls}
            audioTrackConstraints={{
              noiseSuppression: true,
              echoCancellation: true,
              autoGainControl: true,
            }}
            onNotAllowedOrFound={(err) => {
              console.error('Microphone error:', err);
              setError('Microphone access denied or not found');
            }}
            downloadOnSavePress={false}
            downloadFileExtension="webm"
            mediaRecorderOptions={{
              audioBitsPerSecond: 128000,
            }}
            showVisualizer={true}
          />

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isProcessing
                ? 'Processing audio...'
                : recorderControls.isRecording
                  ? 'Recording... Click stop when finished'
                  : 'Click the microphone to start recording'}
            </p>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-600">Transcribing...</span>
        </div>
      )}

      {error && (
        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            <span className="font-medium">Error:</span> {error}
          </p>
        </div>
      )}

      {transcribedText && (
        <div className="w-full p-4 bg-gray-50 rounded-lg border">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-gray-700">Transcription:</p>
            <button
              onClick={clearTranscription}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear
            </button>
          </div>
          <p className="text-gray-900 leading-relaxed">{transcribedText}</p>
        </div>
      )}

      {recorderControls.recordingBlob && (
        <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Recording ready:</span>{' '}
            {(recorderControls.recordingBlob.size / 1024).toFixed(1)} KB
          </p>
        </div>
      )}
    </div>
  );
}
