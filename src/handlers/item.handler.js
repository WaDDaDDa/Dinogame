
import { getGameAssets } from "../init/assets.js";
import { getItems, addItems} from "../models/item.model.js";

export const getItemHandler = (userId, payload) => {
  // 유저의 현재 스테이지 배열을 가져오고, 최대 스테이지 ID를 찾는다.
  const items = getItems(userId);
  if (!items.length) {
    return { status: "fail", message: "No stages found for user" };
  }

  addItems(userId, payload.itemId);
  return { status: "success", message: `itemId : ${payload.itemId}` };
};