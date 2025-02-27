export default function statement(invoice, plays) {
  enrichInvoice(invoice, plays);
  
  return consolidateStatementReport(invoice);
}

function enrichInvoice(invoice, plays) {
  invoice.performances.forEach((performance) => enrichPerformance(performance, plays));

  invoice.amount = invoice.performances.reduce((sum, performance) => sum + performance.amount, 0);
  invoice.credits = invoice.performances.reduce((sum, performance) => sum + performance.credits, 0);
}

function enrichPerformance(performance, plays) {
  getPerformancePlay(performance, plays);

  const calculator = getCalculator(performance);
  calculator.calculateAmount(performance);
  calculator.calculateCredits(performance);
}

function getPerformancePlay(performance, plays) {
  performance.play = plays[performance.playID];
}

function getCalculator(performance) {
  switch (performance.play.type) {
    case "tragedy": 
      return TragedyCalculator;
    case "comedy": 
      return ComedyCalculator;
    default: 
      throw new Error(`unknown type: ${performance.play.type}`); 
  }
}

class AmountCalculator {
  constructor() {}

  calculateAmount(performance) {}

  calculateCredits(performance) {}
}

class ComedyCalculator extends AmountCalculator {
  static calculateAmount(performance) {
    performance.amount = 30000; 

    if (performance.audience > 20) { 
      performance.amount += 10000 + 500 * (performance.audience - 20); 
    }

    performance.amount += 300 * performance.audience; 
  }

  static calculateCredits(performance) {
    performance.credits = Math.max(performance.audience - 30, 0) + Math.floor(performance.audience / 5);
  }
}

class TragedyCalculator extends AmountCalculator {
  static calculateAmount(performance) {
    performance.amount = 40000; 

    if (performance.audience > 30) { 
      performance.amount += 1000 * (performance.audience - 30); 
    } 
  }

  static calculateCredits(performance) {
    performance.credits = Math.max(performance.audience - 30, 0);
  }
}

function consolidateStatementReport(invoice) {
  let report = `Statement for ${invoice.customer}\n`; 

  invoice.performances.forEach((performance) => 
    report += ` ${performance.play.name}: ${convertToUsd(performance.amount / 100)} (${performance.audience} seats)\n`
  );

  report += `Amount owed is ${convertToUsd(invoice.amount / 100)}\n`;
  report += `You earned ${invoice.credits} credits\n`; 

  return report;
}

function convertToUsd(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(value);
}