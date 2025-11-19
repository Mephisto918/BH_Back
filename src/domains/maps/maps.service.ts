import { Inject, Injectable } from '@nestjs/common';
import { IDatabaseService } from 'src/infrastructure/database/database.interface';
import { MapMarker } from './maps.types';

@Injectable()
export class MapsService {
  constructor(
    @Inject('IDatabaseService') private readonly database: IDatabaseService,
  ) {}

  private get prisma() {
    return this.database.getClient();
  }

  async findAll() {
    return await this.prisma.$queryRaw<MapMarker[]>`
    SELECT
      bh.id,
      bh.name,

      -- Coordinates
      ST_Y(loc.coordinates) AS lat,
      ST_X(loc.coordinates) AS lng,

      -- Thumbnail from Image table
      (
        SELECT img.url
        FROM "Image" img
        WHERE img."entityType" = 'BOARDING_HOUSE'
          AND img."entityId" = bh.id
          AND img."type" = 'THUMBNAIL'
          AND img."isDeleted" = false
        ORDER BY img.id ASC
        LIMIT 1
      ) AS thumbnail,

      -- Minimum room price
      (
        SELECT MIN(r.price)
        FROM "Room" r
        WHERE r."boardingHouseId" = bh.id
          AND r."isDeleted" = false
      ) AS price

    FROM "BoardingHouse" bh
    JOIN "Location" loc
      ON bh."locationId" = loc.id
    WHERE bh."isDeleted" = false;
  `;
  }

  async findNearby(lat: number, lng: number, radius: number = 1000) {
    return await this.prisma.$queryRaw<MapMarker[]>`
    SELECT
      bh.id,
      bh.name,
      ST_Y(loc.coordinates) AS lat,
      ST_X(loc.coordinates) AS lng,
      (
        SELECT img.url
        FROM "Image" img
        WHERE img."entityType" = 'BOARDING_HOUSE'
          AND img."entityId" = bh.id
          AND img."type" = 'THUMBNAIL'
          AND img."isDeleted" = false
        ORDER BY img.id ASC
        LIMIT 1
      ) AS thumbnail,
      (
        SELECT MIN(r.price)
        FROM "Room" r
        WHERE r."boardingHouseId" = bh.id
          AND r."isDeleted" = false
      ) AS price,
      ST_Distance(
        loc.coordinates::geography,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
      ) AS distance
    FROM "BoardingHouse" bh
    JOIN "Location" loc ON bh."locationId" = loc.id
    WHERE bh."isDeleted" = false
      AND ST_DWithin(
        loc.coordinates::geography,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        ${radius}  -- radius in meters
      )
    ORDER BY distance ASC;
  `;
  }

  async findInBounds(bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }) {
    const { minLat, maxLat, minLng, maxLng } = bounds;

    return await this.prisma.$queryRaw<MapMarker[]>`
    SELECT
      bh.id,
      bh.name,

      ST_Y(loc.coordinates) AS lat,
      ST_X(loc.coordinates) AS lng,

      -- Thumbnail
      (
        SELECT img.url
        FROM "Image" img
        WHERE img."entityType" = 'BOARDING_HOUSE'
          AND img."entityId" = bh.id
          AND img."type" = 'THUMBNAIL'
          AND img."isDeleted" = false
        ORDER BY img.id ASC
        LIMIT 1
      ) AS thumbnail,

      -- Min price from rooms
      (
        SELECT MIN(r.price)
        FROM "Room" r
        WHERE r."boardingHouseId" = bh.id
          AND r."isDeleted" = false
      ) AS price

    FROM "BoardingHouse" bh
    JOIN "Location" loc ON bh."locationId" = loc.id
    WHERE bh."isDeleted" = false
      AND ST_Y(loc.coordinates) BETWEEN ${minLat} AND ${maxLat}
      AND ST_X(loc.coordinates) BETWEEN ${minLng} AND ${maxLng};
  `;
  }
}
