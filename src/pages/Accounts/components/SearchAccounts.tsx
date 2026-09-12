import CustomInput from '../../../commons/components/CustomInput/CustomInput'

interface SearchAccountsProps {
  onSearch: (value: string) => void
}

export default function SearchAccounts({ onSearch }: SearchAccountsProps) {
  return (
    <CustomInput
      type="search"
      placeholder="Search by username or email..."
      onChange={(e) => onSearch(e.target.value)}
      style={{ marginBottom: 16, width: '33%' }}
    />
  )
}
