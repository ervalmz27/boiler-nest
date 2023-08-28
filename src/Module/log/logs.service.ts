import { Inject, Injectable } from '@nestjs/common';
import { LOG_CUSTOMER_PROVIDER } from '@/Helpers/contants';
import { LogCustomer } from './entities/customerLog.entity';

@Injectable()
export class LogsService {
  constructor(
    @Inject(LOG_CUSTOMER_PROVIDER)
    private readonly repository: typeof LogCustomer,
  ) {}

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id) {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async create(payload) {
    return await this.repository.create(payload);
  }

  async update(id, payload) {
    return await this.repository.update(payload, { where: { id } });
  }

  async remove(id) {
    return await this.repository.destroy({ where: { id } });
  }
}
