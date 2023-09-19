import PostgresClient from "serverless-postgres";
import { extractVariables } from "@/libs/postgres";
import { EntityNotFound } from "@/libs/errors";
import { Price } from "@/types.generated";

type PriceTableRow = {
  id?: number;
  listing_id: number;
  price_eur: number;
  created_date: Date;
}

function tableRowToPrice(row: PriceTableRow): Price {
  return {
    price_eur: row.price_eur,
    created_date: row.created_date.toISOString(),
  }
}

function priceToTableRow(
  listingId: number,
  price: number,
  createdDate: Date
): PriceTableRow {
  return {
    listing_id: listingId,
    price_eur: price,
    created_date: createdDate
  }
}

export function getPriceRepository(postgres: PostgresClient) {
  return {
    async getListingPrices(listingId: number) {
      const queryString = `SELECT * FROM prices WHERE listing_id = $1`;
      const queryValues = [listingId]

      const result = await postgres.query(queryString, queryValues)

      if (!(result.rows[0])) {
        throw new EntityNotFound(
          `Could not find listing prices with listing_id: ${listingId}`
        )
      }
      return result.rows.map(tableRowToPrice)
    },


    async insertPrice(listingId: number, price: number) {
      const tableRow = priceToTableRow(listingId, price, new Date());

      const {
        columns,
        variables,
        values: queryValues,
      } = extractVariables(tableRow);

      const queryString = `
      INSERT INTO prices (${columns.join(",")})
      VALUES(${variables})
      `;

      await postgres.query(queryString, queryValues);

    },

  }

}
