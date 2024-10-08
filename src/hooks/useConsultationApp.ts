import { useEffect, useState } from 'react';

import { useAudioRecording } from '@/hooks/useAudioRecording';
import { useConsultAssist } from '@/hooks/useConsultAssist';
import { usePromptManagement } from '@/hooks/usePromptManagement';
import { useTemplateManagement } from '@/hooks/useTemplateManagement';

export function useConsultationApp() {
  const [patientSummary, setPatientSummary] = useState('');
  const [rightColumnTab, setRightColumnTab] = useState('ai');
  const [selectedTemplate, setSelectedTemplate] = useState('general');
  const [toolsSearchQuery, setToolsSearchQuery] = useState('');
  const [activeToolsCategory, setActiveToolsCategory] = useState('');

  const {
    consultAssistResults,
    differentialDiagnosisResults,
    handleConsultAssist,
    handleDifferentialDiagnosis,
    isLoading,
    error,
    makeAPIRequest,
  } = useConsultAssist();

  const { prompts, addPrompt, editPrompt, deletePrompt } = usePromptManagement();

  const [selectedAITask, setSelectedAITask] = useState('consult');
  const [customPromptResults, setCustomPromptResults] = useState<Record<string, string>>({});

  const { templates, addTemplate, editTemplate, deleteTemplate } = useTemplateManagement();

  const {
    isRecording,
    transcript,
    error: recordingError,
    startRecording,
    stopRecording,
  } = useAudioRecording();

  useEffect(() => {
    if (transcript) {
      setPatientSummary(prevSummary => `${prevSummary} ${transcript}`);
    }
  }, [transcript]);

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    const selectedTemplateContent = templates.find(t => t.id.toString() === value)?.content;
    if (selectedTemplateContent) {
      setPatientSummary(selectedTemplateContent);
    }
  };

  const resetAll = () => {
    setPatientSummary('');
    setSelectedAITask('consult');
    setCustomPromptResults({});
    // Reset other state variables as needed
  };

  const handleCustomPrompt = async (promptId: number) => {
    try {
      const selectedPrompt = prompts.find(p => p.id === promptId);
      if (selectedPrompt && makeAPIRequest) {
        const response = await makeAPIRequest(selectedPrompt.content, patientSummary);
        setCustomPromptResults(prev => ({ ...prev, [promptId]: response }));
        setSelectedAITask(promptId.toString());
      }
    } catch (err) {
      console.error('Error in custom prompt:', err);
      // Error handling is managed by makeAPIRequest
    }
  };

  return {
    patientSummary,
    setPatientSummary,
    rightColumnTab,
    setRightColumnTab,
    selectedTemplate,
    handleTemplateChange,
    isRecording,
    startRecording,
    stopRecording,
    toolsSearchQuery,
    setToolsSearchQuery,
    activeToolsCategory,
    setActiveToolsCategory,
    consultAssistResults,
    differentialDiagnosisResults,
    handleConsultAssist,
    handleDifferentialDiagnosis,
    prompts,
    addPrompt,
    editPrompt,
    deletePrompt,
    selectedAITask,
    setSelectedAITask,
    customPromptResults,
    isLoading,
    error,
    resetAll,
    templates,
    addTemplate,
    editTemplate,
    deleteTemplate,
    handleCustomPrompt,
    recordingError,
  };
}
