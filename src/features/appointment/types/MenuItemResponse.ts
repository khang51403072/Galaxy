export interface MenuItemResponse {
  result: boolean;
  errorMsg: string;
  errorCode: number;
  data: MenuItemEntity[];
}

export interface MenuItemEntity {
  id: string;
  categoryId: string;
  departmentId: string;
  backColor: string;
  image: string;
  foreColor: string;
  name: string;
  regularPrice: number;
  unitCost: number;
  duration: number;
  position: number;
  menuNumber: string;
  bonusAmount: number;
  turnLevelID: string;
  turnCredit: number;
  isNotCountTurn: boolean;
  menuItemType: string;//"ServicePackage"
  priceOption: string;
  isAllowItemDiscount: boolean;
  isAllowTicketDiscount: boolean;
  isTaxable: boolean;
  isAllowCommission: boolean;
  isAllowLoyaltyPoints: boolean;
  isEnforceDuration: boolean;
  autoDiscounts: string[];
  allowedEmployees: string[];
  servicePackageMaps: ServicePackageMap[];
  autoTaxes: string[];
}

export interface ServicePackageMap {
  mapMenuItemId: string;
  price: number;
} 