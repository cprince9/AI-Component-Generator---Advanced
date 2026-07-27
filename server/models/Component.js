import mongoose from 'mongoose';

const componentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
    default: 'Untitled Component',
  },
  prompt: {
    type: String,
    required: [true, 'Please provide the prompt used to generate this component'],
  },
  framework: {
    type: String,
    required: true,
    default: 'html-css',
  },
  code: {
    type: String,
    required: [true, 'Please provide the generated HTML/JSX code'],
  },
  refinements: [
    {
      prompt: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
}, {
  timestamps: true,
});

const Component = mongoose.model('Component', componentSchema);
export default Component;
