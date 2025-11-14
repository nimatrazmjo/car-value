import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        const user = this.repo.create({email, password})
        return this.repo.save(user)
    }

    findOne(id: number) {
        return this.repo.findOneBy({id})
    }

    find(email: string) {
        const user = this.repo.find({where: {email}});
        if (!user) {
            throw new NotFoundException('User not found')
        }
    }

    findAll() {
        return this.repo.find();
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        Object.assign(user,attrs)
        return this.repo.save(user)
    }

    async remove(id: number) {
        const user = await this.findOne(id)
        if (!user) {
            throw new NotFoundException('User not Found')
        }

        return this.repo.remove(user)

    }
}
