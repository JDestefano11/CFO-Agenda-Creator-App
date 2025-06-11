import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './TopicEditor.css';

const TopicEditor = ({ topic, documentId, onSave, onCancel }) => {
  const [title, setTitle] = useState(topic?.title || '');
  const [bulletPoints, setBulletPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Import the same formatting function used in Results.jsx
  const formatContentAsBullets = (content) => {
    if (!content) return [];
    
    // First try to split by newlines
    let points = content.split('\n').filter(line => line.trim() !== '');
    
    // If we only got one item, try to split by sentences
    if (points.length <= 1) {
      points = content.split(/\.\s+/).filter(sentence => sentence.trim().length > 0);
      
      // Add periods back to sentences if they were removed during splitting
      points = points.map(point => {
        if (!point.endsWith('.') && !point.endsWith('!') && !point.endsWith('?')) {
          return point + '.';
        }
        return point;
      });
    }
    
    // Remove ANY bullet point markers at the beginning of each point
    points = points.map(point => {
      // Remove all bullet characters (•, -, *, etc.) from the beginning of the point
      return point.replace(/^[\u2022\-\*\s]+/, '').trim();
    });
    
    return points;
  };

  useEffect(() => {
    // Initialize bullet points from the topic description
    if (topic && topic.description) {
      // Use the same formatting function as in the topic cards
      const points = formatContentAsBullets(topic.description);
      console.log('Extracted bullet points:', points);
      
      // Ensure we have at least 2 bullet points for editing
      if (points.length === 0) {
        setBulletPoints(['', '']);
      } else if (points.length === 1) {
        setBulletPoints([...points, '']);
      } else {
        setBulletPoints(points);
      }
    } else {
      console.log('No description found, using default bullet points');
      setBulletPoints(['', '']);
    }
  }, [topic]);

  const handleAddBulletPoint = () => {
    setBulletPoints([...bulletPoints, '']);
  };

  const handleRemoveBulletPoint = (index) => {
    if (bulletPoints.length > 1) {
      const newPoints = [...bulletPoints];
      newPoints.splice(index, 1);
      setBulletPoints(newPoints);
    }
  };

  const handleBulletPointChange = (index, value) => {
    const newPoints = [...bulletPoints];
    newPoints[index] = value;
    setBulletPoints(newPoints);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }

    // Filter out empty bullet points
    const filteredPoints = bulletPoints.filter(point => point.trim().length > 0);
    
    if (filteredPoints.length === 0) {
      setError('At least one bullet point is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Clean bullet points - remove any existing bullet markers first
      const cleanedPoints = filteredPoints.map(point => {
        // First remove any existing bullet characters completely
        return point.replace(/^[\u2022\-\*\s]+/, '').trim();
      });
      
      // Store the clean points as newline-separated text without adding bullet characters
      // The bullet points will be displayed with CSS list-disc style in the Results page
      const description = cleanedPoints.join('\n');
      
      const updatedTopic = {
        ...topic,
        title,
        description
      };

      // Since there's no API endpoint for updating topics directly,
      // we'll just pass the updated topic back to the parent component
      // which will handle updating the local state
      onSave(updatedTopic);
    } catch (err) {
      console.error('Error saving topic:', err);
      setError('Failed to save topic. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border border-indigo-100">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-indigo-800">Edit Topic</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isLoading}
          aria-label="Close editor"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {error && (
        <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm animate-pulse">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      <div className="mb-5">
        <label htmlFor="topic-title" className="block text-sm font-medium text-gray-700 mb-2">
          Topic Title
        </label>
        <div className="relative rounded-md shadow-sm">
          <input
            id="topic-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900"
            placeholder="Enter a concise, descriptive title"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Key Points
          </label>
          <span className="text-xs text-gray-500">{bulletPoints.length} point{bulletPoints.length !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="space-y-3 mb-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
          {bulletPoints.map((point, index) => (
            <div key={index} className="flex items-center group transition-all duration-200 hover:bg-indigo-50 rounded-lg p-1">
              <span className="mr-2 text-indigo-500 font-bold">•</span>
              <input
                type="text"
                value={point}
                onChange={(e) => handleBulletPointChange(index, e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent border-b border-gray-200 focus:border-indigo-500 focus:ring-0 focus:outline-none transition-all duration-200"
                placeholder="Enter key information about this topic"
              />
              <button
                type="button"
                onClick={() => handleRemoveBulletPoint(index)}
                className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                disabled={bulletPoints.length <= 1}
                aria-label="Remove point"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={handleAddBulletPoint}
          className="w-full mt-2 flex items-center justify-center text-sm text-indigo-600 hover:text-indigo-800 py-2 px-3 border border-dashed border-indigo-300 rounded-lg hover:bg-indigo-50 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Point
        </button>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm flex items-center justify-center min-w-[120px]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

TopicEditor.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  }),
  documentId: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default TopicEditor