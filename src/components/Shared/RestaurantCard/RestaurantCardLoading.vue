<template functional>
  <div>
    <!-- restaurant image -->
    <div class="flex items-center">
      <div class="w-full h-32 bg-gray-300"></div>
    </div>
    <!-- restaurant info -->
    <div class="flex py-2 pb-0">
      <div class="flex flex-col flex-grow w-8/12">
        <!-- restaurant name -->
        <div class="flex flex-col">
          <span class="h-5 bg-gray-300"></span>
        </div>
      </div>
      <div class="flex flex-col items-end justify-around pl-1">
        <!-- is loading for restaurant rating, review score -->
        <div class="w-full">
          <div class="w-10/12 h-4 mx-auto mb-2 bg-gray-300"></div>
          <div class="w-10/12 h-2 mx-auto bg-gray-300"></div>
        </div>
      </div>
    </div>

    <div>
      <div class="flex py-2 pt-0">
        <!-- side by side cuisine,location with rating -->
        <div class="flex flex-col w-9/12 mr-1">
          <!-- restaurant cuisine & location -->
          <div class="flex items-center justify-around mb-1">
            <div class="flex items-center w-1/2">
              <div class="w-full h-2 mt-2 mr-2 bg-gray-300"></div>
            </div>
            <div class="flex items-center w-1/2">
              <div class="w-full h-2 mt-2 mr-2 bg-gray-300"></div>
            </div>
          </div>
          <!-- restaurant dine in / delivery -->
          <div class="w-full h-2 mt-2 mr-2 bg-gray-300"></div>
        </div>

        <div class="flex flex-col items-end justify-end w-3/12">
          <div class="w-10/12 h-2 mx-auto mt-2 bg-gray-300"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RestaurantCardLoading",
};
</script>
