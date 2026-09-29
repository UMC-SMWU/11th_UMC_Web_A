import { Injectable } from '@nestjs/common';
import { RentalRepository } from './rental.repository';

@Injectable()
export class RentalService {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async createRental(userId: number, bookId: number): Promise<any> {
    return this.rentalRepository.createRental(userId, bookId);
  }

  async returnRental(rentalId: number): Promise<any> {
    return this.rentalRepository.returnRental(rentalId);
  }
}