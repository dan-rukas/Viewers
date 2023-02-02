import MeasurementService from './MeasurementService';

const MeasurementServiceRegistration = {
  altName: 'MeasurementService',
  name: 'measurementService',
  create: ({ configuration = {} }) => {
    return new MeasurementService();
  },
};

export default MeasurementServiceRegistration;
export { MeasurementService, MeasurementServiceRegistration };
