import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Enums, VolumeViewport3D, cache, eventTarget, utilities as csUtils } from '@cornerstonejs/core';
import {
  SmartScrollbar,
  SmartScrollbarTrack,
  SmartScrollbarFill,
  SmartScrollbarIndicator,
  SmartScrollbarEndpoints,
} from '@ohif/ui-next';

function ViewportSmartScrollbar({
  viewportData,
  viewportId,
  element,
  servicesManager,
}: withAppTypes<{
  element: HTMLElement;
}>) {
  const { cineService, cornerstoneViewportService } = servicesManager.services;

  // ── Slice position tracking ────────────────────────────────────
  const [imageIndex, setImageIndex] = useState(0);
  const [numberOfSlices, setNumberOfSlices] = useState(0);

  // ── Cache tracking (PR #4340 pattern) ──────────────────────────
  const [loadedSlices, setLoadedSlices] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [renderTick, setRenderTick] = useState(0);
  const loadedRef = useRef<Set<number>>(new Set());

  // ── Viewed tracking ────────────────────────────────────────────
  const viewedRef = useRef<Set<number>>(new Set());
  const [viewedTick, setViewedTick] = useState(0);

  // ── Slice position: initial sync ──────────────────────────────
  useEffect(() => {
    if (!viewportData) return;
    const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
    if (!viewport || viewport instanceof VolumeViewport3D) return;

    try {
      setImageIndex(viewport.getCurrentImageIdIndex());
      setNumberOfSlices(viewport.getNumberOfSlices());
    } catch (error) {
      console.warn(error);
    }
  }, [viewportId, viewportData, cornerstoneViewportService]);

  // ── Slice position: event-driven updates ──────────────────────
  useEffect(() => {
    if (!viewportData) return;
    const { viewportType } = viewportData;
    const eventId =
      (viewportType === Enums.ViewportType.STACK && Enums.Events.STACK_NEW_IMAGE) ||
      (viewportType === Enums.ViewportType.ORTHOGRAPHIC && Enums.Events.VOLUME_NEW_IMAGE) ||
      Enums.Events.IMAGE_RENDERED;

    const updateIndex = (event: any) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport || viewport instanceof VolumeViewport3D) return;
      const { imageIndex, newImageIdIndex = imageIndex, imageIdIndex } = event.detail;
      const slices = viewport.getNumberOfSlices();
      setImageIndex(newImageIdIndex ?? imageIdIndex);
      setNumberOfSlices(slices);
    };

    element.addEventListener(eventId, updateIndex);
    return () => element.removeEventListener(eventId, updateIndex);
  }, [viewportData, element, viewportId, cornerstoneViewportService]);

  // ── Cache tracking: scan + listen ─────────────────────────────
  const updateCachedSlices = useCallback(() => {
    if (!viewportData?.data?.[0]?.imageIds) return;
    const { imageIds } = viewportData.data[0];

    const cached = new Set<number>();
    imageIds.forEach((imageId: string, index: number) => {
      if (cache.isLoaded(imageId)) {
        cached.add(index);
      }
    });

    loadedRef.current = cached;
    setLoadedSlices(cached);
    setIsLoading(cached.size > 0 && cached.size < imageIds.length);
    setRenderTick(t => t + 1);
  }, [viewportData]);

  useEffect(() => {
    if (!viewportData?.data?.[0]?.imageIds) return;

    // Initial scan
    updateCachedSlices();

    // Listen for cache changes
    eventTarget.addEventListener(Enums.Events.IMAGE_CACHE_IMAGE_ADDED, updateCachedSlices);
    eventTarget.addEventListener(Enums.Events.IMAGE_CACHE_IMAGE_REMOVED, updateCachedSlices);

    return () => {
      eventTarget.removeEventListener(Enums.Events.IMAGE_CACHE_IMAGE_ADDED, updateCachedSlices);
      eventTarget.removeEventListener(Enums.Events.IMAGE_CACHE_IMAGE_REMOVED, updateCachedSlices);
    };
  }, [viewportData, updateCachedSlices]);

  // ── Viewed tracking: accumulate as user scrolls ───────────────
  useEffect(() => {
    if (loadedRef.current.has(imageIndex) && !viewedRef.current.has(imageIndex)) {
      viewedRef.current.add(imageIndex);
      setViewedTick(t => t + 1);
    }
  }, [imageIndex]);

  // Suppress unused warnings
  void renderTick;
  void viewedTick;

  // ── Jump to slice callback ────────────────────────────────────
  const handleValueChange = useCallback(
    (index: number) => {
      const viewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
      if (!viewport) return;

      const { isCineEnabled } = cineService.getState();
      if (isCineEnabled) {
        cineService.stopClip(element, { viewportId });
        cineService.setCine({ id: viewportId, isPlaying: false });
      }

      csUtils.jumpToSlice(viewport.element, {
        imageIndex: index,
        debounceLoading: true,
      });
    },
    [viewportId, element, cornerstoneViewportService, cineService]
  );

  // ── Don't render until we have slice data ─────────────────────
  if (numberOfSlices === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        height: '100%',
        padding: '5px 5px 0 5px',
        zIndex: 10,
      }}
    >
      <SmartScrollbar
        value={imageIndex}
        totalSlices={numberOfSlices}
        onValueChange={handleValueChange}
        isLoading={isLoading}
      >
        <SmartScrollbarTrack>
          <SmartScrollbarFill
            slices={loadedSlices}
            className="bg-neutral/25"
            loadingClassName="bg-neutral/50"
          />
          <SmartScrollbarFill
            slices={viewedRef.current}
            className="bg-primary/35"
          />
        </SmartScrollbarTrack>
        <SmartScrollbarIndicator />
        <SmartScrollbarEndpoints slices={loadedSlices} />
      </SmartScrollbar>
    </div>
  );
}

export default ViewportSmartScrollbar;
