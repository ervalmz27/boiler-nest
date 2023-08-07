import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '@/Helpers/contants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { UserTier } from './entities/userTier.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof Users,
  ) {}

  async create(userDto: CreateUserDto) {
    return await this.userRepository.create<Users>({ ...userDto });
  }

  async findAll(): Promise<Users[]> {
    return await this.userRepository.findAll<Users>({
      include: [{ model: UserTier }],
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne<Users>({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(
      { ...updateUserDto },
      {
        where: { id },
      },
    );
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
