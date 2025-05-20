import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { NoteSchema } from './note.schema';
import { ValidateObjectIdMiddleware } from './middlewares/validate-objectid.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateObjectIdMiddleware).forRoutes('notes/:id');
  }
}
