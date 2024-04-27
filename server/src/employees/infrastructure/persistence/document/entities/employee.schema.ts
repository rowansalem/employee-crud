import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';

import { Expose } from 'class-transformer';
import { PositionSchema } from '../../../../../positions/infrastructure/persistence/document/entities/position.schema';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type EmployeeSchemaDocument = HydratedDocument<EmployeeSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class EmployeeSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
    unique: true,
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  email: string | null;

  @Prop({
    type: String,
  })
  firstName: string | null;

  @Prop({
    type: String,
  })
  lastName: string | null;

  @Prop({
    type: Number,
  })
  salary: number | null;

  @Prop({
    type: PositionSchema,
  })
  position?: PositionSchema;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(EmployeeSchemaClass);
