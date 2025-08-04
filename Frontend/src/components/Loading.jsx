import React, { useState, useEffect } from 'react';
import { FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const Loading = ({ duration = 15, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentStage, setCurrentStage] = useState('Initializing analysis...');
  const [analysisStages, setAnalysisStages] = useState([
    { id: 1, name: 'Document parsing', completed: false },
    { id: 2, name: 'Topic identification', completed: false },
    { id: 3, name: 'Financial data extraction', completed: false },
    { id: 4, name: 'Action item generation', completed: false },
    { id: 5, name: 'History entry creation', completed: false },
    { id: 6, name: 'Analysis completion', completed: false },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get document ID from localStorage
    const documentId = localStorage.getItem('currentDocumentId');
    
    // Function to call the backend API for document processing
    const processDocument = async () => {
      try {
        if (!documentId) {
          console.error('No document ID found in localStorage');
          return;
        }

        // Use the correct API endpoint for document analysis
        const response = await axios.post(`${API_URL}/api/documents/${documentId}/analyze`,  {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Document processing initiated:', response.data);
      } catch (error) {
        console.error('Error processing document:', error);
        // Continue with the loading animation even if there's an error
      }
    };
    
    // Call the API to start processing
    processDocument();
    
    // Calculate the increment per interval to ensure progress and time are in sync
    const totalIntervals = duration * 10; // 10 updates per second
    const progressIncrement = 100 / totalIntervals;
    const timeDecrement = duration / totalIntervals;
    
    // Simulate analysis progress stages
    const simulateAnalysisProgress = (currentProgress) => {
      if (currentProgress > 10 && !analysisStages[0].completed) {
        setAnalysisStages(prev => {
          const updated = [...prev];
          updated[0].completed = true;
          return updated;
        });
        setCurrentStage('Identifying key topics...');
      } else if (currentProgress > 30 && !analysisStages[1].completed) {
        setAnalysisStages(prev => {
          const updated = [...prev];
          updated[1].completed = true;
          return updated;
        });
        setCurrentStage('Analyzing document structure...');
      } else if (currentProgress > 40 && !analysisStages[2].completed) {
        setAnalysisStages(prev => {
          const updated = [...prev];
          updated[2].completed = true;
          return updated;
        });
        setCurrentStage('Extracting financial figures...');
      } else if (currentProgress > 50 && !analysisStages[3].completed) {
        setAnalysisStages(prev => {
          const updated = [...prev];
          updated[3].completed = true;
          return updated;
        });
        setCurrentStage('Generating action items...');
      } else if (currentProgress > 65 && !analysisStages[4].completed) {
        setAnalysisStages(prev => {
          const updated = [...prev];
          updated[4].completed = true;
          return updated;
        });
        setCurrentStage('Creating history entry...');
      } else if (currentProgress > 80 && !analysisStages[5].completed) {
        setAnalysisStages(prev => {
          const updated = [...prev];
          updated[5].completed = true;
          return updated;
        });
        setCurrentStage('Completing analysis...');
      }
    };

    // Update progress and time left in perfect sync
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + progressIncrement;
        const cappedProgress = Math.min(newProgress, 100);
        simulateAnalysisProgress(cappedProgress);
        return cappedProgress;
      });
      
      setTimeLeft(prevTimeLeft => {
        const newTimeLeft = prevTimeLeft - timeDecrement;
        return Math.max(newTimeLeft, 0);
      });
    }, 100); // 10 updates per second for smooth animation

    // Store the redirect timeout reference
    let redirectTimeout;
    
    // First complete the animation fully, then wait before redirecting
    const completeAnimationTimeout = setTimeout(() => {
      clearInterval(interval);
      setLoadingComplete(true);
      setProgress(100);
      setTimeLeft(0);
      
      // Set all stages to completed
      setAnalysisStages(prev => {
        return prev.map(stage => ({ ...stage, completed: true }));
      });
      setCurrentStage('Analysis complete!');
      
      // Wait an additional 15 seconds after animation completes before redirecting
      redirectTimeout = setTimeout(() => {
        setLoadingComplete(true);
        if (onComplete) {
          onComplete();
        }
        navigate('/results', { state: { documentId } });
      }, 15000);
    }, 5000); // 5 seconds for the main animation

    return () => {
      clearInterval(interval);
      clearTimeout(completeAnimationTimeout);
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [duration, onComplete, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-6">
      <div className="container max-w-2xl mx-auto z-10">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full mx-auto relative z-10 border border-indigo-100 text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">Analyzing Your Document</h2>
          <p className="text-indigo-600 mb-8">
            Our AI is processing your document. This will take approximately <span className="font-semibold">{Math.ceil(timeLeft)}</span> seconds.
          </p>
          
          <div className="relative pt-1 mb-8">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-50">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
              <div 
                style={{ width: `${progress}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-300 ease-in-out"
              ></div>
            </div>
          </div>
          
          <div className="flex justify-center items-center mb-4">
            {progress >= 100 ? (
              <div className="flex items-center text-green-600">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="font-medium">Analysis complete! Redirecting to results...</span>
              </div>
            ) : (
              <>
                <FiLoader className="animate-spin text-indigo-600 mr-2" size={24} />
                <span className="text-indigo-800 font-medium">{currentStage}</span>
              </>
            )}
          </div>
          
          <div className="mt-6 space-y-4 bg-indigo-50 p-4 rounded-lg">
            <p className="text-indigo-800 text-sm">
              <span className="font-medium">Analysis Progress:</span> Our AI is extracting key financial data, identifying important topics, and preparing a comprehensive analysis.
            </p>
            <div className="space-y-2">
              {analysisStages.map(stage => (
                <div key={stage.id} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 flex-shrink-0 ${stage.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {stage.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${stage.completed ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                    {stage.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Our AI is carefully analyzing your document to extract the most valuable insights for CFO decision-making.</p>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default Loading;
