import CustomInput from '../../../commons/components/CustomInput/CustomInput'

interface SearchOrdersProps {
  onSearch: (value: string) => void
}

export default function SearchOrders({ onSearch }: SearchOrdersProps) {
  return (
    <CustomInput
      type="search"
      placeholder="Search by order ID or status..."
      onChange={(e) => onSearch(e.target.value)}
      style={{ marginBottom: 16, width: '33%' }}
    />
  )
}
