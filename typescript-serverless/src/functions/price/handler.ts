import { functionHandler } from "@/libs/function";
import { Price } from "@/types.generated";
import { getPriceRepository } from "@/repositories/prices"

export const getListingPrices = functionHandler<Price[]>(
  // Will allow users to get an array of objects describing the history of prices for a given listing id
  async (event, context) => {
    const listingId = parseInt(event.pathParameters.id)
    const listingPrices = await getPriceRepository(context.postgres).getListingPrices(listingId)
    return { statusCode: 200, response: listingPrices}
  }
);
