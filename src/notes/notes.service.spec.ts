import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotFoundException } from '@nestjs/common';

const mockNote = {
  _id: '507f191e810c19729de860ea',
  title: 'Test Note',
  content: 'This is a test',
  tags: ['test'],
  createdAt: new Date(),
};

const mockSave = jest.fn();
const mockNoteModelConstructor = jest.fn().mockImplementation((dto) => ({
  ...dto,
  save: mockSave,
}));

const mockNoteModelMethods = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(async () => {
    mockSave.mockClear();
    Object.values(mockNoteModelMethods).forEach((fn) => fn.mockReset());

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getModelToken('Note'),
          useValue: Object.assign(
            mockNoteModelConstructor,
            mockNoteModelMethods,
          ),
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a note', async () => {
      const dto: CreateNoteDto = {
        title: 'Test Note',
        content: 'This is a test',
        tags: ['test'],
      };

      const expected = { ...mockNote, ...dto };
      mockSave.mockResolvedValue(expected);

      const result = await service.create(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return all notes', async () => {
      mockNoteModelMethods.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockNote]),
      });

      const result = await service.findAll();
      expect(result).toEqual([mockNote]);
    });

    it('should return filtered notes by tag', async () => {
      mockNoteModelMethods.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockNote]),
      });

      const result = await service.findAll('test');
      expect(mockNoteModelMethods.find).toHaveBeenCalledWith({ tags: 'test' });
      expect(result).toEqual([mockNote]);
    });
  });

  describe('findOne', () => {
    it('should return a note by id', async () => {
      mockNoteModelMethods.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNote),
      });

      const result = await service.findOne('507f191e810c19729de860ea');
      expect(result).toEqual(mockNote);
    });

    it('should throw NotFoundException if not found', async () => {
      mockNoteModelMethods.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('bad-id')).rejects.toThrow('Note not found');
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const updatedNote = { ...mockNote, title: 'Updated' };
      mockNoteModelMethods.findByIdAndUpdate.mockResolvedValue(updatedNote);

      const result = await service.update('507f191e810c19729de860ea', {
        title: 'Updated',
      });
      expect(result).toEqual(updatedNote);
    });

    it('should throw NotFoundException if update fails', async () => {
      mockNoteModelMethods.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        service.update('bad-id', { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a note', async () => {
      mockNoteModelMethods.findByIdAndDelete.mockResolvedValue(mockNote);
      const result = await service.remove('507f191e810c19729de860ea');
      expect(result).toEqual(mockNote);
    });

    it('should throw NotFoundException if note not found', async () => {
      mockNoteModelMethods.findByIdAndDelete.mockResolvedValue(null);
      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
