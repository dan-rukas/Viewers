import { id } from './id';
import getLayoutTemplateModule from './getLayoutTemplateModule';

/**
 * Experimental mobile shell.
 * Additive extension: registers the `mobileLayout` layout template.
 * Nothing here modifies core or desktop behavior.
 */
const mobileExtension = {
  id,
  getLayoutTemplateModule,
};

export default mobileExtension;
