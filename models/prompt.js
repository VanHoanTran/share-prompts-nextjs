import mongoose, { Schema, model, models } from 'mongoose';

const PromptSchema = new Schema({
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  prompt: {
    type: String,
    required: [true, 'Prompt cannot be empty!'],
  },
  tag: {
    type: String,
    required: [true, 'Tag cannot be empty!'],
  },
});

const Prompt = models.Prompt || model('Prompt', PromptSchema);
export default Prompt;
