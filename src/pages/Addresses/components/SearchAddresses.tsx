import CustomInput from '../../../commons/components/CustomInput/CustomInput'

interface SearchAddressesProps {
  onSearch: (value: string) => void
}

export default function SearchAddresses({ onSearch }: SearchAddressesProps) {
  return (
    <CustomInput
      type="search"
      placeholder="Search by address, city or country..."
      onChange={(e) => onSearch(e.target.value)}
      style={{ marginBottom: 16, width: '33%' }}
    />
  )
}
