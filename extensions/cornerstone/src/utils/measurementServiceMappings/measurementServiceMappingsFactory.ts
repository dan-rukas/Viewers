import { MeasurementService } from '@ohif/core';
import Length from './Length';
import Bidirectional from './Bidirectional';
import EllipticalROI from './EllipticalROI';
import ArrowAnnotate from './ArrowAnnotate';
import CobbAngle from './CobbAngle';
import Angle from './Angle';
import FreehandROI from './FreehandROI';
import RectangleROI from './RectangleROI';
import { getCustomToolsMappingFactory } from './customToolsMappingFactory';

const measurementServiceMappingsFactory = (
  measurementService: MeasurementService,
  displaySetService,
  cornerstoneViewportService
) => {
  /**
   * Maps measurement service format object to cornerstone annotation object.
   *
   * @param measurement The measurement instance
   * @param definition The source definition
   * @return Cornerstone annotation data
   */

  const _getValueTypeFromToolType = toolType => {
    const {
      POLYLINE,
      ELLIPSE,
      RECTANGLE,
      BIDIRECTIONAL,
      POINT,
      ANGLE,
    } = MeasurementService.VALUE_TYPES;

    // TODO -> I get why this was attempted, but its not nearly flexible enough.
    // A single measurement may have an ellipse + a bidirectional measurement, for instances.
    // You can't define a bidirectional tool as a single type..
    const TOOL_TYPE_TO_VALUE_TYPE = {
      Length: POLYLINE,
      EllipticalROI: ELLIPSE,
      RectangleROI: RECTANGLE,
      FreehandROI: POLYLINE,
      Bidirectional: BIDIRECTIONAL,
      ArrowAnnotate: POINT,
      CobbAngle: ANGLE,
      Angle: ANGLE,
    };

    return TOOL_TYPE_TO_VALUE_TYPE[toolType];
  };

  const factories = {
    Length: {
      toAnnotation: Length.toAnnotation,
      toMeasurement: csToolsAnnotation =>
        Length.toMeasurement(
          csToolsAnnotation,
          displaySetService,
          cornerstoneViewportService,
          _getValueTypeFromToolType
        ),
      matchingCriteria: [
        {
          valueType: MeasurementService.VALUE_TYPES.POLYLINE,
          points: 2,
        },
      ],
    },
    Bidirectional: {
      toAnnotation: Bidirectional.toAnnotation,
      toMeasurement: csToolsAnnotation =>
        Bidirectional.toMeasurement(
          csToolsAnnotation,
          displaySetService,
          cornerstoneViewportService,
          _getValueTypeFromToolType
        ),
      matchingCriteria: [
        // TODO -> We should eventually do something like shortAxis + longAxis,
        // But its still a little unclear how these automatic interpretations will work.
        {
          valueType: MeasurementService.VALUE_TYPES.POLYLINE,
          points: 2,
        },
        {
          valueType: MeasurementService.VALUE_TYPES.POLYLINE,
          points: 2,
        },
      ],
    },

    EllipticalROI: {
      toAnnotation: EllipticalROI.toAnnotation,
      toMeasurement: csToolsAnnotation =>
        EllipticalROI.toMeasurement(
          csToolsAnnotation,
          displaySetService,
          cornerstoneViewportService,
          _getValueTypeFromToolType
        ),
      matchingCriteria: [
        {
          valueType: MeasurementService.VALUE_TYPES.ELLIPSE,
        },
      ],
    },

    RectangleROI: {
      toAnnotation: RectangleROI.toAnnotation,
      toMeasurement: csToolsAnnotation =>
        RectangleROI.toMeasurement(
          csToolsAnnotation,
          displaySetService,
          cornerstoneViewportService,
          _getValueTypeFromToolType
        ),
      matchingCriteria: [
        {
          valueType: MeasurementService.VALUE_TYPES.POLYLINE,
        },
      ],
    },

    FreehandROI: {
      toAnnotation: FreehandROI.toAnnotation,
      toMeasurement: csToolsAnnotation =>
        EllipticalROI.toMeasurement(
          csToolsAnnotation,
          displaySetService,
          cornerstoneViewportService,
          _getValueTypeFromToolType
        ),
      matchingCriteria: [
        {
          valueType: MeasurementService.VALUE_TYPES.POLYLINE,
        },
      ],
    },

    ArrowAnnotate: {
      toAnnotation: ArrowAnnotate.toAnnotation,
      toMeasurement: csToolsAnnotation =>
        ArrowAnnotate.toMeasurement(
          csToolsAnnotation,
          displaySetService,
          cornerstoneViewportService,
          _getValueTypeFromToolType
        ),
      matchingCriteria: [
        {
          valueType: MeasurementService.VALUE_TYPES.POINT,
          points: 1,
        },
      ],
    },

    CobbAngle: {
      toAnnotation: CobbAngle.toAnnotation,
      toMeasurement: csToolsAnnotation =>
        CobbAngle.toMeasurement(
          csToolsAnnotation,
          displaySetService,
          cornerstoneViewportService,
          _getValueTypeFromToolType
        ),
      matchingCriteria: [
        {
          valueType: MeasurementService.VALUE_TYPES.ANGLE,
        },
      ],
    },

    Angle: {
      toAnnotation: Angle.toAnnotation,
      toMeasurement: csToolsAnnotation =>
        Angle.toMeasurement(
          csToolsAnnotation,
          displaySetService,
          cornerstoneViewportService,
          _getValueTypeFromToolType
        ),
      matchingCriteria: [
        {
          valueType: MeasurementService.VALUE_TYPES.ANGLE,
        },
      ],
    },
  };

  // set up custom tools mapping factory.
  const customToolsMappingFactory = getCustomToolsMappingFactory();
  Object.keys(customToolsMappingFactory).forEach(factoryKey => {
    const customToolMappingFactory = customToolsMappingFactory[factoryKey];
    factories[factoryKey] = {
      toAnnotation: customToolMappingFactory.toAnnotation,
      toMeasurement: csToolsAnnotation =>
        customToolMappingFactory.toMeasurement(
          csToolsAnnotation,
          displaySetService,
          cornerstoneViewportService,
          _getValueTypeFromToolType
        ),
      matchingCriteria: customToolMappingFactory.getMatchingCriteriaArray(
        MeasurementService
      ),
    };
  });

  return factories;
};

export default measurementServiceMappingsFactory;