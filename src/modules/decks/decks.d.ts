/** @format */

type Deck = {
  id?: string
  name: string
  description?: string
  cards: NCards.Card[]
}

// export type Initial = {
//   __type__: 'INITIAL'
//   id: string
//   name: string
//   description?: string
//   cards: NCards.Initial[]
// }

// export function Initial(d: Partial<Initial>): Initial {
//   return {
//     __type__: 'INITIAL',
//     // id: _.uniqueId(),
//     name: d.name || '',
//     description: d.description,
//     cards: d.cards || [NCards.Initial({})],
//   }
// }

// type Formed = {
//   __type__: 'FORMED'
//   id: string
//   name: string
//   description?: string
//   cards: NCards.Card[]
// }
