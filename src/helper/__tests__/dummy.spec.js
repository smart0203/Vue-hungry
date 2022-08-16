import rollbar from "@/lib/rollbar";
jest.mock("@/lib/rollbar", () => ({
  __esModule: true, // this property makes it work
  default: {
    warn: jest.fn(),
  },
}));

it("should return correctly", () => {
  rollbar.warn("aaa");
  // const packDineIn = packageDummy("dine_in");
  // selectPackageGuard()
});
