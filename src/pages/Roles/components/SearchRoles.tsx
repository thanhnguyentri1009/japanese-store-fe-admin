import CustomInput from '../../../commons/components/CustomInput/CustomInput'

interface SearchRolesProps {
  onSearch: (value: string) => void
}

export default function SearchRoles({ onSearch }: SearchRolesProps) {
  return (
    <CustomInput
      type="search"
      placeholder="Search by name..."
      onChange={(e) => onSearch(e.target.value)}
      style={{ marginBottom: 16, width: '33%' }}
    />
  )
}
