import { Schema } from 'mongoose';

export const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
  tags: { type: [String], default: [] },
});
