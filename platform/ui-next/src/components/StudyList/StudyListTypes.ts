import type { WorkflowId } from './WorkflowsInfer';

export type StudyRow = {
  patient: string;
  mrn: string;
  studyDateTime: string;
  modalities: string;
  description: string;
  accession: string;
  instances: number;
  /** Optional server UID for launch/preview wiring */
  studyInstanceUid?: string;
  /** Optional, data-driven list of available workflows for this study (immutable) */
  workflows?: readonly WorkflowId[];
};
