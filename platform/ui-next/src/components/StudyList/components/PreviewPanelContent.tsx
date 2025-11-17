import * as React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Thumbnail } from '../../Thumbnail';
import { TooltipProvider } from '../../Tooltip';
import type { StudyRow } from '../StudyListTypes';
import type { WorkflowId } from '../WorkflowsInfer';
import { PatientSummary } from '../../PatientSummary';
import { useStudyList } from '../headless/StudyListProvider';

type ThumbnailRow = {
  id: string;
  description: string;
  seriesNumber: number | string;
  numInstances: number;
  modality?: string;
  imageSrc?: string;
};

export function PreviewPanelContent({
  study,
  defaultMode,
  onDefaultModeChange,
}: {
  study: StudyRow;
  defaultMode: WorkflowId | null;
  onDefaultModeChange: (v: WorkflowId | null) => void;
}) {
  const { launch, availableWorkflowsFor, fetchSeriesThumbnails } = useStudyList<StudyRow, WorkflowId>();

  const [thumbs, setThumbs] = React.useState<ThumbnailRow[] | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      if (!fetchSeriesThumbnails) {
        setThumbs(null);
        return;
      }
      try {
        const rows = await fetchSeriesThumbnails(study);
        if (mounted) setThumbs(rows as ThumbnailRow[]);
      } catch (_e) {
        if (mounted) setThumbs(null);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [fetchSeriesThumbnails, study]);

  const placeholders = React.useMemo(() => {
    const n = Math.floor(Math.random() * 7) + 3;
    return Array.from({ length: n }, (_, i) => ({
      id: `preview-${study.accession}-${i}`,
      description: `Series ${i + 1}`,
      seriesNumber: i + 1,
      numInstances: 1,
      modality: study.modalities,
    }));
  }, [study]);

  const thumbnails = thumbs ?? placeholders;

  return (
    <DndProvider backend={HTML5Backend}>
      <TooltipProvider delayDuration={200}>
        <div className="flex flex-col gap-3">
          <PatientSummary data={study}>
            <PatientSummary.Patient />
            <PatientSummary.Workflows<WorkflowId>
              defaultMode={defaultMode}
              onDefaultModeChange={onDefaultModeChange}
              workflows={availableWorkflowsFor(study)}
              onLaunchWorkflow={(data, wf) => launch((data as StudyRow) ?? study, wf)}
            />
          </PatientSummary>
          <div className="h-7 w-full px-2 flex items-center text-foreground font-semibold text-base">
            1 Study
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(0,135px))] place-items-start gap-[4px] pr-2">
            {thumbnails.map((item) => (
              <Thumbnail
                key={item.id}
                displaySetInstanceUID={item.id}
                description={item.description}
                seriesNumber={item.seriesNumber as number}
                numInstances={item.numInstances}
                modality={item.modality ?? study.modalities}
                imageSrc={item.imageSrc}
                isActive={false}
                onClick={() => {}}
                onDoubleClick={() => {}}
                viewPreset="thumbnails"
              />
            ))}
          </div>
        </div>
      </TooltipProvider>
    </DndProvider>
  );
}
