import CustomInput from '../../../commons/components/CustomInput/CustomInput'

interface SearchProductsProps {
  onSearch: (value: string) => void
}

export default function SearchProducts({ onSearch }: SearchProductsProps) {
  return (
    <CustomInput
      type="search"
      placeholder="Search by name or series..."
      onChange={(e) => onSearch(e.target.value)}
      style={{ marginBottom: 16, width: '33%' }}
    />
  )
}
