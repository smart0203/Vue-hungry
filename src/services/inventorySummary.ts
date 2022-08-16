import useHttp from "@/composable/useHttp";

async function getInventoriesSummaries(restaurantId: string) {
  return await useHttp({
    url: `/restaurants/${restaurantId}/inventory_summaries.json`,
    method: "POST",
  });
}

export { getInventoriesSummaries };
