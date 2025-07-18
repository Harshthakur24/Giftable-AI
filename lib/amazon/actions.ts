// @ts-nocheck
import "server-only";

import {
  SearchItemsRequest,
  PartnerType,
  Host,
  Region,
  SearchItemsResponse,
  SearchResultItem,
} from "paapi5-typescript-sdk";
import { sleep } from "../utils";
import { Client, ClientOptions } from "@elastic/elasticsearch";

let client: Client | null = null;

function initializeElasticClient() {
  if (!client) {
    const config: ClientOptions = {
      cloud: {
        id: process.env.ES_CLOUD_ID as string,
      },
      auth: {
        apiKey: process.env.ES_API_KEY as string,
      },
    };
    client = new Client(config);
  }
  return client;
}

export async function get_item_by_asin(
  asin: string
): Promise<SearchResultItem | undefined> {
  const elasticClient = initializeElasticClient();
  const { _source } = await elasticClient.get<SearchResultItem>({
    index: "amz-pa-api",
    id: asin,
  });

  return _source;
}

export async function search_items(
  query: string,
  page: number = 1,
  maxPrice: number = 100000
): Promise<SearchItemsResponse> {
  // Return fake response for now to avoid build issues
  return FakeResponse;
  
  // TODO: Implement real search when ready
  /*
  const request = new SearchItemsRequest(
    {
      Keywords: query,
      LanguagesOfPreference: ["en_IN"],
      Availability: "Available",
      Condition: "New", 
      SortBy: "Relevance",
      ItemCount: 4,
      ItemPage: page,
      MaxPrice: maxPrice * 100,
      MinPrice: 0,
      Resources: [
        "BrowseNodeInfo.BrowseNodes",
        "BrowseNodeInfo.BrowseNodes.Ancestor",
        "BrowseNodeInfo.WebsiteSalesRank",
        "CustomerReviews.Count",
        "CustomerReviews.StarRating",
        "Images.Primary.Small",
        "Images.Primary.Medium",
        "Images.Primary.Large",
        "Images.Variants.Small",
        "Images.Variants.Medium",
        "Images.Variants.Large",
        "ItemInfo.ByLineInfo",
        "ItemInfo.ContentInfo",
        "ItemInfo.ContentRating",
        "ItemInfo.Classifications",
        "ItemInfo.ExternalIds",
        "ItemInfo.Features",
        "ItemInfo.ManufactureInfo",
        "ItemInfo.ProductInfo",
        "ItemInfo.TechnicalInfo",
        "ItemInfo.Title",
        "ItemInfo.TradeInInfo",
        "Offers.Listings.Availability.MaxOrderQuantity",
        "Offers.Listings.Availability.Message",
        "Offers.Listings.Availability.MinOrderQuantity",
        "Offers.Listings.Availability.Type",
        "Offers.Listings.Condition",
        "Offers.Listings.Condition.SubCondition",
        "Offers.Listings.DeliveryInfo.IsAmazonFulfilled",
        "Offers.Listings.DeliveryInfo.IsFreeShippingEligible",
        "Offers.Listings.DeliveryInfo.IsPrimeEligible",
        "Offers.Listings.DeliveryInfo.ShippingCharges",
        "Offers.Listings.IsBuyBoxWinner",
        "Offers.Listings.LoyaltyPoints.Points",
        "Offers.Listings.MerchantInfo",
        "Offers.Listings.Price",
        "Offers.Listings.ProgramEligibility.IsPrimeExclusive",
        "Offers.Listings.ProgramEligibility.IsPrimePantry",
        "Offers.Listings.Promotions",
        "Offers.Listings.SavingBasis",
        "Offers.Summaries.HighestPrice",
        "Offers.Summaries.LowestPrice",
        "Offers.Summaries.OfferCount",
        "ParentASIN",
        "RentalOffers.Listings.Availability.MaxOrderQuantity",
        "RentalOffers.Listings.Availability.Message",
        "RentalOffers.Listings.Availability.MinOrderQuantity",
        "RentalOffers.Listings.Availability.Type",
        "RentalOffers.Listings.BasePrice",
        "RentalOffers.Listings.Condition",
        "RentalOffers.Listings.Condition.SubCondition",
        "RentalOffers.Listings.DeliveryInfo.IsAmazonFulfilled",
        "RentalOffers.Listings.DeliveryInfo.IsFreeShippingEligible",
        "RentalOffers.Listings.DeliveryInfo.IsPrimeEligible",
        "RentalOffers.Listings.MerchantInfo",
        "SearchRefinements",
      ],
    },
    {
      AccessKey: process.env.AMAZON_ACCESS_KEY!,
      SecretKey: process.env.AMAZON_SECRET_KEY!,
      PartnerTag: "geschenkideeio-21",
      PartnerType: PartnerType.ASSOCIATES,
      Marketplace: "www.amazon.de",
      Host: Host.GERMANY,
      Region: Region.GERMANY,
    }
  );

  try {
    return await request.send();
  } catch (error) {
    console.error("Amazon search error:", error);
    return FakeResponse;
  }
  */
}

export const FakeResponse: SearchItemsResponse = {
  SearchResult: {
    Items: [
      {
        ASIN: "B0BPSLH3G7",
        BrowseNodeInfo: {
          BrowseNodes: [
            {
              ContextFreeName: "Preserved Flowers",
              DisplayName: "Preserved Flowers", 
              Id: "26470768031",
              IsRoot: false,
              SalesRank: 15,
            },
          ],
          WebsiteSalesRank: { SalesRank: 12767 },
        },
        DetailPageURL:
          "https://www.amazon.in/dp/B0BPSLH3G7?tag=giftable-ai-21&linkCode=osi&th=1&psc=1",
        Images: {
          Primary: {
            Large: {
              Height: 500,
              URL: "https://m.media-amazon.com/images/I/51iFFlZgsDL._SL500_.jpg",
              Width: 500,
            },
            Medium: {
              Height: 160,
              URL: "https://m.media-amazon.com/images/I/51iFFlZgsDL._SL160_.jpg",
              Width: 160,
            },
            Small: {
              Height: 75,
              URL: "https://m.media-amazon.com/images/I/51iFFlZgsDL._SL75_.jpg",
              Width: 75,
            },
          },
          Variants: [
            {
              Large: {
                Height: 500,
                URL: "https://m.media-amazon.com/images/I/518ODtlAnhL._SL500_.jpg",
                Width: 500,
              },
              Medium: {
                Height: 160,
                URL: "https://m.media-amazon.com/images/I/518ODtlAnhL._SL160_.jpg",
                Width: 160,
              },
              Small: {
                Height: 75,
                URL: "https://m.media-amazon.com/images/I/518ODtlAnhL._SL75_.jpg",
                Width: 75,
              },
            }
          ],
        },
        ItemInfo: {
          ByLineInfo: {
            Brand: {
              DisplayValue: "BoriYa",
              Label: "Brand",
              Locale: "en_IN",
            },
            Manufacturer: {
              DisplayValue: "BoriYa",
              Label: "Manufacturer",
              Locale: "en_IN",
            },
          },
          Classifications: {
            ProductGroup: {
              DisplayValue: "Home & Kitchen",
              Label: "ProductGroup",
              Locale: "en_IN",
            },
          },
          Features: {
            DisplayValues: [
              "Rose in Glass with Light 💕 Red eternal rose in full bloom surrounded by eucalyptus leaves and accented with LED light and pearls. The unique warm light design makes the rose glass angel sparkle and glow with living beauty. Day and night you can feel the romantic, warm and loving atmosphere through the glass cover.",
              "Eternal Heart 💕 Infinity roses handcrafted from carefully selected real roses, unique preservation technique preserves the color and structure of the roses, so they bloom forever and never fade. Preserved roses symbolize the eternal and passionate love you want to express to your loved one.",
              "Eternal Rose in Angel Glass Dome 💕 The exclusive design of the glass angel is crystal clear, with a golden halo around the head and open wings behind. A lifelike forever rose angel figure, like a butterfly fairy representing love and beauty, will bring luck and hope to your loved ones.",
              "Rose in Glass 💕 The angel glass is made of newly developed, thickened high borosilicate glass and is protected by thickened and flexible foam packaging. The eternal flower angel has a solid wooden base that greatly reduces breakage caused by logistics.",
              "Mother's Day Gifts for Mom 💕 The LED eternal rose angel comes in a beautiful gift box with handles and comes with a greeting card so you can give the angel eternal roses directly to your loved ones. Eternal rose in glass with LED light is a surprise for mom."
            ],
            Label: "Features",
            Locale: "en_IN",
          },
          Title: {
            DisplayValue: "BoriYa Mother's Day Gift Infinity Rose in Glass Angel - Eternal Rose in Angel Glass Dome with LED Light and Pearls, Preserved Flowers in Angel Figure, Eternal Rose Gift for Mom, Women",
            Label: "Title",
            Locale: "en_IN",
          },
        },
        Offers: {
          Listings: [
            {
              Availability: {
                Message: "In Stock",
                MinOrderQuantity: 1,
                Type: "Now",
              },
              Condition: { SubCondition: { Value: "New" }, Value: "New" },
              DeliveryInfo: {
                IsAmazonFulfilled: true,
                IsFreeShippingEligible: true,
                IsPrimeEligible: true,
              },
              Price: {
                Amount: 1499,
                Currency: "INR",
                DisplayAmount: "₹1,499",
              },
              ProgramEligibility: {
                IsPrimeExclusive: false,
                IsPrimePantry: false,
              },
            }
          ]
        }
      }
    ],
    SearchRefinements: {
      SearchIndex: {
        Bins: [
          { DisplayName: "Electronics", Id: "Electronics" },
          { DisplayName: "Home & Kitchen", Id: "HomeAndKitchen" },
          { DisplayName: "Office Products", Id: "OfficeProducts" },
          { DisplayName: "Garden & Outdoors", Id: "GardenAndOutdoor" },
          { DisplayName: "Industrial & Scientific", Id: "Industrial" },
          { DisplayName: "Beauty", Id: "Beauty" },
          { DisplayName: "Toys & Games", Id: "ToysAndGames" },
          { DisplayName: "Sports & Outdoors", Id: "SportsAndOutdoors" },
          { DisplayName: "Lighting", Id: "Lighting" },
          { DisplayName: "Handmade", Id: "Handmade" },
          { DisplayName: "Grocery & Gourmet Foods", Id: "GroceryAndGourmetFood" },
          { DisplayName: "Baby", Id: "Baby" },
          { DisplayName: "Health & Personal Care", Id: "HealthPersonalCare" },
          { DisplayName: "Tools & Home Improvement", Id: "ToolsAndHomeImprovement" },
          { DisplayName: "Car & Motorbike", Id: "Automotive" },
          { DisplayName: "Gift Cards", Id: "GiftCards" },
          { DisplayName: "Computers & Accessories", Id: "Computers" },
          { DisplayName: "Everything Else", Id: "EverythingElse" },
          { DisplayName: "Large Appliances", Id: "Appliances" },
          { DisplayName: "Pet Supplies", Id: "PetSupplies" }
        ],
        DisplayName: "Category",
        Id: "SearchIndex"
      }
    },
    SearchURL: "https://www.amazon.in/s?k=flowers+mothers+day&rh=p_n_availability%3A-1%2Cp_n_condition-type%3ANew&tag=giftable-ai-21&linkCode=osi",
    TotalResultCount: 306
  }
};
