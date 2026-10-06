import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class RentalRepository {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly pool: Pool,
  ) {}

  async createRental(userId: number, bookId: number) {
    const [result] = await this.pool.query(
      `
      INSERT INTO rental (
        user_id,
        book_id,
        rented_at,
        due_at
      )
      VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
      `,
      [userId, bookId],
    );

    return result;
  }
}
