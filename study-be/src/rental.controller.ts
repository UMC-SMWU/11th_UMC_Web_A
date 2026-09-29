import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { RentalService } from './rental.service';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  // POST /rentals
  @Post()
  async createRental(@Body() body: { userId: number; bookId: number }) {
    return this.rentalService.createRental(body.userId, body.bookId);
  }

  // 선택 미션: PATCH /rentals/:rentalId/return
  @Patch(':rentalId/return')
  async returnRental(@Param('rentalId') rentalId: string) {
    return this.rentalService.returnRental(Number(rentalId));
  }
}