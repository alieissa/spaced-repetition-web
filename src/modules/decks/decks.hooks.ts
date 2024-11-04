/** @format */

import { omit } from 'lodash'
import { useMutation, useQuery } from 'react-query'
import useAppContext from 'src/app.hooks'
import { NDecks } from './decks.types'

export function useDecksQuery() {
  const { api: api_ } = useAppContext()
  
  const results = useQuery({
    queryKey: 'decks',
    queryFn: () => api_.get<NDecks.Deck[]>('decks'),
  })
  
  return results
}

export function useCreateDeckMutation() {
  const { api: api_ } = useAppContext()

  const result = useMutation({
    mutationFn: (deck: any) => api_.post<NDecks.Deck>('decks', deck),
  })

  return result
}

export function useDeleteDeckMutation() {
  const { api: api_ } = useAppContext()

  const mutation = useMutation({
    mutationFn: (deckId: string) => api_.delete(`decks/${deckId}`),
  })

  return mutation
}

export function useDeckByIdQuery(id: NDecks.Deck['id']) {
  const { api: api_ } = useAppContext()

  const result = useQuery({
    queryKey: ['deck', id],
    queryFn: () => api_.get<NDecks.Deck>(`decks/${id}`),
  })

  return result
}

export function useUpdateDeckMutation() {
  const { api: api_ } = useAppContext()

  const mutation = useMutation({
    mutationFn: (deck:NDecks.Deck) => api_.patch(`decks/${deck.id}`, omit(deck, 'id')),
  })

  return mutation
}

export function useUploadDecksMutation() {
    const { api: api_ } = useAppContext()

    const mutation = useMutation({
      mutationFn: (decksFile: File) => {
        const formdata = new FormData()
        formdata.append('filename', decksFile, decksFile.name)
        return api_.post('decks/upload', formdata)
      }
    })

    return mutation
}

export function useDownloadDecksQuery() {
  const { api: api_ } = useAppContext()

  const result = useQuery({
    queryKey: ['downloadDecks'],
    queryFn: () => api_.get<string>('decks/download'),
    enabled: false
  })

  return result
}
