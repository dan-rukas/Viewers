import { id } from './id';
import {
  initToolGroups,
  basicLayout,
  basicRoute,
  extensionDependencies as basicDependencies,
  mode as basicMode,
  modeInstance as basicModeInstance,
} from '@ohif/mode-basic';

/**
 * Mobile Viewer (experimental).
 *
 * Composed from @ohif/mode-basic (the upstream-intended pattern — same as
 * longitudinal). The ONLY structural change is the layout template id:
 * the route resolves to the mobile extension's `mobileLayout` instead of
 * the default ViewerLayout. Panels, toolbar, tool groups, lifecycle
 * (including basic's onModeExit teardown ritual) are all inherited.
 *
 * URL: /mobile?StudyInstanceUIDs=...
 */

const mobileExtensionId = '@ohif/extension-mobile';

export const extensionDependencies = {
  ...basicDependencies,
  [mobileExtensionId]: '^0.0.1',
};

const mobileLayoutInstance = {
  ...basicLayout,
  // The one line that swaps the shell:
  id: `${mobileExtensionId}.layoutTemplateModule.mobileLayout`,
  props: {
    ...basicLayout.props,
    // Keep basic's leftPanels/rightPanels — Mode.tsx strips them into
    // PanelService, and the mobile sheet reads them back from the service.
  },
};

export const mobileRoute = {
  ...basicRoute,
  path: 'mobile',
  layoutInstance: mobileLayoutInstance,
};

export const modeInstance = {
  ...basicModeInstance,
  id,
  routeName: 'mobile',
  hide: false,
  displayName: 'Mobile Viewer (Experimental)',
  routes: [mobileRoute],
  extensions: extensionDependencies,
};

const mode = {
  ...basicMode,
  id,
  modeInstance,
  extensionDependencies,
};

export default mode;
export { initToolGroups };
