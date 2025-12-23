export const payloadGraphQL = async (query: string, variables = {}) => {
    console.log("payloadGraphQL.ts - ", query, variables)
    const res = await fetch('/api/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}