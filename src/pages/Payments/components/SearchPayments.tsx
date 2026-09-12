import CustomInput from '../../../commons/components/CustomInput/CustomInput'

interface SearchPaymentsProps {
  onSearch: (value: string) => void
}

export default function SearchPayments({ onSearch }: SearchPaymentsProps) {
  return (
    <CustomInput
      type="search"
      placeholder="Search by order ID, method or status..."
      onChange={(e) => onSearch(e.target.value)}
      style={{ marginBottom: 16, width: '33%' }}
    />
  )
}
