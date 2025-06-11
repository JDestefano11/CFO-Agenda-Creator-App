import React from "react";
import { FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import { useResults } from "../../context/ResultsContext";

/**
 * HistoryTab component displays a list of previously analyzed documents
 */
const HistoryTab = () => {
  const { navigate } = useResults();

  // Mock data for document history
  const documentHistory = [
    {
      id: 1,
      name: "Q2 Financial Report.pdf",
      date: "2025-05-28",
      status: "approved",
      topics: 7,
    },
    {
      id: 2,
      name: "Annual Budget Proposal.docx",
      date: "2025-05-25",
      status: "rejected",
      topics: 5,
    },
    {
      id: 3,
      name: "Investment Strategy.pdf",
      date: "2025-05-20",
      status: "approved",
      topics: 8,
    },
    {
      id: 4,
      name: "Quarterly Forecast.xlsx",
      date: "2025-05-15",
      status: "pending",
      topics: 6,
    },
  ];

  const handleDocumentClick = (documentId) => {
    localStorage.setItem("currentDocumentId", documentId);
    navigate("/results", { state: { documentId } });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FiCheckCircle className="text-green-500" />;
      case "rejected":
        return <FiXCircle className="text-red-500" />;
      case "pending":
      default:
        return <FiClock className="text-amber-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Document History
      </h2>

      <div className="space-y-3">
        {documentHistory.map((doc) => (
          <div
            key={doc.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleDocumentClick(doc.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3">{getStatusIcon(doc.status)}</div>
                <div>
                  <h3 className="font-medium text-gray-800">{doc.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(doc.date)} • {doc.topics} topics
                  </p>
                </div>
              </div>
              <div
                className="text-xs px-2 py-1 rounded-full capitalize font-medium"
                style={{
                  backgroundColor:
                    doc.status === "approved"
                      ? "#e6f7ed"
                      : doc.status === "rejected"
                      ? "#fae9e8"
                      : "#fef5e7",
                  color:
                    doc.status === "approved"
                      ? "#0d9f6e"
                      : doc.status === "rejected"
                      ? "#e02424"
                      : "#d97706",
                }}
              >
                {doc.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryTab;