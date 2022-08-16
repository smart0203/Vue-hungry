import DineInPack from "@/models/dineInPack";
import HahPack from "@/models/hahPack";
import AlaCartePack from "@/models/alaCartePack";
import { reactive } from "@vue/composition-api";
import { PackInterface } from "@/types/PackInterface";
// @ts-ignore
import { PRICING_TYPE_ALA_CARTE, PACKAGE_CODE_HAH } from "@/lib/constant";

function packageFactory(packageData: PackInterface) {
  let instance;
  if (packageData.pricingTypeSym === PRICING_TYPE_ALA_CARTE) {
    instance = new AlaCartePack(packageData);
  } else if (packageData.typeCode === PACKAGE_CODE_HAH) {
    instance = new HahPack(packageData);
  } else {
    instance = new DineInPack(packageData);
  }
  return reactive(instance);
}

export default packageFactory;
