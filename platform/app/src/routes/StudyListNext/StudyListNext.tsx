import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StudyList, type StudyRow, ALL_WORKFLOW_OPTIONS, type WorkflowId } from '@ohif/ui-next';
import type { ColumnFiltersState, SortingState, PaginationState } from '@tanstack/react-table';
import { useAppConfig } from '@state';
import { preserveQueryParameters } from '../../utils/preserveQueryParameters';

type ServerStudy = {
  studyInstanceUid: string;
  patientName?: string;
  mrn?: string;
  date?: string; // 'YYYYMMDD' | 'YYYY.MM.DD'
  time?: string; // 'HH' | 'HHmm' | 'HHmmss' | 'HHmmss.SSS'
  description?: string;
  modalities?: string; // may be 'CT/PT' or 'CT\\PT'
  accession?: string;
  instances?: number;
};

type Props = withAppTypes<{
  data: ServerStudy[];
  dataTotal: number;
  isLoadingData: boolean;
  dataPath?: string; // '/<sourceName>' or ''
}>;

export default function StudyListNext(props: Props) {
  const { data, dataPath } = props;
  const [appConfig] = useAppConfig();
  const navigate = useNavigate();
  const location = useLocation();

  // Map server studies → ui-next StudyRow (+ carry UID as extra field for later phases)
  const baseRows: (StudyRow & { studyInstanceUid: string; __serverStudy: ServerStudy })[] = React.useMemo(() => {
    return (data || []).map(s => ({
      patient: s.patientName ?? '',
      mrn: s.mrn ?? '',
      studyDateTime: toISOLikeDateTime(s.date, s.time),
      modalities: s.modalities ?? '',
      description: s.description ?? '',
      accession: s.accession ?? '',
      instances: s.instances ?? 0,
      studyInstanceUid: s.studyInstanceUid,
      __serverStudy: s,
    }));
  }, [data]);

  const seriesCache = React.useRef(new Map<string, any[]>());
  React.useEffect(() => {
    return () => {
      try {
        for (const [, items] of seriesCache.current) {
          (items as Array<{ imageSrc?: string }>).forEach(it => {
            if (it?.imageSrc) {
              try { URL.revokeObjectURL(it.imageSrc); } catch (_) {}
            }
          });
        }
        seriesCache.current.clear();
      } catch (_e) {}
    };
  }, []);

  const fetchSeriesThumbnailsForRow = React.useCallback(
    async (row: StudyRow & { studyInstanceUid?: string }) => {
      const uid = row.studyInstanceUid;
      if (!uid) return [];
      const cached = seriesCache.current.get(uid);
      if (cached) return cached;

      const ds = (props as any).dataSource;
      if (!ds?.query?.series?.search) return [];
      try {
        const series = await ds.query.series.search(uid);
        const cfg = ds.getConfig?.() ?? {};
        const wadoRoot = getWadoRoot(cfg);
        const authHeaders = getAuthHeaders(props);

        const thumbs = await Promise.all(
          (series || []).map(async (s: any, idx: number) => {
            const seriesUID = s.SeriesInstanceUID ?? s.seriesInstanceUid;
            const base: any = {
              id: `${uid}-${seriesUID ?? idx}`,
              description: s.description || '(empty)',
              seriesNumber: s.seriesNumber ?? '',
              numInstances: s.numSeriesInstances ?? 0,
              modality: s.modality,
            };
            if (wadoRoot && seriesUID) {
              const url = makeSeriesThumbnailUrl(wadoRoot, uid, seriesUID);
              try {
                const imageSrc = await fetchObjectUrl(url, authHeaders);
                if (imageSrc) base.imageSrc = imageSrc;
              } catch (_e) {}
            }
            return base;
          })
        );

        // LRU cache cap (20 studies) and revoke object URLs on eviction
        ensureCacheCapacity(seriesCache.current, 20);
        seriesCache.current.set(uid, thumbs);
        return thumbs;
      } catch (_e) {
        return [];
      }
    },
    [props]
  );

  // URL sync (filters/sorting/pagination) — debounce and preserve keys
  const filtersRef = React.useRef<ColumnFiltersState>([]);
  const sortingRef = React.useRef<SortingState>([]);
  const paginationRef = React.useRef<PaginationState>({ pageIndex: 0, pageSize: 50 });
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial state hydration from URL
  const initialSorting = React.useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const sortBy = (sp.get('sortby') || '').toLowerCase();
    const dir = (sp.get('sortdirection') || '').toLowerCase();
    const map: Record<string, string> = { studydate: 'studyDateTime' };
    const id = (map[sortBy] || sortBy) as string;
    if (!id) return [] as SortingState;
    return [{ id, desc: dir === 'descending' }] as SortingState;
  }, [location.search]);

  const initialFilters = React.useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const filters: ColumnFiltersState = [];
    const push = (id: string, key: string) => {
      const v = sp.get(key);
      if (v) filters.push({ id, value: v });
    };
    push('patient', 'patientname');
    push('mrn', 'mrn');
    push('description', 'description');
    push('modalities', 'modalities');
    push('accession', 'accession');
    return filters;
  }, [location.search]);

  const initialPagination = React.useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const pn = Math.max(1, parseInt(sp.get('pagenumber') || sp.get('pageNumber') || '1', 10) || 1);
    const ps = Math.max(1, parseInt(sp.get('resultsperpage') || '50', 10) || 50);
    const init = { pageIndex: pn - 1, pageSize: ps } as PaginationState;
    paginationRef.current = init;
    return init;
  }, [location.search]);

  const scheduleUpdate = React.useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const current = new URLSearchParams(location.search);
      const q = new URLSearchParams();

      // Map filters
      for (const f of filtersRef.current || []) {
        const id = String((f as any).id || '');
        const val = String((f as any).value ?? '').trim();
        if (!val) continue;
        if (id === 'patient') q.set('patientname', val);
        else if (id === 'mrn') q.set('mrn', val);
        else if (id === 'description') q.set('description', val);
        else if (id === 'modalities') q.set('modalities', val);
        else if (id === 'accession') q.set('accession', val);
        // skip studyDateTime for now (no range input yet)
      }

      // Map sorting (first sort only)
      const s = (sortingRef.current || [])[0];
      if (s && (s as any).id) {
        q.set('sortby', String((s as any).id));
        q.set('sortdirection', (s as any).desc ? 'descending' : 'ascending');
      }

      // Map pagination (1-based page number)
      const p = paginationRef.current || { pageIndex: 0, pageSize: 50 };
      q.set('pagenumber', String((p.pageIndex ?? 0) + 1));
      q.set('resultsperpage', String(p.pageSize ?? 50));

      // Preserve important keys
      preserveQueryParameters(q, current);
      const ds = current.get('datasources');
      if (ds) q.set('datasources', ds);

      const newSearch = q.toString();
      if (newSearch !== current.toString()) {
        navigate({ pathname: '/', search: newSearch ? `?${newSearch}` : undefined });
      }
    }, 200);
  }, [location.search, navigate]);

  const onFiltersChange = React.useCallback((filters: ColumnFiltersState) => {
    filtersRef.current = filters;
    scheduleUpdate();
  }, [scheduleUpdate]);

  const onSortingStateChange = React.useCallback((sorting: SortingState) => {
    sortingRef.current = sorting;
    scheduleUpdate();
  }, [scheduleUpdate]);

  const onPaginationChange = React.useCallback((pagination: PaginationState) => {
    paginationRef.current = pagination;
    scheduleUpdate();
  }, [scheduleUpdate]);

  React.useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  return (
    <div className="h-full w-full">
      <StudyList
        data={withWorkflows(baseRows, appConfig)}
        initialSorting={initialSorting}
        initialFilters={initialFilters}
        onLaunch={(row, wf) =>
          handleLaunch(
            row as StudyRow & { studyInstanceUid?: string },
            wf,
            appConfig,
            dataPath,
            location.search,
            navigate
          )
        }
        fetchSeriesThumbnails={fetchSeriesThumbnailsForRow}
        // URL sync callbacks
        onFiltersChange={onFiltersChange}
        onSortingStateChange={onSortingStateChange}
        onPaginationChange={onPaginationChange}
        initialPagination={initialPagination}
      />
    </div>
  );
}

// Accepts 'YYYYMMDD' or 'YYYY.MM.DD' and partial time; emits ISO-like UTC string.
function toISOLikeDateTime(date?: string, time?: string): string {
  if (!date) return '';
  const d = date.replaceAll('.', '');
  const yyyy = d.slice(0, 4);
  const mm = d.slice(4, 6) || '01';
  const dd = d.slice(6, 8) || '01';

  const raw = (time || '').replaceAll(':', '').split('.')[0];
  const hh = raw.slice(0, 2) || '00';
  const mi = raw.slice(2, 4) || '00';
  const ss = raw.slice(4, 6) || '00';

  // ui-next sorter replaces space with 'T' then Date.parse; include 'Z' for stable UTC parse.
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}Z`;
}

function normalizeModalities(s: string = ''): string {
  const parts = s
    .split(/[\/\\]/)
    .map(x => x.trim().toUpperCase())
    .filter(Boolean);
  return Array.from(new Set(parts)).join('\\');
}

function withWorkflows(
  rows: (StudyRow & { studyInstanceUid: string; __serverStudy: ServerStudy })[],
  appConfig: any
): (StudyRow & { studyInstanceUid: string })[] {
  const modes = (appConfig?.loadedModes ?? []) as any[];
  const known = new Set<string>(ALL_WORKFLOW_OPTIONS as readonly string[]);
  const groupFirst = Boolean(appConfig?.groupEnabledModesFirst);

  const computeForStudy = (
    study: { modalities?: string },
    serverStudy: ServerStudy
  ): readonly WorkflowId[] => {
    const modalitiesToCheck = normalizeModalities(study.modalities ?? '');
    const candidates = modes
      .filter(m => !m.hide && m.displayName)
      .map(m => {
        const { valid } = m.isValidMode({ modalities: modalitiesToCheck, study: serverStudy });
        return { mode: m, valid };
      })
      .filter(x => x.valid !== null);

    const sorted = groupFirst
      ? [...candidates].sort((a, b) => Number(b.valid) - Number(a.valid))
      : candidates;

    const labels = sorted
      .filter(x => x.valid === true)
      .map(x => String(x.mode.displayName))
      .filter(l => known.has(l));

    return Array.from(new Set(labels)) as readonly WorkflowId[];
  };

  return rows.map(r => ({
    patient: r.patient,
    mrn: r.mrn,
    studyDateTime: r.studyDateTime,
    modalities: r.modalities,
    description: r.description,
    accession: r.accession,
    instances: r.instances,
    workflows: computeForStudy(r, r.__serverStudy),
    studyInstanceUid: r.studyInstanceUid,
  }));
}

function handleLaunch(
  row: StudyRow & { studyInstanceUid?: string },
  workflow: WorkflowId,
  appConfig: any,
  dataPath: string | undefined,
  currentSearch: string,
  navigate: (to: string) => void
) {
  const modes = (appConfig?.loadedModes ?? []) as any[];
  const mode = modes.find(m => m.displayName && String(m.displayName) === String(workflow));
  if (!mode) return;

  const q = new URLSearchParams();
  const current = new URLSearchParams(currentSearch);
  const cfg = current.get('configUrl');
  if (cfg) q.append('configUrl', cfg);
  if (row?.studyInstanceUid) {
    q.append('StudyInstanceUIDs', row.studyInstanceUid);
  }
  preserveQueryParameters(q, current);

  const dest = `/${mode.routeName}${dataPath || ''}?${q.toString()}`;
  navigate(dest);
}

function getWadoRoot(dsConfig: any): string | undefined {
  return (
    dsConfig?.wadoRoot ||
    dsConfig?.configuration?.wadoRoot ||
    dsConfig?.configuration?.dicomWeb?.wadoRoot ||
    dsConfig?.configuration?.dicomWeb?.servers?.[0]?.wadoRoot ||
    undefined
  );
}

function makeSeriesThumbnailUrl(wadoRoot: string, studyUID: string, seriesUID: string): string {
  return `${wadoRoot.replace(/\/$/, '')}/studies/${encodeURIComponent(studyUID)}/series/${encodeURIComponent(
    seriesUID
  )}/thumbnail`;
}

function getAuthHeaders(props: any): HeadersInit | undefined {
  try {
    const svc = props?.servicesManager?.services?.userAuthenticationService;
    const headersObj = svc?.getAuthorizationHeader?.();
    if (headersObj && typeof headersObj === 'object') {
      return headersObj as HeadersInit;
    }
  } catch (_e) {}
  return undefined;
}

async function fetchObjectUrl(url: string, headers?: HeadersInit): Promise<string | undefined> {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return undefined;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (_e) {
    return undefined;
  }
}

function ensureCacheCapacity(cache: Map<string, any[]>, max = 20) {
  if (cache.size < max) return;
  // Evict oldest entry deterministically by insertion order (Map preserves insertion)
  const firstKey = cache.keys().next().value;
  const items = cache.get(firstKey) as Array<{ imageSrc?: string }> | undefined;
  if (items) {
    for (const it of items) {
      if (it?.imageSrc) {
        try {
          URL.revokeObjectURL(it.imageSrc);
        } catch (_) {}
      }
    }
  }
  cache.delete(firstKey);
}
