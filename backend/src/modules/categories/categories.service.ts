import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    // Get both default categories and user's custom categories
    const categories = await this.prisma.category.findMany({
      where: {
        OR: [{ userId: null }, { userId }],
      },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });

    return categories;
  }

  async create(userId: string, dto: CreateCategoryDto) {
    // Check if category with same name already exists for this user
    const existing = await this.prisma.category.findFirst({
      where: {
        name: dto.name,
        OR: [{ userId }, { userId: null }],
      },
    });

    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        icon: dto.icon,
        color: dto.color,
        isDefault: false,
        userId,
      },
    });
  }

  async remove(userId: string, id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.isDefault) {
      throw new ForbiddenException('Cannot delete default categories');
    }

    if (category.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Find a default category to reassign expenses to
    const defaultCategory = await this.prisma.category.findFirst({
      where: { isDefault: true },
      orderBy: { name: 'asc' },
    });

    if (!defaultCategory) {
      throw new BadRequestException('Cannot delete category: no default category available for reassignment');
    }

    // Reassign all expenses from this category to a default one, then delete
    await this.prisma.$transaction([
      this.prisma.expense.updateMany({
        where: { categoryId: id },
        data: { categoryId: defaultCategory.id },
      }),
      this.prisma.category.delete({
        where: { id },
      }),
    ]);

    return { message: 'Category deleted successfully', reassignedTo: defaultCategory.name };
  }
}
