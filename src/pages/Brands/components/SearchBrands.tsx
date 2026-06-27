import CustomInput from '../../../commons/components/CustomInput'

interface SearchBrandsProps {
  onSearch: (value: string) => void
}

export default function SearchBrands({ onSearch }: SearchBrandsProps) {
  return (
    <CustomInput
      type="search"
      placeholder="Search by name..."
      onChange={(e) => onSearch(e.target.value)}
      style={{ marginBottom: 16, width: '33%' }}
    />
  )
}
