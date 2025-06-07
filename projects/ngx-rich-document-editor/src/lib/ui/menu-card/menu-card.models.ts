export type Item = {
  name: string;
  iconLabel: string;
  blockType?: string; // TODO: In the future, make this more the component robust, but it's fine for now :-)
};

export type MenuCardCategoryItem = {
  name: string;
  items: Item[];
};
