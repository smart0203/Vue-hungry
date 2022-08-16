<template>
  <div>
    <div>
      <div class="flex w-full px-2 mx-auto lg:justify-center lg:w-10/12">
        <div class="w-1/3 step">
          <div class="step__icon">
            <img
              src="@/assets/jargon-icon-food.png"
              class="mx-auto"
              alt="first-icon"
              width="50"
               loading="lazy"
              height="50"
            />
          </div>
          <div
            class="flex justify-center font-black step__heading lg:items-center"
          >
            <p>{{ $t("steps.step1.title") }}</p>
          </div>
          <div class="step__body">
            <p>{{ $t("steps.step1.paragraph") }}</p>
          </div>
        </div>
        <div class="w-1/3 step">
          <div class="step__icon">
            <img
              src="@/assets/jargon-icon-price.png"
              class="mx-auto"
              alt="second-icon"
               loading="lazy"
              width="50"
              height="50"
            />
          </div>
          <div
            class="flex justify-center font-black step__heading lg:items-center"
          >
            <p>{{ $t("steps.step2.title") }}</p>
          </div>
          <div class="step__body">
            <p>{{ $t("steps.step2.paragraph") }}</p>
          </div>
        </div>
        <div class="w-1/3 step">
          <div class="step__icon">
            <img
              src="@/assets/jargon-icon-flexible.png"
              class="mx-auto"
              alt="third-icon"
              width="50"
               loading="lazy"
              height="50"
            />
          </div>
          <div
            class="flex justify-center font-black step__heading lg:items-center"
          >
            <p>{{ $t("steps.step3.title") }}</p>
          </div>
          <div class="step__body">
            <p>{{ $t("steps.step3.paragraph") }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>
<i18n>
{
  "en": {
    "steps": {
        "step1": {
            "title": "UNLIMITED DINING",
            "paragraph": "Convert A la Carte restaurant into Buffet suitable for any number of people"
        },
        "step2": {
            "title": "EASILY CONTROL BUDGET",
            "paragraph": "Don’t worry about how much you are going to pay"
        },
        "step3": {
            "title": "FLEXIBLE",
            "paragraph": "Free Booking, Free Cancellation. NET Price, Pay at the Restaurant"
        }
    }
  },
  "th": {
    "steps": {
        "step1": {
            "title": "อิ่มอร่อยไม่อั้น",
            "paragraph": "เปลี่ยนจากเมนู A la Carte เป็นแบบบุฟเฟ่ต์ ให้เลือกทานได้แบบไม่จำกัด!"
        },
        "step2": {
            "title": "คุมงบได้ง่ายขึ้น!",
            "paragraph": "ไม่ต้องปวดหัวว่ามื้อนี้จะจบที่เท่าไรราคาสุทธิ ไม่มีบวกเพิ่ม"
        },
        "step3": {
            "title": "สะดวกสบายกว่าที่เคย",
            "paragraph": "จองฟรี ยกเลิกฟรี ราคาเน็ต ทานเสร็จจ่ายที่ร้าน"
        }
    }
  }
}
</i18n>

<style lang="scss" scoped>
.jargon-img {
  width: 64px;
  height: 64px;
  @apply my-4;
}
@screen lg {
  .jargon-img {
    width: 98px;
    height: 98px;
  }
}

.steps {
  justify-content: center;
  line-height: 2;
}
.step {
  text-align: center;
  padding: 20px 5px;

  &__heading {
    height: 35px;
    p {
      margin: 0;
      font-size: 0.75rem;
      margin-top: 8px;
      line-height: 1.3;
    }
  }
  &__body {
    margin: 0;
    font-size: 10px;
    margin-top: 8px;
    line-height: 1.3;
    @screen lg {
      font-size: 13px;
    }
  }
  &__icon {
    img {
      width: 50px;
    }
  }
}

@media (min-width: 641px) {
  .step {
    width: 380px;
    text-align: center;
    padding: 40px 50px;

    &__heading {
      height: 35px;
      p {
        margin: 0;
        font-size: 15px;
        margin-top: 8px;
      }
    }
    &__body {
      p {
        margin: 0;
        font-size: 13px;
        margin-top: 8px;
        line-height: 1.3;
      }
    }
    &__icon {
      img {
        width: 50px;
      }
    }
  }
}
</style>
