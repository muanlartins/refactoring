import { statement } from "../src/v0/statement.js";
import plays from "../plays.json" with { type: "json" };
import invoices from "../invoices.json" with { type: "json" };

test('Statement result', () => {
  expect(statement(invoices[0], plays)).toBe(
`Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`);
});