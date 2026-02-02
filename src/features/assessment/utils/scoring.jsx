export function scoreAssessment(answers) {
  const domains = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

  Object.keys(answers).forEach((key) => {
    const domain = key.charAt(0)
    domains[domain] += answers[key] || 0
  })

  const total = Object.values(domains).reduce((a, b) => a + b, 0)
  const percentages = {}

  Object.keys(domains).forEach((domain) => {
    percentages[domain] = Math.round((domains[domain] / total) * 100)
  })

  const sorted = Object.entries(percentages)
    .sort((a, b) => b[1] - a[1])
    .map(([domain, score]) => ({ domain, score }))

  return {
    raw: domains,
    percentages,
    sorted,
    hollandCode: sorted
      .slice(0, 3)
      .map((d) => d.domain)
      .join(""),
    timestamp: new Date(),
  }
}
