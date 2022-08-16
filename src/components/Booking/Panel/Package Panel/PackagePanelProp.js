const props = {
  nextStep: {
    type: Number,
    required: true,
  },
  availablePackages: {
    type: Object,
    required: true,
  },
  showSummary: {
    type: Boolean,
    default: true,
  },
  showBackIcon: {
    type: Boolean,
    default: true,
  },
};
export default props;
