import CustomInput from '../../../commons/components/CustomInput'

interface SearchCategoriesProps {
  onSearch: (value: string) => void
}

export default function SearchCategories({ onSearch }: SearchCategoriesProps) {
  return (
    <CustomInput
      type="search"
      placeholder="Search by name or description..."
      onChange={(e) => onSearch(e.target.value)}
      style={{ marginBottom: 16, width: '33%' }}
    />
  )
}
