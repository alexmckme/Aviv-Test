import { functionHandler } from "@/libs/function";
import { getRepository } from "@/repositories/listings";
import { Listing, ListingWrite } from "@/types.generated";
import { EntityNotFound, NotFound } from "@/libs/errors";
// Adding rows to the prices table will have to happen when creating or updating a listing
import { getPriceRepository } from "@/repositories/prices";

export const getListings = functionHandler<Listing[]>(
  async (_event, context) => {
    const listings = await getRepository(context.postgres).getAllListings();

    return { statusCode: 200, response: listings };
  }
);

export const addListing = functionHandler<Listing, ListingWrite>(
  async (event, context) => {
    const listing = await getRepository(context.postgres).insertListing(
      event.body
    );

    // We use properties of listing to grab the id and price to create a new row in the prices table
    await getPriceRepository(context.postgres).insertPrice(
      listing.id,
      listing.latest_price_eur
    )

    return { statusCode: 201, response: listing };
  }
);

export const updateListing = functionHandler<Listing, ListingWrite>(
  async (event, context) => {
    try {
      // We check whether the price in the body is different from the existing listing. If so, we create a new row in the prices table
      const prevListing = await getRepository(context.postgres).getListing(parseInt(event.pathParameters.id))
      if (prevListing.latest_price_eur !== event.body.latest_price_eur) {
        await getPriceRepository(context.postgres).insertPrice(
          parseInt(event.pathParameters.id),
          event.body.latest_price_eur
        )
      }

      const listing = await getRepository(context.postgres).updateListing(
        parseInt(event.pathParameters.id),
        event.body
      );

      return { statusCode: 200, response: listing };
    } catch (e) {
      if (e instanceof EntityNotFound) {
        throw new NotFound(e.message);
      }

      throw e;
    }
  }
);
