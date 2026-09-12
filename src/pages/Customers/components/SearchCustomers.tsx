import CustomInput from '../../../commons/components/CustomInput/CustomInput'

interface SearchCustomersProps {
  onSearch: (value: string) => void
}

export default function SearchCustomers({ onSearch }: SearchCustomersProps) {
  return (
    <CustomInput
      type="search"
      placeholder="Search by name, email or phone..."
      onChange={(e) => onSearch(e.target.value)}
      style={{ marginBottom: 16, width: '33%' }}
    />
  )
}
