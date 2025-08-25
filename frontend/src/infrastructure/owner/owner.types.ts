import { BaseUser, UserRole } from "../user/user.types";
import { BoardingHousesIdList } from "../boarding-houses/boarding-house.types";
import { Permit } from "../common/types/permits.types";

export interface Owner extends BaseUser {
  role?: UserRole.OWNER;
  boardingHouses?: Array<BoardingHousesIdList>;
  permits?: Array<Permit>;
}

export interface OwnerState {
  selectedUser: Owner | null;
  filter: string | null;
  loading: boolean;
  error: string | null;
}
