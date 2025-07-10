export interface CategoriesResponse {
  result: boolean;
  errorMsg: string;
  errorCode: number;
  data: CategoryEntity[];
}

export interface CategoryEntity {
  id: string;
  name: string;
  categoryType: string;
  position: number;
  rows: number;
  columns: number;
  fontSize: number;
  otherFontSize: number;
  menuItemStyleOption: string;
  image: string;
  isHide: boolean;
} 