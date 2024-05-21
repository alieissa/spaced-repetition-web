type Props = {
  open: boolean
}
export default function DeckDeleteConfirmationDialog(props: Props) {
  return props.open ? (
    <div data-testid="deck-delete-confirmation-dialog">Test</div>
  ) : null
}
