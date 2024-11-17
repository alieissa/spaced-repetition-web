/** @format */

import { omit } from 'lodash'
import { useMutation, useQuery } from 'react-query'
import useAppContext from 'src/app.hooks'

export function useDecksQuery() {
  const { api } = useAppContext()
  
  const results = useQuery({
    queryKey: 'decks',
    queryFn: () => api.get<Deck[]>('decks'),
  })
  
  return results
}

export function useCreateDeckMutation() {
  const { api } = useAppContext()

  const result = useMutation({
    mutationFn: (deck: any) => api.post<Deck>('decks', deck),
  })

  return result
}

export function useDeleteDeckMutation() {
  const { api } = useAppContext()

  const mutation = useMutation({
    mutationFn: (deckId: string) => api.delete(`decks/${deckId}`),
  })

  return mutation
}

export function useDeckByIdQuery(id: Deck['id']) {
  const { api } = useAppContext()

  const result = useQuery({
    queryKey: ['deck', id],
    queryFn: () => api.get<Deck>(`decks/${id}`),
  })

  return result
}

export function useUpdateDeckMutation() {
  const { api } = useAppContext()

  const mutation = useMutation({
    mutationFn: (deck:Deck) => api.patch(`decks/${deck.id}`, omit(deck, 'id')),
  })

  return mutation
}

export function useUploadDecksMutation() {
    const { api } = useAppContext()

    const mutation = useMutation({
      mutationFn: (decksFile: File) => {
        const formdata = new FormData()
        formdata.append('filename', decksFile, decksFile.name)
        return api.post('decks/upload', formdata)
      }
    })

    return mutation
}

export function useDownloadDecksQuery() {
  const { api } = useAppContext()

  const result = useQuery({
    queryKey: ['downloadDecks'],
    queryFn: () => api.get<string>('decks/download'),
    enabled: false
  })

  return result
}
