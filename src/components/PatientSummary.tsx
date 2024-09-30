'use client';

import { Check, ChevronDown, Mic, RefreshCw, Settings } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useNoteCorrection } from '@/hooks/useNoteCorrection';
import type { Template } from '@/hooks/useTemplateManagement';

type PatientSummaryProps = {
  patientSummary: string;
  setPatientSummary: (summary: string) => void;
  selectedTemplate: string;
  handleTemplateChange: (template: string) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  templates: Template[];
  _addTemplate: (template: Omit<Template, 'id'>) => void;
  _editTemplate: (id: string, template: Omit<Template, 'id'>) => void;
  _deleteTemplate: (id: string) => void;
  resetAll: () => void;
  isLoading: boolean;
  error: string | null;
};

export function PatientSummary({
  patientSummary,
  setPatientSummary,
  selectedTemplate,
  handleTemplateChange,
  isRecording,
  startRecording,
  stopRecording,
  templates,
  resetAll,
  isLoading,
  error,
}: PatientSummaryProps) {
  const { correctNote, isCorrecting, error: correctionError } = useNoteCorrection();

  const handleTemplateSelect = (templateId: string) => {
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      setPatientSummary(selectedTemplate.content);
      handleTemplateChange(templateId);
    }
  };

  const handleCorrect = async () => {
    const correctedNote = await correctNote(patientSummary);
    if (correctedNote) {
      setPatientSummary(correctedNote);
    }
  };

  return (
    <Card className="flex grow flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Consultation</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant={isRecording ? 'destructive' : 'secondary'}
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
          >
            <Mic className={`size-4 ${isRecording ? 'animate-pulse' : ''}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name : 'Templates'}
                <ChevronDown className="ml-1 size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {templates.map(template => (
                <DropdownMenuItem
                  key={template.id}
                  onSelect={() => handleTemplateSelect(template.id)}
                >
                  {template.name}
                  {template.id === selectedTemplate && <Check className="ml-2 size-4" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/template-management" className="flex items-center">
                  <Settings className="mr-2 size-4" />
                  Manage Templates
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex grow flex-col pt-2">
        <Textarea
          placeholder="Enter patient notes here..."
          className="min-h-0 grow resize-none"
          value={patientSummary}
          onChange={e => setPatientSummary(e.target.value)}
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button
            onClick={handleCorrect}
            variant="outline"
            size="sm"
            disabled={isCorrecting}
          >
            {isCorrecting
              ? (
                  <RefreshCw className="mr-1 size-3 animate-spin" />
                )
              : (
                  <Check className="mr-1 size-3" />
                )}
            Correct
          </Button>
          <Button onClick={resetAll} variant="outline" size="sm">
            <RefreshCw className="mr-1 size-3" />
            Reset All
          </Button>
        </div>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {correctionError && <p className="text-red-500">{correctionError}</p>}
      </CardContent>
    </Card>
  );
}
