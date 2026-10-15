/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Camera,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Share2,
  Download,
  Maximize2,
  RefreshCw,
  PlusCircle,
  FileCheck,
  Shield,
  Pill,
  Activity,
  ChevronRight
} from 'lucide-react';
import { ClinicalDocument } from '../../types/neuroshield.ts';
import { INITIAL_DOCUMENTS } from '../../data/seedData.ts';

interface MedicalAiDocsTabProps {
  isHighContrast?: boolean;
}

export const MedicalAiDocsTab: React.FC<MedicalAiDocsTabProps> = ({
  isHighContrast = false,
}) => {
  const [documents, setDocuments] = useState<ClinicalDocument[]>(INITIAL_DOCUMENTS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [customDocTitle, setCustomDocTitle] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Simulated AI Analyzer with clinical NER and directive extraction
  const handleAnalyzeNewDoc = (title: string, type: 'pdf' | 'image') => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const newDoc: ClinicalDocument = {
        id: `doc-${Date.now()}`,
        fileName: title || (type === 'pdf' ? 'Hospital_Discharge_Summary.pdf' : 'Prescription_Bottle_Rx.jpg'),
        fileType: type,
        uploadedAt: 'Just Now • Clinical Vault',
        facility: 'Mount Sinai Rehabilitation Network',
        verified: true,
        summary: 'Multi-modal OCR verified stroke patient clinical history. Extracted drug interactions and exercise safety limits.',
        tags: ['Left MCA Ischemic Infarct', 'Aspirin Anticoagulation', 'Fall Risk High'],
        clinicalEntitiesCount: 12,
        entities: [
          { category: 'diagnosis', name: 'MCA Ischemic Cerebrovascular Accident', confidence: 0.99 },
          { category: 'medication', name: 'Clopidogrel 75mg PO Daily', confidence: 0.98 },
          { category: 'medication', name: 'Atorvastatin 20mg Tablet QHS', confidence: 0.97 },
          { category: 'deficit', name: 'Hemiparetic Arm Weakness & Droop', confidence: 0.95 },
        ],
        aiDirectives: [
          {
            type: 'Exercise Modification',
            title: 'Exercise Modification',
            directive: 'Cease bilateral shoulder elevation if heart rate exceeds 110 bpm or trunk tilt exceeds 4.5 degrees.',
            priority: 'Prioritized',
          },
          {
            type: 'Medication Interaction',
            title: 'Medication Interaction',
            directive: 'Administer antiplatelet therapy strictly with water after food to minimize GI ulceration.',
            priority: 'Prioritized',
          },
          {
            type: 'Physical Therapy Target',
            title: 'Physical Therapy Target',
            directive: 'Daily repetitive wrist extension & sensory mirror visual biofeedback for 20 minutes.',
            priority: 'Prioritized',
          },
        ],
      };

      setDocuments([newDoc, ...documents]);
      setIsAnalyzing(false);
      setShowUploadModal(false);
    }, 1200);
  };

  const handleDownloadPdf = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const primaryDoc = documents[0];

  return (
    <div className="space-y-4 pb-28">
      {/* Telemetry PIP Banner matching Screenshot 3 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-white text-xs shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
              alt="Telemetry Mini"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-teal-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span>TELEMETRY PIP...</span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono">
              Gaze Alignment 98% • EAR: 0.31
            </div>
          </div>
        </div>
        <button className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-[10px] flex items-center gap-1">
          <Maximize2 className="w-3 h-3" />
          <span>Expand</span>
        </button>
      </div>

      {/* Clinical Vault & AI Engine Card matching Screenshot 3 */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
              <Sparkles className="w-6 h-6 fill-teal-600/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Clinical Vault & AI Engine
                </h3>
              </div>
              <div className="text-xs font-semibold text-slate-500">
                OCR & BioBERT Diagnostics Active
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-teal-600 text-white text-[10px] font-extrabold tracking-wide">
            v3.5 Multi-Modal
          </span>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
            <span>Gemini Vision & BioBERT Analysis Active</span>
          </div>
          <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 text-[10px]">
            100% Synced
          </span>
        </div>
      </div>

      {/* Import Clinical Records matching Screenshot 3 */}
      <div className="space-y-2.5">
        <h4 className="text-sm font-bold text-slate-900 px-1">Import Clinical Records</h4>

        <div className="space-y-2.5">
          {/* Scan Hospital Discharge PDF button */}
          <button
            onClick={() => handleAnalyzeNewDoc('Discharge_Summary_Neuro.pdf', 'pdf')}
            disabled={isAnalyzing}
            className="w-full bg-teal-800 hover:bg-teal-900 text-white rounded-3xl p-4 shadow-sm flex items-center justify-between transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Scan Hospital Discharge PDF
                </div>
                <div className="text-xs text-teal-100 font-medium">
                  Import multi-page EHR reports or summaries
                </div>
              </div>
            </div>
            <PlusCircle className="w-5 h-5 text-teal-200 shrink-0" />
          </button>

          {/* Take Photo of Prescription button */}
          <button
            onClick={() => handleAnalyzeNewDoc('Prescription_Bottle_Scan.jpg', 'image')}
            disabled={isAnalyzing}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200/80 rounded-3xl p-4 shadow-sm flex items-center justify-between transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  Take Photo of Prescription
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Instant pill bottle label & dosage parsing
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
          </button>
        </div>
      </div>

      {isAnalyzing && (
        <div className="bg-teal-50 border border-teal-200 rounded-3xl p-4 flex items-center gap-3 text-teal-900 animate-pulse">
          <RefreshCw className="w-5 h-5 text-teal-600 animate-spin" />
          <div className="text-xs font-semibold">
            Running Multi-Modal OCR & BioBERT Entity Extraction...
          </div>
        </div>
      )}

      {/* Processed Records matching Screenshot 3 */}
      {primaryDoc && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-sm font-bold text-slate-900">Processed Records</h4>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              {documents.length} Verified
            </span>
          </div>

          {/* Document Header Card */}
          <div className="bg-white rounded-3xl p-4.5 shadow-sm border border-slate-200/80 space-y-3.5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                    {primaryDoc.fileName}
                  </h5>
                  <div className="text-xs text-slate-500 font-medium">
                    {primaryDoc.uploadedAt}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {primaryDoc.facility}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                Verified
              </span>
            </div>

            {/* Disease & Risk Badges matching Screenshot 3 */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Left MCA Ischemic Infarct
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-100 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                Mild Hemiparesis
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                Fall Risk High
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Extracted Clinical Entities
              </span>
              <span className="font-bold text-slate-900">
                {primaryDoc.clinicalEntitiesCount} Entities Total
              </span>
            </div>
          </div>

          {/* AI Care Plan Directives matching Screenshot 3 */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  AI Care Plan Directives
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  BioBERT-derived safety rules for therapy
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                Prioritized
              </span>
            </div>

            <div className="space-y-3">
              {primaryDoc.aiDirectives.map((directive, idx) => {
                const isEx = directive.type.includes('Exercise');
                const isMed = directive.type.includes('Medication');
                const isPt = directive.type.includes('Physical');

                return (
                  <div
                    key={idx}
                    className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          isEx
                            ? 'bg-red-100 text-red-600'
                            : isMed
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-teal-100 text-teal-600'
                        }`}
                      >
                        {isEx ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : isMed ? (
                          <Pill className="w-3.5 h-3.5" />
                        ) : (
                          <Activity className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {directive.title}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pl-8">
                      {directive.directive}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons matching Screenshot 3 */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleDownloadPdf}
              className="w-full py-3.5 px-4 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>
                {downloadSuccess ? 'Summary PDF Downloaded!' : 'Download Formatted PDF Summary'}
              </span>
            </button>

            <button
              onClick={() => {}}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              <span>Share Direct with Caregiver</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
