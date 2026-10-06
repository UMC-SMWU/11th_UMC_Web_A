import { Injectable } from '@nestjs/common';
import { RentalRepository } from './rental.repository.js';

@Injectable()
export class RentalService {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async createRental(userId: number, bookId: number) {
    return this.rentalRepository.createRental(userId, bookId);
  }
}
