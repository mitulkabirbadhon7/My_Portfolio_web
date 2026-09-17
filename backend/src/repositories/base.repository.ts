import { Model, QueryFilter } from 'mongoose';

type FindFilter<T> = QueryFilter<T>;
type UpdateData<T> = Parameters<Model<T>['findByIdAndUpdate']>[1];

export class BaseRepository<T> {
  // Pass the specific Mongoose model (e.g., ProjectModel or UserModel) into the constructor
  constructor(public readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findAll(filter: FindFilter<T> = {}): Promise<T[]> {
    return await this.model.find(filter).exec();
  }

  async updateById(id: string, update: UpdateData<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}