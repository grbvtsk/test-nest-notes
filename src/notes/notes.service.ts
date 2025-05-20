import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

export interface Note {
  _id: string;
  title: string;
  content?: string;
  createdAt: Date;
  tags?: string[];
}

@Injectable()
export class NotesService {
  constructor(@InjectModel('Note') private noteModel: Model<Note>) {}

  create(createNoteDto: CreateNoteDto) {
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }

  findAll(tag?: string) {
    if (tag) {
      return this.noteModel.find({ tags: tag }).exec();
    }
    return this.noteModel.find().exec();
  }

  async findOne(id: string) {
    const note = await this.noteModel.findById(id).exec();
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const updated = await this.noteModel.findByIdAndUpdate(id, updateNoteDto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Note not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.noteModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Note not found');
    return deleted;
  }
}
