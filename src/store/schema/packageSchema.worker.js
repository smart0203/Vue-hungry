import { normalize, schema } from "normalizr";

export default async function (originalPackageData) {
  const menu = new schema.Entity("menus");
  const menuSection = new schema.Entity("menuSections", {
    menus: [menu],
  });
  const packages = new schema.Entity("packages", {
    menuSections: [menuSection],
  });
  const packageSchema = [packages];
  return normalize(originalPackageData, packageSchema);
}
