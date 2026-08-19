import React, { useEffect, useState, useCallback } from 'react';
import { HangingProtocolService } from '@ohif/core';
import useBreakpoint from '../hooks/useBreakpoint';

/**
 * MobileLayout v0 — the frame, not the finished UI.
 *
 * Goal: prove the layout-template seam and the breakpoints.
 *   phone   → top bar + full-bleed grid + FAB placeholder + bottom-sheet placeholder
 *   tablet  → top bar + grid + right-rail placeholder
 *   desktop → renders the real desktop ViewerLayout (same URL adapts)
 *
 * Implements the minimal layout-template contract:
 * body classes, viewport resolution, grid render, loading state, PanelService wiring.
 */

const DESKTOP_LAYOUT_ID = '@ohif/extension-default.layoutTemplateModule.viewerLayout';

class PanelErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-muted-foreground p-4 text-sm">
          Panel failed to render in the sheet host (v0 — expected for some panels).
        </div>
      );
    }
    return this.props.children;
  }
}

function BreakpointBadge({ bp }) {
  return (
    <div className="text-foreground rounded bg-black/60 px-2 py-1 font-mono text-[11px]">
      {bp.name} · {bp.width}×{bp.height} · {bp.isPortrait ? 'portrait' : 'landscape'} ·{' '}
      {bp.isCoarsePointer ? 'touch' : 'mouse'}
    </div>
  );
}

function MobileLayout({
  // From extension module params
  extensionManager,
  servicesManager,
  hotkeysManager,
  commandsManager,
  // From mode layout props (leftPanels/rightPanels are stripped by Mode.tsx
  // into PanelService before we render — we read them back from the service)
  viewports,
  ViewportGridComp,
  ...rest
}: any) {
  const { panelService, hangingProtocolService } = servicesManager.services;
  const bp = useBreakpoint();

  const [isLoading, setIsLoading] = useState(true);
  const [sheetState, setSheetState] = useState<'peek' | 'half'>('peek');
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const getTabs = useCallback(
    () => [...panelService.getPanels('left'), ...panelService.getPanels('right')],
    [panelService]
  );
  const [tabs, setTabs] = useState(getTabs);

  // Contract item 1: body classes
  useEffect(() => {
    document.body.classList.add('bg-background');
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('bg-background');
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  // Contract item 4: loading state cleared on first PROTOCOL_CHANGED
  useEffect(() => {
    const { unsubscribe } = hangingProtocolService.subscribe(
      HangingProtocolService.EVENTS.PROTOCOL_CHANGED,
      () => setIsLoading(false)
    );
    return () => unsubscribe();
  }, [hangingProtocolService]);

  // Contract item 5: panel wiring via PanelService events
  useEffect(() => {
    const { unsubscribe } = panelService.subscribe(panelService.EVENTS.PANELS_CHANGED, () => {
      setTabs(getTabs());
    });
    return () => unsubscribe();
  }, [panelService, getTabs]);

  // Contract item 2: resolve viewport components by namespace
  const getViewportComponentData = viewportComponent => {
    const entry = extensionManager.getModuleEntry(viewportComponent.namespace);
    if (!entry || !entry.component) {
      throw new Error(`${viewportComponent.namespace} did not resolve to a viewport component`);
    }
    return {
      component: entry.component,
      isReferenceViewable: entry.isReferenceViewable,
      displaySetsToDisplay: viewportComponent.displaySetsToDisplay,
    };
  };
  const viewportComponents = viewports.map(getViewportComponentData);

  // Desktop: render the real ViewerLayout — the "one URL adapts" demo
  if (bp.isDesktop) {
    const desktopEntry = extensionManager.getModuleEntry(DESKTOP_LAYOUT_ID);
    const DesktopLayout = desktopEntry?.component;
    if (DesktopLayout) {
      return (
        <div className="relative">
          <div className="pointer-events-none absolute right-2 top-14 z-50">
            <BreakpointBadge bp={bp} />
          </div>
          <DesktopLayout
            viewports={viewports}
            ViewportGridComp={ViewportGridComp}
            {...rest}
          />
        </div>
      );
    }
  }

  const activeTab = tabs[activeTabIndex];
  const isPhone = !bp.isTablet && !bp.isDesktop;

  const grid = (
    <div className="bg-background relative flex h-full w-full items-center justify-center overflow-hidden">
      {isLoading && (
        <div className="text-muted-foreground absolute inset-0 z-30 flex items-center justify-center">
          Loading study…
        </div>
      )}
      <ViewportGridComp
        servicesManager={servicesManager}
        viewportComponents={viewportComponents}
        commandsManager={commandsManager}
      />
    </div>
  );

  const topBar = (
    <header className="bg-popover flex h-12 shrink-0 items-center justify-between px-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-muted-foreground text-lg leading-none">‹</span>
        <span className="text-foreground truncate text-sm">Patient (placeholder)</span>
      </div>
      <BreakpointBadge bp={bp} />
    </header>
  );

  const tabStrip = (
    <div className="flex h-12 shrink-0 items-stretch">
      {tabs.length === 0 && (
        <div className="text-muted-foreground flex items-center px-4 text-sm">No panels</div>
      )}
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          className={`flex-1 truncate px-2 text-sm ${
            i === activeTabIndex && sheetState !== 'peek'
              ? 'text-primary border-primary border-b-2'
              : 'text-muted-foreground'
          }`}
          onClick={() => {
            if (i === activeTabIndex && sheetState === 'half') {
              setSheetState('peek');
            } else {
              setActiveTabIndex(i);
              setSheetState('half');
            }
          }}
        >
          {tab.label || tab.name || tab.id}
        </button>
      ))}
    </div>
  );

  // ---- Phone frame: top bar / grid / FAB / bottom sheet ----
  if (isPhone) {
    return (
      <div className="bg-background flex flex-col" style={{ height: '100dvh' }}>
        {topBar}
        <main className="relative min-h-0 flex-1">
          {grid}
          {/* FAB placeholder (ToolMenu lands here) */}
          <button
            className="bg-primary absolute bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg"
            aria-label="Tools (placeholder)"
          >
            T
          </button>
        </main>
        {/* Bottom sheet placeholder (SlideUpPanel lands here) */}
        <footer
          className="bg-popover shrink-0 overflow-hidden border-t border-white/10 transition-[height] duration-200"
          style={{ height: sheetState === 'half' ? '45dvh' : '3rem' }}
        >
          {tabStrip}
          {sheetState === 'half' && activeTab && (
            <div className="h-[calc(100%-3rem)] overflow-y-auto" style={{ touchAction: 'pan-y' }}>
              <PanelErrorBoundary key={activeTab.id}>
                <activeTab.content />
              </PanelErrorBoundary>
            </div>
          )}
        </footer>
      </div>
    );
  }

  // ---- Tablet frame: top bar / grid + right rail ----
  return (
    <div className="bg-background flex flex-col" style={{ height: '100dvh' }}>
      {topBar}
      <div className="flex min-h-0 flex-1 flex-row">
        <main className="relative min-h-0 flex-1">{grid}</main>
        <aside className="bg-popover flex w-80 shrink-0 flex-col border-l border-white/10">
          {tabStrip}
          <div className="min-h-0 flex-1 overflow-y-auto" style={{ touchAction: 'pan-y' }}>
            {activeTab && (
              <PanelErrorBoundary key={activeTab.id}>
                <activeTab.content />
              </PanelErrorBoundary>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default MobileLayout;
