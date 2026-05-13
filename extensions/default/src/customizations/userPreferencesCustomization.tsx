import React, { useMemo, useState, useEffect } from 'react';
import { useSystem, hotkeys as hotkeysModule } from '@ohif/core';
import {
  UserPreferencesModal,
  FooterAction,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@ohif/ui-next';
import { useTranslation } from 'react-i18next';
import i18n from '@ohif/i18n';

const { availableLanguages, defaultLanguage, currentLanguage: currentLanguageFn } = i18n;

interface HotkeyDefinition {
  keys: string;
  label: string;
}

interface HotkeyDefinitions {
  [key: string]: HotkeyDefinition;
}

const MODIFIER_OPTIONS = [
  { value: '16', label: 'Shift' },
  { value: '17', label: 'Ctrl' },
  { value: '18', label: 'Alt' },
  { value: '91', label: 'Meta' },
];

const HOTKEY_CATEGORIES = {
  viewport: new Set([
    'Zoom', 'Zoom In', 'Zoom Out', 'Zoom to Fit',
    'Rotate Right', 'Rotate Left',
    'Flip Horizontally', 'Flip Vertically',
    'Invert', 'Reset',
  ]),
  imageNavigation: new Set([
    'Next Image Viewport', 'Previous Image Viewport',
    'Next Series', 'Previous Series',
    'Next Stage', 'Previous Stage',
    'Next Image', 'Previous Image',
    'First Image', 'Last Image',
  ]),
  toolsAndActions: new Set([
    'W/L Preset 1', 'W/L Preset 2', 'W/L Preset 3', 'W/L Preset 4',
    'Cancel Measurement', 'Delete Annotation',
    'Undo', 'Redo', 'Cine',
  ]),
  segmentation: new Set([
    'Interpolate Scroll', 'Increase Brush Size', 'Decrease Brush Size',
    'Eraser', 'Brush', 'Add New Segment',
    'Accept Preview', 'Reject Preview',
  ]),
};

function filterHotkeysByCategory(
  definitions: HotkeyDefinitions,
  labels: Set<string>
): [string, HotkeyDefinition][] {
  return Object.entries(definitions).filter(([, def]) => labels.has(def.label));
}

const DEFAULT_TOOL_BINDINGS_STORAGE_KEY = 'user-preferred-tool-bindings';

function getToolModifier(
  toolGroupService: any,
  toolGroupId: string,
  toolName: string,
  mouseButton: number
): string | null {
  if (!toolGroupService) {
    return null;
  }
  const bindings = toolGroupService.getToolBindings(toolGroupId, toolName);
  if (!bindings?.length) {
    return null;
  }
  const modifierBinding = bindings.find(
    binding =>
      binding.mouseButton === mouseButton &&
      binding.modifierKey != null &&
      binding.numTouchPoints == null
  );

  return modifierBinding?.modifierKey != null ? String(modifierBinding.modifierKey) : null;
}

function getModifierFromBindings(
  bindings: Array<Record<string, unknown>> | undefined,
  mouseButton: number
): string | null {
  if (!bindings?.length) {
    return null;
  }

  const modifierBinding = bindings.find(
    binding =>
      binding.mouseButton === mouseButton &&
      binding.modifierKey != null &&
      binding.numTouchPoints == null
  );

  return modifierBinding?.modifierKey != null ? String(modifierBinding.modifierKey) : null;
}

function UserPreferencesModalDefault({ hide }: { hide: () => void }) {
  const { hotkeysManager, servicesManager } = useSystem();
  const { t, i18n: i18nextInstance } = useTranslation('UserPreferencesModal');
  const toolGroupService = (servicesManager as any)?.services?.toolGroupService;

  const { hotkeyDefinitions = {}, hotkeyDefaults = {} } = hotkeysManager;

  const fallbackHotkeyDefinitions = useMemo(
    () =>
      hotkeysManager.getValidHotkeyDefinitions(
        hotkeysModule.defaults.hotkeyBindings
      ) as HotkeyDefinitions,
    [hotkeysManager]
  );

  useEffect(() => {
    if (!Object.keys(hotkeyDefaults).length) {
      hotkeysManager.setDefaultHotKeys(hotkeysModule.defaults.hotkeyBindings);
    }

    if (!Object.keys(hotkeyDefinitions).length) {
      hotkeysManager.setHotkeys(fallbackHotkeyDefinitions);
    }
  }, [hotkeysManager, hotkeyDefaults, hotkeyDefinitions, fallbackHotkeyDefinitions]);

  const resolvedHotkeyDefaults = Object.keys(hotkeyDefaults).length
    ? (hotkeyDefaults as HotkeyDefinitions)
    : fallbackHotkeyDefinitions;

  const initialHotkeyDefinitions = Object.keys(hotkeyDefinitions).length
    ? (hotkeyDefinitions as HotkeyDefinitions)
    : resolvedHotkeyDefaults;

  const currentLanguage = currentLanguageFn();

  const initialCrosshairModifier = useMemo(
    () => getToolModifier(toolGroupService, 'mpr', 'Crosshairs', 1),
    [toolGroupService]
  );
  const defaultCrosshairBindings = useMemo(
    () => toolGroupService?.getDefaultToolBindings?.('mpr', 'Crosshairs'),
    [toolGroupService]
  );

  const [state, setState] = useState({
    hotkeyDefinitions: initialHotkeyDefinitions,
    languageValue: currentLanguage.value,
    crosshairModifier: initialCrosshairModifier,
  });

  const onLanguageChangeHandler = (value: string) => {
    setState(state => ({ ...state, languageValue: value }));
  };

  const onHotkeyChangeHandler = (id: string, newKeys: string) => {
    setState(state => ({
      ...state,
      hotkeyDefinitions: {
        ...state.hotkeyDefinitions,
        [id]: {
          ...state.hotkeyDefinitions[id],
          keys: newKeys,
        },
      },
    }));
  };

  const onResetHandler = () => {
    setState(state => ({
      ...state,
      languageValue: defaultLanguage.value,
      hotkeyDefinitions: resolvedHotkeyDefaults,
      crosshairModifier: getModifierFromBindings(defaultCrosshairBindings, 1),
    }));

    hotkeysManager.restoreDefaultBindings();
    if (toolGroupService && defaultCrosshairBindings?.length) {
      toolGroupService.setToolBindings('mpr', 'Crosshairs', defaultCrosshairBindings);
      toolGroupService.applyToolBindings('mpr', 'Crosshairs', {
        replaceExisting: true,
      });
    }
    toolGroupService?.removePersistedToolBindings('mpr', 'Crosshairs');
  };

  const displayNames = React.useMemo(() => {
    if (typeof Intl === 'undefined' || typeof Intl.DisplayNames !== 'function') {
      return null;
    }

    const locales = [state.languageValue, currentLanguage.value, i18nextInstance.language, 'en'];
    const uniqueLocales = Array.from(new Set(locales.filter(Boolean)));

    try {
      return new Intl.DisplayNames(uniqueLocales, { type: 'language', fallback: 'none' });
    } catch (error) {
      console.warn('Intl.DisplayNames not supported for locales', uniqueLocales, error);
    }

    return null;
  }, [state.languageValue, currentLanguage.value, i18nextInstance.language]);

  const getLanguageLabel = React.useCallback(
    (languageValue: string, fallbackLabel: string) => {
      const translationKey = `LanguageName.${languageValue}`;
      if (i18nextInstance.exists(translationKey, { ns: 'UserPreferencesModal' })) {
        return t(translationKey);
      }

      if (displayNames) {
        try {
          const localized = displayNames.of(languageValue);
          if (localized && localized.toLowerCase() !== languageValue.toLowerCase()) {
            return localized.charAt(0).toUpperCase() + localized.slice(1);
          }
        } catch (error) {
          console.debug(`Unable to resolve display name for ${languageValue}`, error);
        }
      }

      return fallbackLabel;
    },
    [displayNames, i18nextInstance, t]
  );

  return (
    <UserPreferencesModal>
      <UserPreferencesModal.Body>
        {/* Language Section */}
        <div className="mb-3 flex items-center space-x-14">
          <UserPreferencesModal.SubHeading>{t('Language')}</UserPreferencesModal.SubHeading>
          <Select
            defaultValue={state.languageValue}
            onValueChange={onLanguageChangeHandler}
          >
            <SelectTrigger
              className="w-60"
              aria-label="Language"
            >
              <SelectValue placeholder={t('Select language')} />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map(lang => (
                <SelectItem
                  key={lang.value}
                  value={lang.value}
                >
                  {getLanguageLabel(lang.value, lang.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="viewport">
          <div className="flex items-center space-x-14">
            <UserPreferencesModal.SubHeading>
              {t('Shortcuts', { defaultValue: 'Shortcuts' })}
            </UserPreferencesModal.SubHeading>
            <TabsList>
              <TabsTrigger value="viewport">
                {t('Viewport', { defaultValue: 'Viewport' })}
              </TabsTrigger>
              <TabsTrigger value="toolsAndActions">
                {t('ToolsAndActions', { defaultValue: 'Tools & Actions' })}
              </TabsTrigger>
            </TabsList>
          </div>

          <UserPreferencesModal.TabContentGrid>
            <TabsContent
              value="viewport"
              forceMount
              className="col-start-1 row-start-1 data-[state=inactive]:invisible"
            >
              <UserPreferencesModal.Well>
                <div className="flex flex-col gap-1.5">
                  <UserPreferencesModal.HotkeySection
                    title={t('ViewControls', { defaultValue: 'View Controls' })}
                  >
                    <UserPreferencesModal.HotkeysGrid>
                      {filterHotkeysByCategory(
                        state.hotkeyDefinitions,
                        HOTKEY_CATEGORIES.viewport
                      ).map(([id, definition]) => (
                        <UserPreferencesModal.Hotkey
                          key={id}
                          label={t(definition.label)}
                          value={definition.keys}
                          onChange={newKeys => onHotkeyChangeHandler(id, newKeys)}
                          placeholder={definition.keys}
                          hotkeys={hotkeysModule}
                        />
                      ))}
                    </UserPreferencesModal.HotkeysGrid>
                  </UserPreferencesModal.HotkeySection>
                  <UserPreferencesModal.HotkeySection
                    title={t('Navigation', { defaultValue: 'Navigation' })}
                    showDivider
                  >
                    <UserPreferencesModal.HotkeysGrid>
                      {filterHotkeysByCategory(
                        state.hotkeyDefinitions,
                        HOTKEY_CATEGORIES.imageNavigation
                      ).map(([id, definition]) => (
                        <UserPreferencesModal.Hotkey
                          key={id}
                          label={t(definition.label)}
                          value={definition.keys}
                          onChange={newKeys => onHotkeyChangeHandler(id, newKeys)}
                          placeholder={definition.keys}
                          hotkeys={hotkeysModule}
                        />
                      ))}
                    </UserPreferencesModal.HotkeysGrid>
                  </UserPreferencesModal.HotkeySection>
                </div>
              </UserPreferencesModal.Well>
            </TabsContent>

            <TabsContent
              value="toolsAndActions"
              forceMount
              className="col-start-1 row-start-1 data-[state=inactive]:invisible"
            >
              <UserPreferencesModal.Well>
                <div className="flex flex-col gap-1.5">
                  <UserPreferencesModal.HotkeySection
                    title={t('ToolsAndActions', { defaultValue: 'Tools & Actions' })}
                  >
                    <UserPreferencesModal.HotkeysGrid>
                      {filterHotkeysByCategory(
                        state.hotkeyDefinitions,
                        HOTKEY_CATEGORIES.toolsAndActions
                      ).map(([id, definition]) => (
                        <UserPreferencesModal.Hotkey
                          key={id}
                          label={t(definition.label)}
                          value={definition.keys}
                          onChange={newKeys => onHotkeyChangeHandler(id, newKeys)}
                          placeholder={definition.keys}
                          hotkeys={hotkeysModule}
                        />
                      ))}
                    </UserPreferencesModal.HotkeysGrid>
                  </UserPreferencesModal.HotkeySection>
                  <UserPreferencesModal.HotkeySection
                    title={t('Segmentation', { defaultValue: 'Segmentation' })}
                    showDivider
                  >
                    <UserPreferencesModal.HotkeysGrid>
                      {filterHotkeysByCategory(
                        state.hotkeyDefinitions,
                        HOTKEY_CATEGORIES.segmentation
                      ).map(([id, definition]) => (
                        <UserPreferencesModal.Hotkey
                          key={id}
                          label={t(definition.label)}
                          value={definition.keys}
                          onChange={newKeys => onHotkeyChangeHandler(id, newKeys)}
                          placeholder={definition.keys}
                          hotkeys={hotkeysModule}
                        />
                      ))}
                    </UserPreferencesModal.HotkeysGrid>
                  </UserPreferencesModal.HotkeySection>
                  <UserPreferencesModal.SectionDivider />
                  <UserPreferencesModal.SectionHeading>
                    {t('MouseAndModifiers', { defaultValue: 'Mouse & Modifiers' })}
                  </UserPreferencesModal.SectionHeading>
                  {state.crosshairModifier != null && (
                    <UserPreferencesModal.HotkeysGrid>
                      <div className="mb-2 flex break-inside-avoid items-center justify-between gap-2">
                        <span className="text-foreground text-base">
                          {t('CrosshairsModifier', { defaultValue: 'Crosshairs' })}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground text-sm">
                            {t('PlusLeftClick', { defaultValue: 'Left Click +' })}
                          </span>
                          <Select
                            value={state.crosshairModifier}
                            onValueChange={val => setState(s => ({ ...s, crosshairModifier: val }))}
                          >
                            <SelectTrigger className="w-16">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {MODIFIER_OPTIONS.map(opt => (
                                <SelectItem
                                  key={opt.value}
                                  value={opt.value}
                                >
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </UserPreferencesModal.HotkeysGrid>
                  )}
                </div>
              </UserPreferencesModal.Well>
            </TabsContent>
          </UserPreferencesModal.TabContentGrid>
        </Tabs>
      </UserPreferencesModal.Body>
      <FooterAction>
        <FooterAction.Left>
          <FooterAction.Auxiliary onClick={onResetHandler}>
            {t('Reset to defaults')}
          </FooterAction.Auxiliary>
        </FooterAction.Left>
        <FooterAction.Right>
          <FooterAction.Secondary
            onClick={() => {
              hotkeysModule.stopRecord();
              hotkeysModule.unpause();
              hide();
            }}
          >
            {t('Cancel')}
          </FooterAction.Secondary>
          <FooterAction.Primary
            onClick={() => {
              if (state.languageValue !== currentLanguage.value) {
                i18n.changeLanguage(state.languageValue);
                // Force page reload after language change to ensure all translations are applied
                window.location.reload();
                return; // Exit early since we're reloading
              }
              hotkeysManager.setHotkeys(state.hotkeyDefinitions);

              if (toolGroupService && state.crosshairModifier != null) {
                const bindings = [
                  { mouseButton: 1, modifierKey: Number(state.crosshairModifier) },
                ];
                toolGroupService.setToolBindings('mpr', 'Crosshairs', bindings);
                toolGroupService.applyToolBindings('mpr', 'Crosshairs', {
                  replaceExisting: true,
                });
                toolGroupService.persistToolBindings('mpr', 'Crosshairs', bindings);
              }

              hotkeysModule.stopRecord();
              hotkeysModule.unpause();
              hide();
            }}
          >
            {t('Save')}
          </FooterAction.Primary>
        </FooterAction.Right>
      </FooterAction>
    </UserPreferencesModal>
  );
}

export default {
  'ohif.userPreferencesModal': UserPreferencesModalDefault,
  'ohif.userPreferences.toolBindingsStorageKey': DEFAULT_TOOL_BINDINGS_STORAGE_KEY,
};
