import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ required: true, min: 1, max: 6 })
  block: number;

  @Prop({ required: true })
  question: string;

  @Prop({ 
    required: true, 
    type: [String],
    validate: {
      validator: function(answers: string[]) {
        return answers.length === 4;
      },
      message: 'Answers array must contain exactly 4 items'
    }
  })
  answers: string[];

  @Prop({ 
    required: true, 
    type: [Number],
    validate: {
      validator: function(correct: number[]) {
        return correct.length > 0 && 
               correct.every(index => index >= 0 && index < 4) &&
               correct.length <= 4;
      },
      message: 'Correct array must contain valid indices (0-3)'
    }
  })
  correct: number[];

  @Prop({ required: false, default: '' })
  image_path: string;

  @Prop({ required: false, default: '' })
  youtube_url: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

// Add compound index for better performance
QuestionSchema.index({ block: 1 });