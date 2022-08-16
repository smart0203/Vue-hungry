import addURLQuery from "../addURLQueryHelper";

it("should return false if `falsy` value is passed", () => {
  const url = addURLQuery();
  expect(url).toBe(false);
});

it("should return false if `number` value is passed", () => {
  const url = addURLQuery(34343);
  expect(url).toBe(false);
});

it("should add `?` to end of string and add default query", () => {
  const url = "/admin";
  const parsedURL = addURLQuery(url);
  expect(parsedURL).toBe(`${url}?client_type=web`);

  const url1 = "/admin.json";
  const parsedURL1 = addURLQuery(url1);
  expect(parsedURL1).toBe(`${url1}?client_type=web`);

  const url2 = "/home/admin";
  const parsedURL2 = addURLQuery(url2);
  expect(parsedURL2).toBe(`${url2}?client_type=web`);

  const url3 = "/home/admin/how-to-fix-bug";
  const parsedURL3 = addURLQuery(url3);
  expect(parsedURL3).toBe(`${url3}?client_type=web`);

  const url4 = "https://hungryhub.com/home/admin/how-to-fix-bug";
  const parsedUR4 = addURLQuery(url4);
  expect(parsedUR4).toBe(`${url4}?client_type=web`);
});

it("should add default query in existing url query ", () => {
  const url = "/admin?test=true";
  const parsedURL = addURLQuery(url);
  expect(parsedURL).toBe(`${url}&client_type=web`);

  const url1 = "/admin?test=true";
  const parsedURL1 = addURLQuery(url1);
  expect(parsedURL1).toBe(`${url1}&client_type=web`);
});
