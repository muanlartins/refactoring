import v0 from "../src/v0/statement.js";
import v1 from "../src/v1/statement.js";
import plays from "../plays.json" with { type: "json" };
import invoices from "../invoices.json" with { type: "json" };

test('Statement result', () => {
  const invoice = invoices[0];

  const v0Statement = v0(invoice, plays);
  const v1Statement = v1(invoice, plays);

  expect(v1Statement).toBe(v0Statement);
});