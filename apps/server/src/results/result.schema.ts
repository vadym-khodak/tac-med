import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResultDocument = Result & Document;

@Schema()
export class Result {
  @Prop({ 
    required: true,
    validate: {
      validator: function(fullName: string) {
        const cyrillicPattern = /^[А-ЯІЇЄЁа-яіїєё]+$/;
        const words = fullName.trim().split(/\s+/);
        
        return words.length === 3 && 
               words.every(word => 
                 word.length >= 3 && 
                 cyrillicPattern.test(word) &&
                 word[0] === word[0].toUpperCase()
               );
      },
      message: 'Full name must be 3 Cyrillic words, each starting with capital letter and at least 3 characters long'
    }
  })
  full_name: string;

  @Prop({ required: true, default: Date.now })
  test_date: Date;

  @Prop({ 
    required: true,
    type: Object,
    validate: {
      validator: function(blockScores: Record<string, number>) {
        const blockKeys = Object.keys(blockScores);
        return blockKeys.length === 6 &&
               blockKeys.every(key => ['1', '2', '3', '4', '5', '6'].includes(key)) &&
               blockKeys.every(key => 
                 typeof blockScores[key] === 'number' && 
                 blockScores[key] >= 0 && 
                 blockScores[key] <= 100
               );
      },
      message: 'Block scores must contain scores for blocks 1-6 with values 0-100'
    }
  })
  block_scores: Record<string, number>;

  @Prop({ 
    required: true, 
    min: 0, 
    max: 100,
    get: (value: number) => Math.round(value * 100) / 100,
    set: (value: number) => Math.round(value * 100) / 100
  })
  total_score: number;

  @Prop({ required: true, type: [String] })
  incorrect_list: string[];
}

export const ResultSchema = SchemaFactory.createForClass(Result);

// Add indices for better performance
ResultSchema.index({ full_name: 1, test_date: -1 });
ResultSchema.index({ test_date: -1 });